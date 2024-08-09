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
import Swal from 'sweetalert2';
import { IAirport } from '@/types/Airport';
import { updateLoungeById, getLoungeById } from '@/services/lounge';

interface IUpdateModal {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    reFetchData: () => void;
    id: string;
    listAirports: any;
    listAgencies: any;
}

interface ICreate {
    name: string;
    code: string;
    agencyCode: string;
    airportCode: string;
}

export default function UpdateModal({
    isOpen,
    onOpenChange,
    reFetchData,
    id,
    listAirports,
    listAgencies,
}: IUpdateModal) {
    const [name, setName] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [agencyCode, setAgencyCode] = useState<string>('');
    const [airportCode, setAirportCode] = useState<string>('');
    const [agencyValue, setAgencyValue] = useState<string>('');
    const [airportValue, setAirportValue] = useState<string>('');
    const [nameInvalid, setNameInvalid] = useState<boolean>(false);
    const [agencyCodeInvalid, setAgencyCodeInvalid] = useState<boolean>(false);
    const [airportCodeInvalid, setAirportCodeInvalid] = useState<boolean>(false);

    const create = async (body: ICreate) => {
        const result = await updateLoungeById(id, body);
        return result;
    };

    const onSubmitModal = async (name: string, agencyCode: string, airportCode: string) => {
        let nameInvalidBool, agencyCodeInvalidBool, airportCodeInvalidBool;
        if (!name || name.trim() === '') {
            nameInvalidBool = true;
            setNameInvalid(true);
        } else {
            nameInvalidBool = false;
            setNameInvalid(false);
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

        if (!nameInvalidBool && !airportCodeInvalidBool && !airportCodeInvalidBool) {
            const body: ICreate = {
                name,
                code,
                agencyCode,
                airportCode,
            };
            const result = await create(body);
            if (result.id) {
                Swal.fire({
                    title: 'Cập nhật phòng chờ thành công',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                });
                reFetchData();
                setName('');
                setNameInvalid(false);
                setCode('');
                onOpenChange(false);
            } else {
                Swal.fire({
                    title: 'Cập nhật phòng chờ thất bại',
                    text: result.response.data.message || 'Something went wrong!',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        }
    };

    const fetchDataLounge = async (id: string) => {
        const result = await getLoungeById(id);
        if (result.id) {
            setName(result.name);
            setAgencyCode(result.agencyCode);
            setAirportCode(result.airportCode);
        }
    };

    useEffect(() => {
        const agencyElement = document.querySelector('.agency-');
        if (agencyElement) {
            (agencyElement as HTMLElement).style.display = 'none';
        }
    }, [agencyCode]);

    useEffect(() => {
        const agencyElement = document.querySelector('.airport-');
        if (agencyElement) {
            (agencyElement as HTMLElement).style.display = 'none';
        }
    }, [agencyCode]);

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

    useEffect(() => {
        if (id && parseInt(id) > 0) {
            fetchDataLounge(id);
        }
    }, [id]);

    return (
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
                        <ModalHeader className="flex flex-col gap-1">Cập nhật thông tin phòng chờ</ModalHeader>
                        <ModalBody>
                            <Input
                                size={'sm'}
                                type="text"
                                label="Tên phòng chờ"
                                isRequired
                                isInvalid={nameInvalid}
                                errorMessage="Nhập tên phòng chờ"
                                value={name}
                                onValueChange={setName}
                            />
                            <Autocomplete
                                key={agencyCode}
                                label="Đại lý"
                                defaultItems={listAgencies}
                                errorMessage={'Chọn đại lý'}
                                isInvalid={agencyCodeInvalid}
                                className={`w-full agency-${agencyCode}`}
                                onInputChange={setAgencyValue}
                                defaultSelectedKey={agencyCode}
                            >
                                {(element: IAirport) => (
                                    <AutocompleteItem
                                        key={element.code}
                                    >{`${element.name} (${element.code})`}</AutocompleteItem>
                                )}
                            </Autocomplete>
                            <Autocomplete
                                key={airportCode}
                                label="Sân bay"
                                defaultItems={listAirports}
                                errorMessage={'Chọn sân bay'}
                                isInvalid={airportCodeInvalid}
                                className={`w-full airport-${airportCode}`}
                                onInputChange={setAirportValue}
                                defaultSelectedKey={airportCode}
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
                            <Button color="primary" onPress={() => onSubmitModal(name, agencyCode, airportCode)}>
                                Cập nhật
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
