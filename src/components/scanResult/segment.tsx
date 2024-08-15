'use client';

export const parseDate = (input: any) => {
    if (typeof input === 'string') {
        let [datePart, timePart] = input.split(' ');
        let [year, month, day] = datePart.split('-');
        return {
            date: `${day}-${month}-${year}`,
            time: timePart.split(':').slice(0, 2).join(':'),
        };
    } else {
        return {
            date: null,
            time: null,
        };
    }
};

export function calculateTimeInterval(startTime: any, endTime: any) {
    let start = new Date(startTime);
    let end = new Date(endTime);
    let timeDiff = Math.abs(end.getTime() - start.getTime());
    let hours = Math.floor(timeDiff / 3600000);
    let minutes = Math.floor((timeDiff % 3600000) / 60000);
    return `${hours}h${minutes}`;
}

export default function Segment({ segment, segmentIndex, status, selected }: any) {
    return (
        <div className={`w-full rounded p-2 mb-2 ${selected ? 'border-yellow-400 border-2' : 'border'}`}>
            <div className="flex item-center justify-between text-sm border-b pb-2 mb-2">
                <p className="text-sky-400 h-1/3 mb-1">Chặng: {segmentIndex + 1}</p>
                <p className="h-1/3">
                    <span className="">Chuyến bay:</span>
                    <span className="text-gray-500 ml-2">
                        {segment.flight.airlineCode.code} {segment.flight.flightNumber}
                    </span>
                </p>
                <p className="h-1/3">
                    <span className="">Airbus:</span>
                    <span className="text-gray-500 ml-2">A{segment.flight.aircraftModel.identifier}</span>
                </p>
            </div>
            <div className="h-full col-span-3 grid grid-cols-8">
                <div className="col-span-2">
                    <div className="h-1/3 font-semibold mb-1">
                        <i className="sm:text-md text-base">
                            {segment.departure.airport.name} ({segment.departure.airport.code})
                        </i>
                    </div>
                    <div className="h-1/3"></div>
                    <div className="h-1/3 text-gray-500 text-sm flex flex-col justify-end items-center">
                        <span>{parseDate(segment.departure.localScheduledTime).time} </span>
                        <span className="h-2 w-2 rounded-full bg-gray-300 mx-2 hidden sm:block"></span>{' '}
                        <span>{parseDate(segment.departure.localScheduledTime).date}</span>
                    </div>
                </div>
                <div className="col-span-4 flex-grow mx-4">
                    <div className="h-1/3 text-sky-400 text-sm w-full text-center mb-1">
                        {calculateTimeInterval(
                            segment.departure.localScheduledTime,
                            segment.arrival.localScheduledTime,
                        )}
                    </div>
                    <div className="h-1/3 flex justify-between items-center relative">
                        <div className="w-2 h-2 bg-[url('/assets/images/Group16.png')] bg-cover"></div>
                        <div className="bg-[url('/assets/images/Vector1.png')] h-[1px] flex-grow"></div>
                        <div className="w-2 h-2 bg-[url('/assets/images/Group16.png')] bg-cover"></div>
                        <div className="w-5 h-5 bg-[url('/assets/images/airplane1.png')] bg-cover absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                    <div className="h-1/3 text-gray-500 text-xs w-full text-center mt-1">
                        {status === 0 ? 'Bay thẳng' : 'Nối chuyến'}
                    </div>
                </div>
                <div className="col-span-2 text-end">
                    <div className="h-1/3 font-semibold mb-1">
                        <i className="sm:text-md text-base">
                            {segment.arrival.airport.name} ({segment.arrival.airport.code})
                        </i>
                    </div>
                    <div className="h-1/3"></div>
                    <div className="h-1/3 text-gray-500 text-sm flex flex-col justify-end items-center">
                        <span>{parseDate(segment.arrival.localScheduledTime).time} </span>
                        <span className="h-2 w-2 rounded-full bg-gray-300 mx-2 hidden sm:block"></span>{' '}
                        <span>{parseDate(segment.arrival.localScheduledTime).date}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
