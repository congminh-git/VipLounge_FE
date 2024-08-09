import { deleteRequest, getRequest, postRequest, putRequest } from './apiAxios';

interface IPostLogin {
    username: string;
    password: string;
}

export const postLogin = async (data: IPostLogin) => {
    const url = `/user/login`;
    const body = {
        username: data.username,
        password: data.password,
    };
    return postRequest(url, body);
};

export const postForgotPassword = async (username: string, email: string) => {
    const url = `/user/forgot-password`;
    const body = {
        email: email,
        username: username,
    };
    return postRequest(url, body);
};

export const resetPassword = async (username: string, password: string, verifyCode: string) => {
    const url = `/user/reset-password`;
    const body = {
        username: username,
        password: password,
        verifyCode: verifyCode,
    };
    return postRequest(url, body);
};

export const getUsers = async () => {
    const url = `/user`;
    return getRequest(url);
};

export const getUserById = async (id: string) => {
    const url = `/user/${id}`;
    return getRequest(url);
};

export const deleteUserById = async (id: string) => {
    const url = `/user/${id}`;
    return deleteRequest(url);
};

export const createUser = async (data: any) => {
    const url = `/user/register`;
    return postRequest(url, data);
};

export const updateUserById = async (id: string, data: any) => {
    const url = `/user/update/${id}`;
    return putRequest(url, data);
};

export const activeUserById = async (id: string) => {
    const url = `/user/active/${id}`;
    return putRequest(url);
};
