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
import { getAgencyByKey, updateAgencyByKey } from '@/services/agency';
import Swal from 'sweetalert2';
import { IAirport } from '@/types/Airport';

interface IUpdateModal {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    reFetchData: () => void;
    agencyKey: string;
    airports: IAirport[];
}

interface IUpdate {
    name: string;
    service: Service;
    airportCode: string;
}

export default function UpdateModal({ isOpen, onOpenChange, reFetchData, agencyKey, airports }: IUpdateModal) {
    const [name, setName] = useState<string>('');
    const [airportCode, setAirportCode] = useState<string>('');
    const [airportValue, setAirportValue] = useState<string>('');
    const [airportCodeInvalid, setAirportCodeInvalid] = useState<boolean>(false);
    const [service, setService] = useState<Service>('lounge');
    const [nameInvalid, setNameInvalid] = useState<boolean>(false);

    const getDataAgency = async (agencyKey: string) => {
        const result = await getAgencyByKey(agencyKey);
        if (result.key) {
            setName(result.name);
            setService(result.service);
            setAirportCode(result.airportCode);
        }
    };

    const update = async (agencyKey: string, body: IUpdate) => {
        const result = await updateAgencyByKey(agencyKey, body);
        return result;
    };

    const onSubmitModal = async (name: string, service: Service) => {
        let nameInvalidBool, airportCodeInvalidBool;
        if (!name || name.trim() === '') {
            nameInvalidBool = true;
            setNameInvalid(true);
        } else {
            nameInvalidBool = false;
            setNameInvalid(false);
        }
        if (!airportCode || airportCode.trim() === '' || airportCode.trim().length !== 3) {
            airportCodeInvalidBool = true;
            setAirportCodeInvalid(true);
        } else {
            airportCodeInvalidBool = false;
            setAirportCodeInvalid(false);
        }

        if (!nameInvalidBool && !airportCodeInvalidBool) {
            const body: IUpdate = {
                name,
                service,
                airportCode,
            };
            const result = await update(agencyKey, body);
            if (result.key) {
                Swal.fire({
                    title: 'Cập nhật đối tác thành công',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                });
                reFetchData();
                setName('');
                setService('lounge');
                setNameInvalid(false);
                onOpenChange(false);
            } else {
                Swal.fire({
                    title: 'Cập nhật đối tác thất bại',
                    text: result.response.data.message || 'Something went wrong!',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        }
    };

    useEffect(() => {
        if (agencyKey && agencyKey !== '0') {
            getDataAgency(agencyKey);
        }
    }, [agencyKey]);

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
                placement="center"
                onOpenChange={onOpenChange}
                classNames={{
                    backdrop: 'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20',
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Cập nhật thông tin đối tác</ModalHeader>
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
                                <SelectService defaultValue={service} setData={setService} />
                                <Autocomplete
                                    key={airportCode}
                                    label="Sân bay"
                                    defaultItems={airports}
                                    errorMessage={'Chọn sân bay'}
                                    isInvalid={airportCodeInvalid}
                                    className={`w-full airport-${airportCode} mt-2`}
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
                                <Button color="primary" onPress={() => onSubmitModal(name, service)}>
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
