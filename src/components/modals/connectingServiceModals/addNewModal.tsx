'use client';

import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Select,
    SelectItem,
    Autocomplete,
    AutocompleteItem,
} from '@nextui-org/react';
import { Service } from '@/types/publicTypes';
import { getAgencies } from '@/services/agency';
import { getAirports } from '@/services/airport';
import Swal from 'sweetalert2';
import { IAgency } from '@/types/Agency';
import { IAirport } from '@/types/Airport';
import { addConnectingService } from '@/services/connectingService';

interface IAddNewModal {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    reFetchData: () => void;
    listAirports: any;
    listAgencies: any;
}

interface ICreate {
    name: string;
    code: string;
    agencyCode: string;
    airportCode: string;
}

export default function AddNewModal({ isOpen, onOpenChange, reFetchData, listAirports, listAgencies }: IAddNewModal) {
    const [name, setName] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [agencyCode, setAgencyCode] = useState<string>('');
    const [airportCode, setAirportCode] = useState<string>('');
    const [agencyValue, setAgencyValue] = useState<string>('');
    const [airportValue, setAirportValue] = useState<string>('');
    const [nameInvalid, setNameInvalid] = useState<boolean>(false);
    const [codeInvalid, setCodeInvalid] = useState<boolean>(false);
    const [agencyCodeInvalid, setAgencyCodeInvalid] = useState<boolean>(false);
    const [airportCodeInvalid, setAirportCodeInvalid] = useState<boolean>(false);

    const create = async (body: ICreate) => {
        const result = await addConnectingService(body);
        return result;
    };

    const onSubmitModal = async (name: string, code: string, agencyCode: string, airportCode: string) => {
        let nameInvalidBool, codeInvalidBool, agencyCodeInvalidBool, airportCodeInvalidBool;
        if (!name || name.trim() === '') {
            nameInvalidBool = true;
            setNameInvalid(true);
        } else {
            nameInvalidBool = false;
            setNameInvalid(false);
        }
        if (!code || code.trim() === '' || code.trim().length !== 3) {
            codeInvalidBool = true;
            setCodeInvalid(true);
        } else {
            codeInvalidBool = false;
            setCodeInvalid(false);
        }
        if (!agencyCode || agencyCode.trim() === '' || agencyCode.trim().length !== 3) {
            agencyCodeInvalidBool = true;
            setAgencyCodeInvalid(true);
        } else {
            agencyCodeInvalidBool = false;
            setAgencyCodeInvalid(false);
        }
        if (!airportCode || airportCode.trim() === '' || airportCode.trim().length !== 3) {
            airportCodeInvalidBool = true;
            setAirportCodeInvalid(true);
        } else {
            airportCodeInvalidBool = false;
            setAirportCodeInvalid(false);
        }

        if (!nameInvalidBool && !codeInvalidBool && !airportCodeInvalidBool && !airportCodeInvalidBool) {
            const body: ICreate = {
                name,
                code,
                agencyCode,
                airportCode,
            };
            const result = await create(body);
            if (result.id) {
                Swal.fire({
                    title: 'Thêm dịch vụ thành công',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                });
                reFetchData();
                setName('');
                setNameInvalid(false);
                setCode('');
                setCodeInvalid(false);
                onOpenChange(false);
            } else {
                Swal.fire({
                    title: 'Thêm dịch vụ thất bại',
                    text: result.response.data.message || 'Something went wrong!',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        }
    };

    useEffect(() => {
        const regex = /\(([^)]+)\)/;
        if (agencyValue) {
            const match = agencyValue.match(regex);
            if (match) {
                setAgencyCode(match[1]);
            }
        }
        if (airportValue) {
            const match = airportValue.match(regex);
            if (match) {
                setAirportCode(match[1]);
            }
        }
    }, [agencyValue, airportValue]);

    return (
        <>
            <Modal
                backdrop="opaque"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                classNames={{
                    backdrop: 'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20',
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Thêm dịch vụ</ModalHeader>
                            <ModalBody>
                                <Input
                                    size={'sm'}
                                    type="text"
                                    label="Tên dịch vụ"
                                    isRequired
                                    isInvalid={nameInvalid}
                                    errorMessage="Nhập tên dịch vụ"
                                    value={name}
                                    onValueChange={setName}
                                />
                                <Input
                                    size={'sm'}
                                    type="text"
                                    label="Mã dịch vụ"
                                    isRequired
                                    isInvalid={codeInvalid}
                                    errorMessage="Mã dịch vụ phải có 3 ký tự"
                                    value={code}
                                    onValueChange={setCode}
                                />
                                <Autocomplete
                                    label="Đại lý"
                                    defaultItems={listAgencies}
                                    errorMessage={'Chọn đại lý'}
                                    isInvalid={agencyCodeInvalid}
                                    className="w-full"
                                    onInputChange={setAgencyValue}
                                >
                                    {(element: IAgency) => (
                                        <AutocompleteItem
                                            key={element.code}
                                        >{`${element.name} (${element.code})`}</AutocompleteItem>
                                    )}
                                </Autocomplete>
                                <Autocomplete
                                    label="Sân bay"
                                    defaultItems={listAirports}
                                    errorMessage={'Chọn sân bay'}
                                    isInvalid={airportCodeInvalid}
                                    className="w-full"
                                    onInputChange={setAirportValue}
                                >
                                    {(element: IAirport) => (
                                        <AutocompleteItem
                                            key={element.code}
                                        >{`${element.name} (${element.code})`}</AutocompleteItem>
                                    )}
                                </Autocomplete>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Đóng
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={() => onSubmitModal(name, code, agencyCode, airportCode)}
                                >
                                    Thêm
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
