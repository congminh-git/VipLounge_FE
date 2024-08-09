'use client';

import withAuth from '@/hoc/withAuth';
import CustomTable from '@/components/table';
import { useEffect, useState } from 'react';
import { activeUserById, deleteUserById, getUsers } from '@/services/user';
import Swal from 'sweetalert2';
import AddNewModal from '@/components/modals/userModals/addNewModal';
import UpdateModal from '@/components/modals/userModals/updateModal';
import DetailModal from '@/components/modals/userModals/detailModal';
import { getAgencies } from '@/services/agency';

function Users() {
    const [userData, setUserData] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [selectedId, setSelectedId] = useState('0');
    const [listAgencies, setListAgencies] = useState([]);

    const columns = [
        { name: 'STT', uid: 'stt' },
        { name: 'USERNAME', uid: 'username' },
        { name: 'EMAIL', uid: 'email' },
        { name: 'NAME', uid: 'name' },
        { name: 'AGENCY', uid: 'agencyCode' },
        { name: 'SERVICE', uid: 'service' },
        { name: 'ROLE', uid: 'roleName' },
        { name: 'ACTIONS', uid: 'actions' },
    ];

    const actions = ['detail', 'edit', 'delete', 'active', 'change_password'];

    const fetchUsersData = async () => {
        const result = await getUsers();
        setUserData(result);
    };

    const fetchAgencies = async () => {
        const result = await getAgencies();
        setListAgencies(result);
    };

    const deleteUser = async (id: number) => {
        Swal.fire({
            title: 'Xác nhận xóa user',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const idStr = id.toString();
                const response = await deleteUserById(idStr);
                if (response.status === 200) {
                    Swal.fire({
                        title: 'Xóa tài khoản thành công',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    fetchUsersData();
                } else {
                    Swal.fire({
                        title: 'Xóa tài khoản thất bại!',
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            }
        });
    };

    const activeUser = async (id: number) => {
        Swal.fire({
            title: 'Xác nhận khóa user',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const idStr = id.toString();
                const response = await activeUserById(idStr);
                if (response.id) {
                    if (response.status === 0) {
                        Swal.fire({
                            title: 'Mở khóa tài khoản thành công',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        fetchUsersData();
                    } else if (response.status === 1) {
                        Swal.fire({
                            title: 'Khóa tài khoản thành công',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        fetchUsersData();
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

    useEffect(() => {
        fetchAgencies();
        fetchUsersData();
    }, []);

    return (
        <div className="p-16 pt-12">
            <CustomTable
                data={userData}
                columns={columns}
                searchBy={'email'}
                hasAddNew={true}
                actions={actions}
                deleteFunc={deleteUser}
                activeFunc={activeUser}
                onOpenAddModal={setOpenAddModal}
                onOpenUpdateModal={setOpenUpdateModal}
                onOpenDetailModal={setOpenDetailModal}
                setSelectedId={setSelectedId}
                hasFilterByColumn={true}
                filterByColumn={{ column: 'agencyCode', name: 'Đại lý' }}
                dataOfFilter={listAgencies}
            />
            <AddNewModal isOpen={openAddModal} onOpenChange={setOpenAddModal} reFetchData={fetchUsersData} />
            <UpdateModal
                isOpen={openUpdateModal}
                onOpenChange={setOpenUpdateModal}
                reFetchData={fetchUsersData}
                id={selectedId}
            />
            <DetailModal isOpen={openDetailModal} onOpenChange={setOpenDetailModal} id={selectedId} />
        </div>
    );
}

export default withAuth(Users);
