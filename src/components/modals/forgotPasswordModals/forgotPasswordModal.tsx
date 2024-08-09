'use client';

import React, { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react';
import { Service } from '@/types/publicTypes';
import SelectService from '@/components/selectService';
import { addAgency } from '@/services/agency';
import { ButtonVJ } from '@/components/buttonVJStyle';
import { postForgotPassword, resetPassword } from '@/services/user';
import Swal from 'sweetalert2';
import CountdownTime from '@/components/countDownTime';

interface IForgotPasswordModal {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    usernameData: string;
}
export default function ForgotPasswordModal({ isOpen, onOpenChange, usernameData }: IForgotPasswordModal) {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [verifyCode, setVerifyCode] = useState<string>('');
    const [usernameInvalid, setUsernameInvalid] = useState<boolean>(false);
    const [emailInvalid, setEmailInvalid] = useState<boolean>(false);
    const [passwordInvalid, setPasswordInvalid] = useState<boolean>(false);
    const [verifyCodeInvalid, setVerifyCodeInvalid] = useState<boolean>(false);
    const [hasVerifyCode, setHasVerifyCode] = useState<boolean>(false);
    const [expiryTime, setExpiryTime] = useState<number | null>();

    const sendVerifyCode = async (username: string, email: string) => {
        let emailInvalidBool;
        if (email === '') {
            setEmailInvalid(true);
            emailInvalidBool = true;
            return;
        }
        if (!emailInvalidBool) {
            const result = await postForgotPassword(username, email);
            if (result.expiry) {
                setHasVerifyCode(true);
                setExpiryTime(result.expiry);
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: result.message,
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        }
    };

    const handleResetPassword = async (username: string, password: string, verifyCode: string) => {
        let usernameInvalidBool, passwordInvalidBool, verifyCodeInvalidBool;
        if (username === '') {
            setUsernameInvalid(true);
            usernameInvalidBool = true;
            return;
        }
        if (password === '') {
            setPasswordInvalid(true);
            passwordInvalidBool = true;
            return;
        }
        if (verifyCode === '') {
            setVerifyCodeInvalid(true);
            verifyCodeInvalidBool = true;
            return;
        }
        if (!usernameInvalidBool && !passwordInvalidBool && !verifyCodeInvalidBool) {
            const result = await resetPassword(username, password, verifyCode);
            if (result.id) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Đổi mật khẩu thành công!',
                    showConfirmButton: false,
                    timer: 1500,
                });
                onOpenChange(false);
                setHasVerifyCode(false);
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
        if (usernameData) {
            setUsername(usernameData);
        }
    }, [usernameData]);

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
                            <ModalHeader className="flex flex-col gap-1">Quên mật khẩu</ModalHeader>
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
                                    isRequired
                                    isInvalid={emailInvalid}
                                    errorMessage="Nhập email"
                                    value={email}
                                    onValueChange={setEmail}
                                />
                                {hasVerifyCode ? (
                                    <>
                                        <Input
                                            size={'sm'}
                                            type="password"
                                            label="Mật khẩu mới"
                                            isRequired
                                            isInvalid={passwordInvalid}
                                            errorMessage="Nhập mật khẩu"
                                            value={password}
                                            onValueChange={setPassword}
                                        />
                                        <Input
                                            size={'sm'}
                                            type="text"
                                            label="Mã xác nhận"
                                            isRequired
                                            isInvalid={verifyCodeInvalid}
                                            errorMessage="Nhập mã xác nhận"
                                            value={verifyCode}
                                            onValueChange={setVerifyCode}
                                        />
                                        {expiryTime ? (
                                            <p className="flex items-center">
                                                Mã xác nhận còn <CountdownTime initialTime={expiryTime} />
                                            </p>
                                        ) : (
                                            <></>
                                        )}
                                    </>
                                ) : (
                                    <></>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <ButtonVJ
                                    handleClick={() => sendVerifyCode(username, email)}
                                    size={'md'}
                                    fullWidth={true}
                                    message={hasVerifyCode ? 'Gửi lại mã xác nhận' : 'Gửi mã xác nhận'}
                                />
                                {hasVerifyCode ? (
                                    <ButtonVJ
                                        handleClick={() => handleResetPassword(username, password, verifyCode)}
                                        size={'md'}
                                        fullWidth={true}
                                        message={'Xác nhận'}
                                    />
                                ) : (
                                    <></>
                                )}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
