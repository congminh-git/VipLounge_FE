'use client';

import withAuth from '@/hoc/withAuth';
import CustomTable from '@/components/table';
import { useEffect, useState } from 'react';
import { activeAgencyByKey, deleteAgencyByKey, getAgencies } from '@/services/agency';
import Swal from 'sweetalert2';
import AddNewModal from '@/components/modals/agencyModals/addNewModal';
import UpdateModal from '@/components/modals/agencyModals/updateModal';
import DetailModal from '@/components/modals/agencyModals/detailModal';
import { getAirports } from '@/services/airport';

function Agencies() {
    const [agencyData, setAgencyData] = useState([]);
    const [airportData, setAirportData] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [selectedKey, setSelectedKey] = useState('0');

    const columns = [
        { name: 'STT', uid: 'stt' },
        { name: 'NAME', uid: 'name' },
        { name: 'CODE', uid: 'code' },
        { name: 'SERVICE', uid: 'service' },
        { name: 'AIRPORT', uid: 'airportCode' },
        { name: 'ACTIONS', uid: 'actions' },
    ];

    const actions = ['edit', 'delete', 'active'];

    const fetchAgenciesData = async () => {
        const result = await getAgencies();
        setAgencyData(result);
    };

    const fetchAirportsData = async () => {
        const result = await getAirports();
        setAirportData(result);
    };

    useEffect(() => {
        fetchAgenciesData();
        fetchAirportsData();
    }, []);

    const deleteAgency = async (id: string) => {
        Swal.fire({
            title: 'Xác nhận xóa đối tác',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await deleteAgencyByKey(id);
                if (response.status === 200) {
                    Swal.fire({
                        title: 'Xóa đối tác thành công',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    fetchAgenciesData();
                } else {
                    Swal.fire({
                        title: 'Xóa đối tác thất bại!',
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            }
        });
    };

    const activeAgency = async (id: string) => {
        Swal.fire({
            title: 'Xác nhận khóa đối tác',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await activeAgencyByKey(id);
                if (response.id || response.key) {
                    if (response.status === 0) {
                        Swal.fire({
                            title: 'Mở khóa đối tác thành công',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        fetchAgenciesData();
                    } else if (response.status === 1) {
                        Swal.fire({
                            title: 'Khóa đối tác thành công',
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
        <div className="p-1 pt-10 sm:p-16 sm:pt-12">
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
                setSelectedId={setSelectedKey}
                hasFilterByColumn={false}
            />
            <AddNewModal
                isOpen={openAddModal}
                onOpenChange={setOpenAddModal}
                reFetchData={fetchAgenciesData}
                airports={airportData}
            />
            <UpdateModal
                isOpen={openUpdateModal}
                onOpenChange={setOpenUpdateModal}
                reFetchData={fetchAgenciesData}
                agencyKey={selectedKey}
                airports={airportData}
            />
            <DetailModal isOpen={openDetailModal} onOpenChange={setOpenDetailModal} />
        </div>
    );
}

export default withAuth(Agencies);
