export type Service = 'lounge' | 'connecting_flight';
export type Status = 0 | 1;

export const serviceColor: Record<Service, 'primary' | 'secondary' | 'success' | 'warning' | 'default' | 'danger'> = {
    lounge: 'primary',
    connecting_flight: 'secondary',
};
