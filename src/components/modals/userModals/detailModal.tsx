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
    const [role, setRole] = useState<string>('PARTNER');
    const [roleInvalid, setRoleInvalid] = useState<boolean>(false);
    const [permission, setPermission] = useState<string[]>([]);
    const [permissionInvalid, setPermissionInvalid] = useState<boolean>(false);

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
        if (agencyValue) {
            const match = agencyValue.match(regex);
            if (match) {
                setAgencyCode(match[1]);
            }
        }
    }, [agencyValue]);

    useEffect(() => {
        if (role && listRoles) {
            const element: any = listRoles.find((element: IRole) => element.roleName === role);
            if (element) {
                setPermission(JSON.parse(element.permissions));
            }
        }
    }, [role, listRoles]);

    useEffect(() => {
        if (userData) {
            setEmail(userData.email);
            setFullName(userData.name);
            setPhone(userData.phone);
            setAgencyCode(userData.agencyCode);
            setRole(userData.roleName);
            setPermission(JSON.parse(userData.permissions));
        }
    }, [userData]);

    return (
        <>
            <Modal
                backdrop="opaque"
                isOpen={isOpen}
                placement="center"
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
                                <div className="grid sm:grid-cols-2 gap-4 overflow-y-auto">
                                    <div className="sm:border rounded-md sm:p-2">
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
                                            label="Đối tác"
                                            isDisabled
                                            defaultItems={listAgencies}
                                            errorMessage={'Chọn đối tác'}
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
                                    </div>
                                    <div className="h-full flex sm:flex-col">
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
                                            <Radio value="PARTNER">PARTNER</Radio>
                                        </RadioGroup>
                                        <div className="bg-gray-50 rounded-md w-full border shadow-inner mt-2 p2 box-content sm:flex-grow">
                                            <div className="w-full h-full relative overflow-auto">
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
