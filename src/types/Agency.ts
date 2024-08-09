import { Service, Status } from './publicTypes';

export type IAgency = {
    id: string;
    name: string;
    code: string;
    service: Service;
    status: Status;
};
