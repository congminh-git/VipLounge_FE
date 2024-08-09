'use client';

import withAuth from '@/hoc/withAuth';
import CustomTable from '@/components/table';
import { useEffect, useState } from 'react';
import { deleteConnectingServiceById, getConnectingServices } from '@/services/connectingService';
import Swal from 'sweetalert2';
import DetailModal from '@/components/modals/connectingServiceModals/detailModal';
import UpdateModal from '@/components/modals/connectingServiceModals/updateModal';
import AddNewModal from '@/components/modals/connectingServiceModals/addNewModal';
import { getAirports } from '@/services/airport';
import { getAgencies } from '@/services/agency';
import { IAgency } from '@/types/Agency';
import { IAirport } from '@/types/Airport';

function ConnectingServices() {
    const [connectingServiceData, setConnectingServiceData] = useState([]);
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

    const fetchConnectingServicesData = async () => {
        const result = await getConnectingServices();
        setConnectingServiceData(result);
    };

    const deleteConnectingService = async (id: number) => {
        Swal.fire({
            title: 'Xác nhận xóa dịch vụ nối chuyến',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const idStr = id.toString();
                const response = await deleteConnectingServiceById(idStr);
                if (response.status === 200) {
                    Swal.fire({
                        title: 'Xóa dịch vụ nối chuyến thành công',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    fetchConnectingServicesData();
                } else {
                    Swal.fire({
                        title: 'Xóa dịch vụ nối chuyến thất bại!',
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
        setListAgencies(
            result.filter((item: IAgency) => item.service === 'master' || item.service === 'connecting_flight'),
        );
    };

    useEffect(() => {
        fetchAirports();
        fetchAgencies();
        fetchConnectingServicesData();
    }, []);

    return (
        <div className="p-16 pt-12">
            <CustomTable
                data={connectingServiceData}
                columns={columns}
                searchBy={'name'}
                hasAddNew={true}
                actions={actions}
                deleteFunc={deleteConnectingService}
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
                reFetchData={fetchConnectingServicesData}
                listAirports={listAirports}
                listAgencies={listAgencies}
            />
            <UpdateModal
                isOpen={openUpdateModal}
                onOpenChange={setOpenUpdateModal}
                reFetchData={fetchConnectingServicesData}
                id={selectedId}
                listAirports={listAirports}
                listAgencies={listAgencies}
            />
            <DetailModal isOpen={openDetailModal} onOpenChange={setOpenDetailModal} />
        </div>
    );
}

export default withAuth(ConnectingServices);
