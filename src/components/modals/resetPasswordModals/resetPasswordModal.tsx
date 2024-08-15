'use client';

import React, { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react';
import { ButtonVJ } from '@/components/buttonVJStyle';
import { changePassword, postForgotPassword, resetPassword } from '@/services/user';
import Swal from 'sweetalert2';
import CountdownTime from '@/components/countDownTime';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface IResetPasswordModal {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}
export default function ResetPasswordModal({ isOpen, onOpenChange }: IResetPasswordModal) {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [verifyCode, setVerifyCode] = useState<string>('');
    const [usernameInvalid, setUsernameInvalid] = useState<boolean>(false);
    const [emailInvalid, setEmailInvalid] = useState<boolean>(false);
    const [oldPasswordInvalid, setOldPasswordInvalid] = useState<boolean>(false);
    const [newPasswordInvalid, setNewPasswordInvalid] = useState<boolean>(false);

    const userUsername = useSelector((state: RootState) => state.auth.username);
    const userEmail = useSelector((state: RootState) => state.auth.email);

    const handleResetPassword = async (username: string, email: string, oldPassword: string, newPassword: string) => {
        let usernameInvalidBool, oldPasswordInvalidBool, newPasswordInvalidBool, emailInvalidBool;
        if (username === '') {
            setUsernameInvalid(true);
            usernameInvalidBool = true;
            return;
        }
        if (email === '') {
            setEmailInvalid(true);
            emailInvalidBool = true;
            return;
        }
        if (oldPassword === '') {
            setOldPasswordInvalid(true);
            oldPasswordInvalidBool = true;
            return;
        }
        if (newPassword === '') {
            setNewPasswordInvalid(true);
            newPasswordInvalidBool = true;
            return;
        }
        if (!usernameInvalidBool && !oldPasswordInvalidBool && !emailInvalidBool) {
            const result = await changePassword(username, email, oldPassword, newPassword);
            if (result.id) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Đổi mật khẩu thành công!',
                    showConfirmButton: false,
                    timer: 1500,
                });
                onOpenChange(false);
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: result.response.data.message,
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        }
    };

    useEffect(() => {
        if (userEmail && userUsername) {
            setEmail(userEmail);
            setUsername(userUsername);
        }
    }, [userUsername, userEmail]);

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
                            <ModalHeader className="flex flex-col gap-1">Đổi mật khẩu</ModalHeader>
                            <ModalBody>
                                <Input
                                    size={'sm'}
                                    type="text"
                                    label="Username"
                                    isRequired
                                    readOnly
                                    isInvalid={usernameInvalid}
                                    errorMessage="Nhập username"
                                    value={username}
                                    onValueChange={setUsername}
                                />
                                <Input
                                    size={'sm'}
                                    type="text"
                                    label="Email"
                                    readOnly
                                    isRequired
                                    isInvalid={emailInvalid}
                                    errorMessage="Nhập email"
                                    value={email}
                                    onValueChange={setEmail}
                                />
                                <>
                                    <Input
                                        size={'sm'}
                                        type="password"
                                        label="Mật khẩu cũ"
                                        isRequired
                                        isInvalid={oldPasswordInvalid}
                                        errorMessage="Nhập mật khẩu"
                                        value={oldPassword}
                                        onValueChange={setOldPassword}
                                    />
                                    <Input
                                        size={'sm'}
                                        type="password"
                                        label="Mật khẩu mới"
                                        isRequired
                                        isInvalid={newPasswordInvalid}
                                        errorMessage="Nhập mật khẩu"
                                        value={newPassword}
                                        onValueChange={setNewPassword}
                                    />
                                </>
                            </ModalBody>
                            <ModalFooter>
                                <ButtonVJ
                                    handleClick={() => handleResetPassword(username, email, oldPassword, newPassword)}
                                    size={'md'}
                                    fullWidth={true}
                                    message={'Xác nhận'}
                                />
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
