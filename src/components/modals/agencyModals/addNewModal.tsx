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
    Autocomplete,
    AutocompleteItem,
} from '@nextui-org/react';
import { Service } from '@/types/publicTypes';
import SelectService from '@/components/selectService';
import { addAgency } from '@/services/agency';
import Swal from 'sweetalert2';
import { IAirport } from '@/types/Airport';

interface IAddNewModal {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    reFetchData: () => void;
    airports: IAirport[];
}

interface ICreate {
    name: string;
    code: string;
    service: Service;
    airportCode: string;
}

export default function AddNewModal({ isOpen, onOpenChange, reFetchData, airports }: IAddNewModal) {
    const [name, setName] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [airportCode, setAirportCode] = useState<string>('');
    const [airportValue, setAirportValue] = useState<string>('');
    const [airportCodeInvalid, setAirportCodeInvalid] = useState<boolean>(false);
    const [service, setService] = useState<Service>('lounge');
    const [nameInvalid, setNameInvalid] = useState<boolean>(false);
    const [codeInvalid, setCodeInvalid] = useState<boolean>(false);

    const create = async (body: ICreate) => {
        const result = await addAgency(body);
        return result;
    };

    const onSubmitModal = async (name: string, code: string, service: Service) => {
        let nameInvalidBool, codeInvalidBool, airportCodeInvalidBool;
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
        if (!airportCode || airportCode.trim() === '' || airportCode.trim().length !== 3) {
            airportCodeInvalidBool = true;
            setAirportCodeInvalid(true);
        } else {
            airportCodeInvalidBool = false;
            setAirportCodeInvalid(false);
        }

        if (!nameInvalidBool && !codeInvalidBool && !airportCodeInvalidBool) {
            const body: ICreate = {
                name,
                code,
                service,
                airportCode,
            };
            const result = await create(body);
            if (result.key) {
                Swal.fire({
                    title: 'Thêm đối tác thành công',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                });
                reFetchData();
                setName('');
                setNameInvalid(false);
                setCode('');
                setCodeInvalid(false);
                setService('lounge');
                onOpenChange(false);
            } else {
                Swal.fire({
                    title: 'Thêm đối tác thất bại',
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
        if (airportValue) {
            const match = airportValue.match(regex);
            if (match) {
                setAirportCode(match[1]);
            }
        }
    }, [airportValue]);

    return (
        <>
            <Modal
                backdrop="opaque"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
                classNames={{
                    backdrop: 'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20',
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Thêm đối tác</ModalHeader>
                            <ModalBody>
                                <Input
                                    size={'sm'}
                                    type="text"
                                    label="Tên đối tác"
                                    isRequired
                                    isInvalid={nameInvalid}
                                    errorMessage="Nhập tên đối tác"
                                    value={name}
                                    onValueChange={setName}
                                />
                                <Input
                                    size={'sm'}
                                    type="text"
                                    label="Mã đối tác"
                                    isRequired
                                    isInvalid={codeInvalid}
                                    errorMessage="Mã đối tác phải có 3 ký tự"
                                    value={code}
                                    onValueChange={setCode}
                                />
                                <SelectService defaultValue={service} setData={setService} />
                                <Autocomplete
                                    label="Sân bay"
                                    defaultItems={airports}
                                    errorMessage={'Chọn sân bay'}
                                    isInvalid={airportCodeInvalid}
                                    className="w-full mt-2"
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
                                <Button color="primary" onPress={() => onSubmitModal(name, code, service)}>
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
