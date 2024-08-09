import { deleteRequest, getRequest, postRequest, putRequest } from './apiAxios';

export const getLounges = async () => {
    const url = `/lounge`;
    return getRequest(url);
};

export const getLoungeById = async (id: string) => {
    const url = `/lounge/${id}`;
    return getRequest(url);
};

export const deleteLoungeById = async (id: string) => {
    const url = `/lounge/${id}`;
    return deleteRequest(url);
};

export const addLounge = async (data: any) => {
    const url = `/lounge`;
    return postRequest(url, data);
};

export const updateLoungeById = async (id: string, data: any) => {
    const url = `/lounge/update/${id}`;
    return putRequest(url, data);
};
