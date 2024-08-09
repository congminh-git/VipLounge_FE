'use client';

import React, { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react';
import { Service } from '@/types/publicTypes';
import SelectService from '@/components/selectService';
import { addAgency } from '@/services/agency';
import Swal from 'sweetalert2';

interface IAddNewModal {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    reFetchData: () => void;
}

interface ICreate {
    name: string;
    code: string;
    service: Service;
}

export default function AddNewModal({ isOpen, onOpenChange, reFetchData }: IAddNewModal) {
    const [name, setName] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [service, setService] = useState<Service>('master');
    const [nameInvalid, setNameInvalid] = useState<boolean>(false);
    const [codeInvalid, setCodeInvalid] = useState<boolean>(false);

    const create = async (body: ICreate) => {
        const result = await addAgency(body);
        return result;
    };

    const onSubmitModal = async (name: string, code: string, service: Service) => {
        let nameInvalidBool, codeInvalidBool;
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

        if (!nameInvalidBool && !codeInvalidBool) {
            const body: ICreate = {
                name,
                code,
                service,
            };
            const result = await create(body);
            if (result.id) {
                Swal.fire({
                    title: 'Thêm đại lý thành công',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                });
                reFetchData();
                setName('');
                setNameInvalid(false);
                setCode('');
                setCodeInvalid(false);
                setService('master');
                onOpenChange(false);
            } else {
                Swal.fire({
                    title: 'Thêm đại lý thất bại',
                    text: result.response.data.message || 'Something went wrong!',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        }
    };

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
                            <ModalHeader className="flex flex-col gap-1">Thêm đại lý</ModalHeader>
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
                                <Input
                                    size={'sm'}
                                    type="text"
                                    label="Mã đại lý"
                                    isRequired
                                    isInvalid={codeInvalid}
                                    errorMessage="Mã đại lý phải có 3 ký tự"
                                    value={code}
                                    onValueChange={setCode}
                                />
                                <SelectService defaultValue={service} setData={setService} />
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
