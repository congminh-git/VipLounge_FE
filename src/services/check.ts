import { getRequest, postRequest } from './apiAxios';

interface IPostCheck {
    pnr: string;
    fullName: string;
    cityPair?: string;
    airline?: string;
    flightNumber?: string;
    flightDateNumber?: string;
    service?: string | any;
    user?: string | null | undefined;
    agency?: string | null;
}

export const postCheck = async (data: IPostCheck) => {
    const url = `/check`;
    const body = data;
    return postRequest(url, body);
};
