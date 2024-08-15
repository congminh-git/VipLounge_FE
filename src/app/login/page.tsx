'use client';

import { Card, CardBody } from '@nextui-org/card';
import { Link } from '@nextui-org/link';
import { Input } from '@nextui-org/input';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { postLogin } from '@/services/user';
import { ButtonVJ } from '@/components/buttonVJStyle';
import { useDispatch } from 'react-redux';
import { setUserData, setUserToken, setUserPermissions } from '@/redux/auth/authSlice';
import { error } from 'console';
import Swal from 'sweetalert2';
import ForgotPasswordModal from '@/components/modals/forgotPasswordModals/forgotPasswordModal';

export default function Home() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [username, setUsername] = useState('vjadmin');
    const [password, setPassword] = useState('A12345');
    const [usernameInvalid, setUsernameInvalid] = useState(false);
    const [passwordInvalid, setPasswordInvalid] = useState(false);
    const [usernameMessage, setUsernameMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [forgotPassword, setForgotPassword] = useState<boolean>(false);
    const [forgotPasswordModal, setForgotPasswordModal] = useState<boolean>(false);

    const handleLogin = async () => {
        const result = await postLogin({ username, password });
        if (result.token) {
            dispatch(setUserToken(result.token));
            dispatch(setUserPermissions(result.permissions));
            dispatch(
                setUserData({
                    username: result.username,
                    email: result.email,
                    name: result.name,
                    agencyCode: result.agencyCode,
                    agencyName: result.agencyName,
                    service: result.service,
                    serviceOption: result.serviceOption,
                }),
            );
            window.localStorage.setItem('token', result.token);
            window.localStorage.setItem('permissions', result.permissions);
            window.localStorage.setItem('service', result.service);
            window.localStorage.setItem('username', result.username);
            window.localStorage.setItem('email', result.email);
            window.localStorage.setItem('name', result.name);
            window.localStorage.setItem('agencyCode', result.agencyCode);
            window.localStorage.setItem('agencyName', result.agencyName);
            window.localStorage.setItem('serviceOption', result.serviceOption);
            if (result.warning) {
                Swal.fire({
                    text: result.warning,
                    icon: 'warning',
                });
            }
            router.push('/agent/home-page');
        } else {
            const errorMessage = result.response.data.message || 'Something went wrong!';
            if (errorMessage.toLowerCase().includes('password')) {
                setPasswordInvalid(true);
                setPasswordMessage(errorMessage);
            } else {
                setUsernameInvalid(true);
                setUsernameMessage(errorMessage);
            }
            if (result.response.status === 401) {
                setForgotPassword(true);
            }
        }
    };

    useEffect(() => {
        if (passwordInvalid) {
            setPasswordInvalid(false);
            setPasswordMessage('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [password]);

    useEffect(() => {
        if (usernameInvalid) {
            setUsernameInvalid(false);
            setUsernameMessage('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username]);

    return (
        <div className="w-screen h-screen flex sm:justify-end justify-center">
            <div className="h-full w-full p-4 sm:p-0 sm:w-fit sm:mr-16 flex items-center">
                <Card className="w-full">
                    <CardBody>
                        <div className="p-2">
                            <div className="grid gap-2">
                                <Input
                                    size={'sm'}
                                    type="text"
                                    label="Email"
                                    isInvalid={usernameInvalid}
                                    errorMessage={usernameMessage}
                                    value={username}
                                    onValueChange={setUsername}
                                />
                                <Input
                                    size={'sm'}
                                    type="Password"
                                    label="Password"
                                    isInvalid={passwordInvalid}
                                    errorMessage={passwordMessage}
                                    value={password}
                                    onValueChange={setPassword}
                                />
                            </div>
                            <div className="grid w-full mt-2">
                                <ButtonVJ
                                    handleClick={() => handleLogin()}
                                    size={'md'}
                                    fullWidth={true}
                                    message={'Sign In'}
                                />
                                <button
                                    onClick={() => setForgotPasswordModal(true)}
                                    className={`text-center text-sky-400 text-sm hover:underline mt-2 ${
                                        forgotPassword ? 'block' : 'hidden'
                                    }`}
                                >
                                    Quên mật khẩu ?
                                </button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
            <ForgotPasswordModal
                usernameData={username}
                isOpen={forgotPasswordModal}
                onOpenChange={setForgotPasswordModal}
            />
        </div>
    );
}
