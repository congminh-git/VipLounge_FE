'use client';

import { useDispatch } from 'react-redux';
import { setUserData, setUserToken, setUserPermissions } from '@/redux/auth/authSlice';

export const useClearUser = () => {
    const dispatch = useDispatch();

    const clearUser = () => {
        dispatch(setUserToken(null));
        dispatch(setUserPermissions(null));
        dispatch(
            setUserData({
                username: null,
                email: null,
                name: null,
                service: null,
                agencyCode: null,
                agencyName: null,
                serviceOption: null,
            }),
        );
    };

    return clearUser;
};
