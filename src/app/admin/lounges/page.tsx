'use client';

import withAuth from '@/hoc/withAuth';
import CustomTable from '@/components/table';
import { useEffect, useState } from 'react';
import { deleteLoungeById, getLounges } from '@/services/lounge';
import Swal from 'sweetalert2';
import AddNewModal from '@/components/modals/loungeModals/addNewModal';
import UpdateModal from '@/components/modals/loungeModals/updateModal';
import DetailModal from '@/components/modals/loungeModals/detailModal';
import { getAirports } from '@/services/airport';
import { getAgencies } from '@/services/agency';
import { IAgency } from '@/types/Agency';

function Lounges() {
    const [loungeData, setLoungeData] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [selectedId, setSelectedId] = useState('0');
    const [listAirports, setListAirports] = useState([]);
    const [listAgencies, setListAgencies] = useState([]);

    const columns = [
        { name: 'STT', uid: 'stt' },
        { name: 'NAME', uid: 'name' },
        { name: 'CODE', uid: 'code' },
        { name: 'AGENCY', uid: 'agencyCode' },
        { name: 'AIRPORT', uid: 'airportCode' },
        { name: 'ACTIONS', uid: 'actions' },
    ];

    const actions = ['edit', 'delete'];

    const fetchLoungesData = async () => {
        const result = await getLounges();
        setLoungeData(result);
    };

    const deleteLounge = async (id: number) => {
        Swal.fire({
            title: 'Xác nhận xóa phòng chờ',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const idStr = id.toString();
                const response = await deleteLoungeById(idStr);
                if (response.status === 200) {
                    Swal.fire({
                        title: 'Xóa phòng chờ thành công',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    fetchLoungesData();
                } else {
                    Swal.fire({
                        title: 'Xóa phòng chờ thất bại!',
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            }
        });
    };

    const fetchAirports = async () => {
        const result = await getAirports();
        setListAirports(result);
    };

    const fetchAgencies = async () => {
        const result = await getAgencies();
        setListAgencies(result.filter((item: IAgency) => item.service === 'master' || item.service === 'lounge'));
    };

    useEffect(() => {
        fetchAirports();
        fetchAgencies();
        fetchLoungesData();
    }, []);

    return (
        <div className="p-16 pt-12">
            <CustomTable
                data={loungeData}
                columns={columns}
                searchBy={'name'}
                hasAddNew={true}
                actions={actions}
                deleteFunc={deleteLounge}
                onOpenAddModal={setOpenAddModal}
                onOpenUpdateModal={setOpenUpdateModal}
                onOpenDetailModal={setOpenDetailModal}
                setSelectedId={setSelectedId}
                hasFilterByColumn={true}
                filterByColumn={{ column: 'agencyCode', name: 'Đại lý' }}
                dataOfFilter={listAgencies}
            />
            <AddNewModal
                isOpen={openAddModal}
                onOpenChange={setOpenAddModal}
                reFetchData={fetchLoungesData}
                listAirports={listAirports}
                listAgencies={listAgencies}
            />
            <UpdateModal
                isOpen={openUpdateModal}
                onOpenChange={setOpenUpdateModal}
                reFetchData={fetchLoungesData}
                id={selectedId}
                listAirports={listAirports}
                listAgencies={listAgencies}
            />
            <DetailModal isOpen={openDetailModal} onOpenChange={setOpenDetailModal} />
        </div>
    );
}

export default withAuth(Lounges);
