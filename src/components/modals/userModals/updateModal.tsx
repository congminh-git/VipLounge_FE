import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Autocomplete,
    AutocompleteItem,
    RadioGroup,
    Radio,
    CheckboxGroup,
    Checkbox,
} from '@nextui-org/react';
import { IAgency } from '@/types/Agency';
import { getAgencies } from '@/services/agency';
import { getPermissions } from '@/services/permission';
import { getRoles } from '@/services/role';
import { permission } from 'process';
import { createUser, getUserById, updateUserById } from '@/services/user';
import Swal from 'sweetalert2';
import { IPermission, IRole } from './addNewModal';

interface IUpdate {
    // password: string;
    name: string;
    phone: string;
    roleName: string;
    agencyCode: string;
    service: string;
    serviceOption: string;
    permissions: string;
}

interface IUpdateModal {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    reFetchData: () => void;
    id: string;
}

export interface User {
    id: number;
    email: string;
    password: string;
    name: string;
    phone: string;
    service: string;
    serviceOption: string;
    agencyCode: string;
    roleName: string;
    permissions: string;
    status: number;
    agency: IAgency;
}

export default function UpdateModal({ isOpen, onOpenChange, reFetchData, id }: IUpdateModal) {
    const [userData, setUserData] = useState<User>();
    const [listAgencies, setListAgencies] = useState([]);
    const [listRoles, setListRoles] = useState([]);
    const [listPermissions, setListPermissions] = useState([]);
    const [fullName, setFullName] = useState<string>('');
    const [fullNameInvalid, setFullNameInvalid] = useState<boolean>(false);
    const [phone, setPhone] = useState<string>('');
    const [phoneInvalid, setPhoneInvalid] = useState<boolean>(false);
    const [agencyValue, setAgencyValue] = useState<string>('');
    const [agencyCode, setAgencyCode] = useState<string>('');
    const [agencyCodeInvalid, setAgencyCodeInvalid] = useState<boolean>(false);
    const [service, setService] = useState<string>('');
    const [serviceInvalid, setServiceInvalid] = useState<boolean>(false);
    const [serviceOption, setServiceOption] = useState<string>('');
    const [serviceOptionValue, setServiceOptionValue] = useState<string>('');
    const [serviceOptionInvalid, setServiceOptionInvalid] = useState<boolean>(false);
    const [listServiceOptions, setListServiceOptions] = useState<any[]>([]);
    const [role, setRole] = useState<string>('STAFF');
    const [roleInvalid, setRoleInvalid] = useState<boolean>(false);
    const [permission, setPermission] = useState<string[]>([]);
    const [permissionNotFilter, setPermissionNotFilter] = useState<string[]>([]);
    const [permissionInvalid, setPermissionInvalid] = useState<boolean>(false);
    const [disableLounge, setDisableLounge] = useState<boolean>(false);
    const [disableConnectingFlight, setDisableConnectingFlight] = useState<boolean>(false);

    const fetchAgencies = async () => {
        const result = await getAgencies();
        setListAgencies(result);
    };

    const fetchPermissions = async () => {
        const result = await getPermissions();
        setListPermissions(result);
    };

    const fetchRoles = async () => {
        const result = await getRoles();
        setListRoles(result);
    };

    const fetchUsersData = async (id: string) => {
        const result = await getUserById(id);
        setUserData(result);
    };

    const update = async (id: string, body: IUpdate) => {
        const result = await updateUserById(id, body);
        return result;
    };

    const handleSubmit = async () => {
        let fullNameInvalidBool,
            phoneInvalidBool,
            agencyCodeInvalidBool,
            serviceInvalidBool,
            serviceOptionInvalidBool,
            roleInvalidBool,
            permissionInvalidBool;

        if (!fullName || fullName.trim() === '') {
            fullNameInvalidBool = true;
            setFullNameInvalid(true);
        }

        if (!phone || phone.trim() === '') {
            phoneInvalidBool = true;
            setPhoneInvalid(true);
        }

        {
            if (role === 'STAFF') {
                if (!agencyCode || agencyCode.trim() === '') {
                    agencyCodeInvalidBool = true;
                    setAgencyCodeInvalid(true);
                }

                if (!service || service.trim() === '') {
                    serviceInvalidBool = true;
                    setServiceInvalid(true);
                }

                if (!serviceOption || serviceOption.trim() === '') {
                    serviceOptionInvalidBool = true;
                    setServiceOptionInvalid(true);
                }
            }
        }

        if (!role || role.trim() === '') {
            roleInvalidBool = true;
            setRoleInvalid(true);
        }

        if (!permission || permission.length === 0) {
            permissionInvalidBool = true;
            setPermissionInvalid(true);
        }

        if (
            !fullNameInvalidBool &&
            !phoneInvalidBool &&
            !agencyCodeInvalidBool &&
            !serviceInvalidBool &&
            !serviceOptionInvalidBool &&
            !roleInvalidBool &&
            !permissionInvalidBool
        ) {
            const body: IUpdate = {
                // password: password,
                name: fullName,
                phone: phone,
                agencyCode: agencyCode,
                service: service,
                serviceOption: serviceOption,
                roleName: role,
                permissions: JSON.stringify(permission),
            };
            const result: any = await update(id, body);
            if (result.id) {
                Swal.fire({
                    title: 'Cập nhật người dùng thành công',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                });

                setAgencyCodeInvalid(false);
                setFullNameInvalid(false);
                setPhoneInvalid(false);
                setRoleInvalid(false);
                setPermissionInvalid(false);
                reFetchData();
                onOpenChange(false);
            } else {
                Swal.fire({
                    title: 'Cập nhật người dùng thất bại',
                    text: result.response.data.message || 'Something went wrong!',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        }
    };

    useEffect(() => {
        fetchAgencies();
        fetchPermissions();
        fetchRoles();
    }, []);

    useEffect(() => {
        if (permissionNotFilter.length > 0) {
            if (permissionNotFilter.length > permission.length) {
                const addPermission = permissionNotFilter.find((element) => !permission.includes(element));
                if (addPermission === 'CHECK_ALL') {
                    let newPermissions = permissionNotFilter.filter(
                        (element) => element !== 'CHECK_USER_OWNED' && element !== 'CHECK_AGENCY_OWNED',
                    );
                    setPermission(newPermissions);
                } else if (addPermission === 'CHECK_USER_OWNED') {
                    let newPermissions = permissionNotFilter.filter(
                        (element) => element !== 'CHECK_ALL' && element !== 'CHECK_AGENCY_OWNED',
                    );
                    setPermission(newPermissions);
                } else if (addPermission === 'CHECK_AGENCY_OWNED') {
                    let newPermissions = permissionNotFilter.filter(
                        (element) => element !== 'CHECK_ALL' && element !== 'CHECK_USER_OWNED',
                    );
                    setPermission(newPermissions);
                } else if (addPermission === 'HISTORY_VIEW_ALL') {
                    let newPermissions = permissionNotFilter.filter(
                        (element) => element !== 'HISTORY_VIEW_USER_OWNED' && element !== 'HISTORY_VIEW_AGENCY_OWNED',
                    );
                    setPermission(newPermissions);
                } else if (addPermission === 'HISTORY_VIEW_USER_OWNED') {
                    let newPermissions = permissionNotFilter.filter(
                        (element) => element !== 'HISTORY_VIEW_ALL' && element !== 'HISTORY_VIEW_AGENCY_OWNED',
                    );
                    setPermission(newPermissions);
                } else if (addPermission === 'HISTORY_VIEW_AGENCY_OWNED') {
                    let newPermissions = permissionNotFilter.filter(
                        (element) => element !== 'HISTORY_VIEW_ALL' && element !== 'HISTORY_VIEW_USER_OWNED',
                    );
                    setPermission(newPermissions);
                } else {
                    setPermission(permissionNotFilter);
                }
            }
        }
    }, [permissionNotFilter]);

    useEffect(() => {
        const regex = /\(([^)]+)\)/;
        if (serviceOptionValue) {
            const match = serviceOptionValue.match(regex);
            if (match) {
                setServiceOption(match[1]);
            }
        }
        if (agencyValue) {
            const match = agencyValue.match(regex);
            if (match) {
                setAgencyCode(match[1]);
            }
        }
    }, [serviceOptionValue, agencyValue]);

    useEffect(() => {
        const agencyElement = document.querySelector('.agency-');
        if (agencyElement) {
            (agencyElement as HTMLElement).style.display = 'none';
        }
        const serviceOptionElement = document.querySelector('.service-option-');
        if (serviceOptionElement) {
            (serviceOptionElement as HTMLElement).style.display = 'none';
        }
    }, [agencyCode]);

    useEffect(() => {
        if (agencyCode) {
            // setService('');
            const agency: any = listAgencies.find((element: IAgency) => element.code === agencyCode);
            if (agency) {
                setDisableLounge(agency.service === 'master' || agency.service === 'lounge' ? false : true);
                setDisableConnectingFlight(
                    agency.service === 'master' || agency.service === 'connecting_flight' ? false : true,
                );
            } else {
                setDisableLounge(true);
                setDisableConnectingFlight(true);
            }
        }
    }, [agencyCode]);

    useEffect(() => {
        if (role && listRoles) {
            const element: any = listRoles.find((element: IRole) => element.roleName === role);
            if (element) {
                setPermission(JSON.parse(element.permissions));
            }
        }
    }, [role, listRoles]);

    useEffect(() => {
        if (agencyCode && listAgencies && service) {
            const agency: any = listAgencies.find((element: IAgency) => element.code === agencyCode);
            if (agency) {
                setListServiceOptions(agency[service === 'lounge' ? 'lounges' : 'cfroms']);
                console.log(agencyCode, agency[service === 'lounge' ? 'lounges' : 'cfroms']);
            }
        }
    }, [agencyCode, service, listAgencies]);

    useEffect(() => {
        if (id && parseInt(id) > 0) {
            fetchUsersData(id);
        }
    }, [id]);

    useEffect(() => {
        if (userData) {
            setFullName(userData.name);
            setPhone(userData.phone);
            setAgencyCode(userData.agencyCode);
            setService(userData.service);
            setServiceOption(userData.serviceOption);
            setRole(userData.roleName);
            setPermission(JSON.parse(userData.permissions));
        }
    }, [userData]);

    return (
        <>
            <Modal
                backdrop="opaque"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size={'3xl'}
                classNames={{
                    backdrop: 'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20',
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Cập nhật tài khoản</ModalHeader>
                            <ModalBody>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border rounded-md p-2">
                                        <Input
                                            size={'sm'}
                                            type="text"
                                            label="Họ tên"
                                            isRequired
                                            isInvalid={fullNameInvalid}
                                            errorMessage="Nhập họ tên"
                                            value={fullName}
                                            onValueChange={setFullName}
                                        />
                                        <Input
                                            size={'sm'}
                                            type="text"
                                            label="Điện thoại"
                                            isRequired
                                            isInvalid={phoneInvalid}
                                            errorMessage="Số điện thoại không hợp lệ"
                                            value={phone}
                                            onValueChange={setPhone}
                                        />
                                        <Autocomplete
                                            key={agencyCode}
                                            label="Đại lý"
                                            isRequired
                                            defaultItems={listAgencies}
                                            errorMessage={'Chọn đại lý'}
                                            isInvalid={agencyCodeInvalid}
                                            className={`w-full agency-${agencyCode}`}
                                            onInputChange={setAgencyValue}
                                            defaultSelectedKey={agencyCode}
                                        >
                                            {(element: IAgency) => (
                                                <AutocompleteItem
                                                    key={element.code}
                                                >{`${element.name} (${element.code})`}</AutocompleteItem>
                                            )}
                                        </Autocomplete>
                                        <RadioGroup
                                            key={service}
                                            className={`service-${service}`}
                                            isRequired
                                            onValueChange={setService}
                                            value={service}
                                            isInvalid={serviceInvalid}
                                            label="Dịch vụ"
                                            orientation="horizontal"
                                        >
                                            <Radio isDisabled={disableLounge} value="lounge" className="mr-2">
                                                Phòng chờ
                                            </Radio>
                                            <Radio isDisabled={disableConnectingFlight} value="connecting_flight">
                                                Nối chuyến
                                            </Radio>
                                        </RadioGroup>
                                        {service && agencyCode ? (
                                            listServiceOptions.length > 0 && listAgencies ? (
                                                <Autocomplete
                                                    key={serviceOption}
                                                    label={`${
                                                        service === 'lounge' ? 'Phòng chờ' : 'Dịch vụ nối chuyến'
                                                    }`}
                                                    isRequired
                                                    defaultItems={listServiceOptions}
                                                    errorMessage={'Chọn dịch vụ'}
                                                    isInvalid={serviceOptionInvalid}
                                                    className={`w-full mt-2 service-option-${serviceOption}`}
                                                    onInputChange={setServiceOptionValue}
                                                    defaultSelectedKey={serviceOption}
                                                >
                                                    {(element: IAgency) => (
                                                        <AutocompleteItem
                                                            key={element.code}
                                                        >{`${element.name} (${element.code})`}</AutocompleteItem>
                                                    )}
                                                </Autocomplete>
                                            ) : (
                                                <Autocomplete
                                                    label={`${
                                                        service === 'lounge' ? 'Phòng chờ' : 'Dịch vụ nối chuyến'
                                                    }`}
                                                    isRequired
                                                    errorMessage={
                                                        service === 'lounge'
                                                            ? 'Đại lý chưa có dịch vụ phòng chờ'
                                                            : 'Đại lý chưa có dịch vụ nối chuyến'
                                                    }
                                                    isInvalid={true}
                                                    className={`w-full mt-2 service-option-${serviceOption}`}
                                                >
                                                    <AutocompleteItem key={'error'}>-----</AutocompleteItem>
                                                </Autocomplete>
                                            )
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                    <div className="h-full flex flex-col">
                                        <RadioGroup
                                            isRequired
                                            onValueChange={setRole}
                                            value={role}
                                            isInvalid={roleInvalid}
                                            label="Role"
                                            orientation="horizontal"
                                        >
                                            <Radio value="ADMIN" className="mr-2">
                                                ADMIN
                                            </Radio>
                                            <Radio value="HDQ" className="mr-2">
                                                HDQ
                                            </Radio>
                                            <Radio value="STAFF">STAFF</Radio>
                                        </RadioGroup>
                                        <div className="bg-gray-50 rounded-md w-full border shadow-inner mt-2 p2 box-content flex-grow">
                                            <div className="w-full h-full relative">
                                                <CheckboxGroup
                                                    isDisabled={role ? false : true}
                                                    isInvalid={permissionInvalid}
                                                    value={permission}
                                                    onChange={setPermissionNotFilter}
                                                    className="absolute h-full p-2 overflow-auto"
                                                >
                                                    {listPermissions ? (
                                                        listPermissions.map((item: IPermission, index) => {
                                                            return (
                                                                <Checkbox key={index} value={item.permission}>
                                                                    {item.permission}
                                                                </Checkbox>
                                                            );
                                                        })
                                                    ) : (
                                                        <></>
                                                    )}
                                                </CheckboxGroup>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Đóng
                                </Button>
                                <Button color="primary" onPress={handleSubmit}>
                                    Cập nhật
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
