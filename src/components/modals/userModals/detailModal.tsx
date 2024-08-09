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
import { User } from './updateModal';
import { getUserById } from '@/services/user';

export interface IPermission {
    id: number;
    permission: string;
}

export interface IRole {
    id: number;
    roleName: string;
    permissions: string;
}

interface ICreate {
    email: string;
    password: string;
    name: string;
    phone: string;
    roleName: string;
    agencyCode: string;
    service: string;
    serviceOption: string;
    permissions: string;
}

interface IDetailModal {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    id: string;
}

export default function DetailModal({ isOpen, onOpenChange, id }: IDetailModal) {
    const [userData, setUserData] = useState<User>();
    const [listAgencies, setListAgencies] = useState([]);
    const [listRoles, setListRoles] = useState([]);
    const [listPermissions, setListPermissions] = useState([]);
    const [email, setEmail] = useState<string>('');
    const [emailInvalid, setEmailInvalid] = useState<boolean>(false);
    const [fullName, setFullName] = useState<string>('');
    const [fullNameInvalid, setFullNameInvalid] = useState<boolean>(false);
    const [phone, setPhone] = useState<string>('');
    const [phoneInvalid, setPhoneInvalid] = useState<boolean>(false);
    const [agencyOptionValue, setAgencyOptionValue] = useState<string>('');
    const [agencyCode, setAgencyCode] = useState<string>('');
    const [agencyValue, setAgencyValue] = useState<string>('');
    const [agencyCodeInvalid, setAgencyCodeInvalid] = useState<boolean>(false);
    const [service, setService] = useState<string>('');
    const [serviceOptionValue, setServiceOptionValue] = useState<string>('');
    const [serviceInvalid, setServiceInvalid] = useState<boolean>(false);
    const [serviceOption, setServiceOption] = useState<string>('');
    const [serviceOptionInvalid, setServiceOptionInvalid] = useState<boolean>(false);
    const [listServiceOptions, setListServiceOptions] = useState<any[]>([]);
    const [role, setRole] = useState<string>('STAFF');
    const [roleInvalid, setRoleInvalid] = useState<boolean>(false);
    const [permission, setPermission] = useState<string[]>([]);
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

    useEffect(() => {
        fetchAgencies();
        fetchPermissions();
        fetchRoles();
    }, []);

    useEffect(() => {
        if (id && parseInt(id) > 0) {
            fetchUsersData(id);
        }
    }, [id]);

    useEffect(() => {
        const regex = /\(([^)]+)\)/;
        if (agencyOptionValue) {
            const match = agencyOptionValue.match(regex);
            if (match) {
                setAgencyCode(match[1]);
            }
        }
    }, [agencyOptionValue]);

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
        if (agencyCode) {
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
        if (serviceOptionValue) {
            const regex = /\(([^)]+)\)/;
            const match = serviceOptionValue.match(regex);
            if (match) setServiceOption(match[1]);
        }
    }, [serviceOptionValue]);

    useEffect(() => {
        if (agencyCode && listAgencies && service) {
            const agency: any = listAgencies.find((element: IAgency) => element.code === agencyCode);
            if (agency) {
                console.log(agency, service, agency[service]);
                setListServiceOptions(agency[service === 'lounge' ? 'lounges' : 'cfroms']);
            }
        }
    }, [agencyCode, service, listAgencies]);

    useEffect(() => {
        if (userData) {
            setEmail(userData.email);
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
                            <ModalHeader className="flex flex-col gap-1">Thông tin chi tiết tài khoản</ModalHeader>
                            <ModalBody>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border rounded-md p-2">
                                        <Input
                                            size={'sm'}
                                            type="email"
                                            label="Email"
                                            isDisabled
                                            isInvalid={emailInvalid}
                                            errorMessage="Hãy nhập email hợp lệ"
                                            value={email}
                                            onValueChange={setEmail}
                                        />
                                        <Input
                                            size={'sm'}
                                            type="text"
                                            label="Họ tên"
                                            isDisabled
                                            isInvalid={fullNameInvalid}
                                            errorMessage="Nhập họ tên"
                                            value={fullName}
                                            onValueChange={setFullName}
                                        />
                                        <Input
                                            size={'sm'}
                                            type="text"
                                            label="Điện thoại"
                                            isDisabled
                                            isInvalid={phoneInvalid}
                                            errorMessage="Số điện thoại không hợp lệ"
                                            value={phone}
                                            onValueChange={setPhone}
                                        />
                                        <Autocomplete
                                            key={agencyCode}
                                            label="Đại lý"
                                            isDisabled
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
                                            isDisabled
                                            onValueChange={setService}
                                            value={service}
                                            isInvalid={serviceInvalid}
                                            label="Dịch vụ"
                                            orientation="horizontal"
                                        >
                                            <Radio isDisabled value="lounge" className="mr-2">
                                                Phòng chờ
                                            </Radio>
                                            <Radio isDisabled value="connecting_flight">
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
                                                    isDisabled
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
                                                    isDisabled
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
                                            isDisabled
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
                                                    isDisabled
                                                    isInvalid={permissionInvalid}
                                                    value={permission}
                                                    onChange={setPermission}
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
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
