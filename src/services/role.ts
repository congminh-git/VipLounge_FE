import { getRequest } from './apiAxios';

export const getRoles = async () => {
    const url = `/role`;
    return getRequest(url);
};
