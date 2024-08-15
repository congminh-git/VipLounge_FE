'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserPermissions, setUserToken, setUserData } from '@/redux/auth/authSlice';

const usePersistedAuth = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const permissions = localStorage.getItem('permissions');
        const email = localStorage.getItem('email');
        const username = localStorage.getItem('username');
        const name = localStorage.getItem('name');
        const service = localStorage.getItem('service');
        const agencyCode = localStorage.getItem('agencyCode');
        const agencyName = localStorage.getItem('agencyName');
        const serviceOption = localStorage.getItem('serviceOption');

        if (token) {
            dispatch(setUserToken(token));
        }

        if (permissions) {
            dispatch(setUserPermissions(JSON.parse(permissions)));
        }

        dispatch(
            setUserData({
                email: email,
                name: name,
                username: username,
                service: service,
                agencyCode: agencyCode,
                agencyName: agencyName,
                serviceOption: serviceOption,
            }),
        );

        setIsLoading(false);
    }, [dispatch]);

    return isLoading;
};

export default usePersistedAuth;
