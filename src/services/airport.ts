import { getRequest } from './apiAxios';

export const getAirports = async () => {
    const url = `/airport`;
    return getRequest(url);
};
