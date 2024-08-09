'use client';

import withAuth from '@/hoc/withAuth';
import CustomTable from '@/components/table';
import { useEffect, useState } from 'react';
import { activeAgencyById, deleteAgencyById, getAgencies } from '@/services/agency';
import Swal from 'sweetalert2';
import AddNewModal from '@/components/modals/agencyModals/addNewModal';
import UpdateModal from '@/components/modals/agencyModals/updateModal';
import DetailModal from '@/components/modals/agencyModals/detailModal';

function Agencies() {
    const [agencyData, setAgencyData] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [selectedId, setSelectedId] = useState('0');

    const columns = [
        { name: 'STT', uid: 'stt' },
        { name: 'NAME', uid: 'name' },
        { name: 'CODE', uid: 'code' },
        { name: 'SERVICE', uid: 'service' },
        { name: 'ACTIONS', uid: 'actions' },
    ];

    const actions = ['edit', 'delete', 'active'];

    const fetchAgenciesData = async () => {
        const result = await getAgencies();
        setAgencyData(result);
    };

    useEffect(() => {
        fetchAgenciesData();
    }, []);

    const deleteAgency = async (id: number) => {
        Swal.fire({
            title: 'Xác nhận xóa đại lý',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const idStr = id.toString();
                const response = await deleteAgencyById(idStr);
                if (response.status === 200) {
                    Swal.fire({
                        title: 'Xóa đại lý thành công',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    fetchAgenciesData();
                } else {
                    Swal.fire({
                        title: 'Xóa đại lý thất bại!',
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            }
        });
    };

    const activeAgency = async (id: number) => {
        Swal.fire({
            title: 'Xác nhận khóa đại lý',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const idStr = id.toString();
                const response = await activeAgencyById(idStr);
                if (response.id) {
                    if (response.status === 0) {
                        Swal.fire({
                            title: 'Mở khóa đại lý thành công',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        fetchAgenciesData();
                    } else if (response.status === 1) {
                        Swal.fire({
                            title: 'Khóa đại lý thành công',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        fetchAgenciesData();
                    } else {
                        Swal.fire({
                            title: 'Có lỗi xảy ra',
                            icon: 'error',
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    }
                }
            }
        });
    };

    return (
        <div className="p-16 pt-12">
            <CustomTable
                data={agencyData}
                columns={columns}
                searchBy={'name'}
                hasAddNew={true}
                actions={actions}
                deleteFunc={deleteAgency}
                activeFunc={activeAgency}
                onOpenAddModal={setOpenAddModal}
                onOpenUpdateModal={setOpenUpdateModal}
                onOpenDetailModal={setOpenDetailModal}
                setSelectedId={setSelectedId}
                hasFilterByColumn={false}
            />
            <AddNewModal isOpen={openAddModal} onOpenChange={setOpenAddModal} reFetchData={fetchAgenciesData} />
            <UpdateModal
                isOpen={openUpdateModal}
                onOpenChange={setOpenUpdateModal}
                reFetchData={fetchAgenciesData}
                id={selectedId}
            />
            <DetailModal isOpen={openDetailModal} onOpenChange={setOpenDetailModal} />
        </div>
    );
}

export default withAuth(Agencies);
