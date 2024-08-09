'use client';

import React, { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react';
import { Service } from '@/types/publicTypes';
import SelectService from '@/components/selectService';
import { getAgencyById, updateAgencyById } from '@/services/agency';
import Swal from 'sweetalert2';

interface IUpdateModal {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    reFetchData: () => void;
    id: string;
}

interface IUpdate {
    name: string;
    service: Service;
}

export default function UpdateModal({ isOpen, onOpenChange, reFetchData, id }: IUpdateModal) {
    const [name, setName] = useState<string>('');
    const [service, setService] = useState<Service>('master');
    const [nameInvalid, setNameInvalid] = useState<boolean>(false);

    const getDataAgency = async (id: string) => {
        const result = await getAgencyById(id);
        if (result.id) {
            setName(result.name);
            setService(result.service);
        }
    };

    const update = async (id: string, body: IUpdate) => {
        const result = await updateAgencyById(id, body);
        return result;
    };

    const onSubmitModal = async (name: string, service: Service) => {
        let nameInvalidBool;
        if (!name || name.trim() === '') {
            nameInvalidBool = true;
            setNameInvalid(true);
        } else {
            nameInvalidBool = false;
            setNameInvalid(false);
        }

        if (!nameInvalidBool) {
            const body: IUpdate = {
                name,
                service,
            };
            const result = await update(id, body);
            if (result.id) {
                Swal.fire({
                    title: 'Cập nhật đại lý thành công',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                });
                reFetchData();
                setName('');
                setService('master');
                setNameInvalid(false);
                onOpenChange(false);
            } else {
                Swal.fire({
                    title: 'Cập nhật đại lý thất bại',
                    text: result.response.data.message || 'Something went wrong!',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        }
    };

    useEffect(() => {
        if (id && parseInt(id) > 0) {
            getDataAgency(id);
        }
    }, [id]);

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
                            <ModalHeader className="flex flex-col gap-1">Cập nhật thông tin đại lý</ModalHeader>
                            <ModalBody>
                                <Input
                                    size={'sm'}
                                    type="text"
                                    label="Tên đại lý"
                                    isRequired
                                    isInvalid={nameInvalid}
                                    errorMessage="Nhập tên đại lý"
                                    value={name}
                                    onValueChange={setName}
                                />
                                <SelectService defaultValue={service} setData={setService} />
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
