export type IAirport = {
    id: string;
    name: string;
    code: string;
    latitude: {
        degrees: number;
        minutes: number;
        seconds: number;
        quadrant: string;
    };
    longitude: {
        degrees: number;
        minutes: number;
        seconds: number;
        quadrant: string;
    };
    timezone: {
        followsDst: boolean;
        utcOffsetDstOff: {
            iso: string;
            hours: number;
            minutes: number;
        };
        utcOffsetDstOn: {
            iso: string;
            hours: number;
            minutes: number;
        };
    };
    secure: boolean;
};
