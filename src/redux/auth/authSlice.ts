import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface authStatte {
    username: string | null;
    email: string | null;
    name: string | null;
    permissions: string | null;
    service: string | null;
    token: string | null;
    agencyCode: string | null;
    agencyName: string | null;
    serviceOption: string | null;
}

const initialState: authStatte = {
    username: null,
    email: null,
    name: null,
    token: null,
    permissions: null,
    service: null,
    agencyCode: null,
    agencyName: null,
    serviceOption: null,
};

interface IUserData {
    username: string | null;
    email: string | null;
    name: string | null;
    service: string | null;
    agencyCode: string | null;
    agencyName: string | null;
    serviceOption: string | null;
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserPermissions: (state, action: PayloadAction<string | null>) => {
            state.permissions = action.payload;
        },
        setUserToken: (state, action: PayloadAction<string | null>) => {
            state.token = action.payload;
        },
        setUserData: (state, action: PayloadAction<IUserData>) => {
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.service = action.payload.service;
            state.agencyCode = action.payload.agencyCode;
            state.agencyName = action.payload.agencyName;
            state.serviceOption = action.payload.serviceOption;
        },
    },
});

export const { setUserPermissions, setUserToken, setUserData } = authSlice.actions;

export default authSlice.reducer;
