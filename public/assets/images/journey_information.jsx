'use client';

import { parseNgayThang, tinhThoiGianBay } from '@/components/flight-options/flight_item';

export default function FlightInfomation({ direction, flight }) {
    return (
        <div className="py-6 text-start font-medium border-t">
            <div className="grid grid-cols-4">
                <div className="col-span-1">
                    <p className="text-sky-400 h-1/3 mb-1">Chiều {direction}: </p>
                    <p className="h-1/3">
                        <span className="">Chuyến bay:</span>
                        <span className="text-gray-500 ml-2">
                            {flight.segments[0].flight.airlineCode.code} {flight.segments[0].flight.flightNumber}
                        </span>
                    </p>
                    <p className="h-1/3">
                        <span className="">Airbus:</span>
                        <span className="text-gray-500 ml-2">
                            A{flight.segments[0].flight.aircraftModel.identifier}
                        </span>
                    </p>
                </div>
                <div className="h-full col-span-3 grid grid-cols-8">
                    <div className="col-span-2">
                        <div className="h-1/3 font-semibold mb-1">
                            <i>
                                {flight.segments[0].departure.airport.name} ({flight.segments[0].departure.airport.code}
                                )
                            </i>
                        </div>
                        <div className="h-1/3"></div>
                        <div className="h-1/3 text-gray-500 text-sm flex items-center">
                            {parseNgayThang(flight.segments[0].departure.localScheduledTime).time}{' '}
                            <span className="block h-2 w-2 rounded-full bg-gray-300 mx-2"></span>{' '}
                            {parseNgayThang(flight.segments[0].departure.localScheduledTime).date}
                        </div>
                    </div>
                    <div className="col-span-4 flex-grow mx-4">
                        <div className="h-1/3 text-sky-400 text-sm w-full text-center mb-1">
                            {tinhThoiGianBay(
                                flight.segments[0].departure.localScheduledTime,
                                flight.segments[0].arrival.localScheduledTime,
                            )}
                        </div>
                        <div className="h-1/3 flex justify-between items-center relative">
                            <div className="w-2 h-2 bg-[url('/Group16.png')] bg-cover"></div>
                            <div className="bg-[url('/Vector1.png')] h-[1px] flex-grow"></div>
                            <div className="w-2 h-2 bg-[url('/Group16.png')] bg-cover"></div>
                            <div className="w-5 h-5 bg-[url('/airplane1.png')] bg-cover absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                        <div className="h-1/3 text-gray-500 text-xs w-full text-center mt-1">Bay thẳng</div>
                    </div>
                    <div className="col-span-2 text-end">
                        <div className="h-1/3 font-semibold mb-1">
                            <i>
                                {flight.segments[0].arrival.airport.name} ({flight.segments[0].arrival.airport.code})
                            </i>
                        </div>
                        <div className="h-1/3"></div>
                        <div className="h-1/3 text-gray-500 text-sm flex justify-end items-center">
                            {parseNgayThang(flight.segments[0].arrival.localScheduledTime).time}{' '}
                            <span className="block h-2 w-2 rounded-full bg-gray-300 mx-2"></span>{' '}
                            {parseNgayThang(flight.segments[0].arrival.localScheduledTime).date}
                        </div>
                    </div>
                </div>
                {flight.segments[1] ? (
                    <>
                        <div className="col-span-1"></div>
                        <div className="h-full col-span-3 grid grid-cols-8 mt-5">
                            <div className="col-span-2">
                                <div className="h-1/3 font-semibold mb-1">
                                    <i>
                                        {flight.segments[1].departure.airport.name} (
                                        {flight.segments[1].departure.airport.code})
                                    </i>
                                </div>
                                <div className="h-1/3"></div>
                                <div className="h-1/3 text-gray-500 text-sm flex items-center">
                                    {parseNgayThang(flight.segments[1].departure.localScheduledTime).time}{' '}
                                    <span className="block h-2 w-2 rounded-full bg-gray-300 mx-2"></span>{' '}
                                    {parseNgayThang(flight.segments[1].departure.localScheduledTime).date}
                                </div>
                            </div>
                            <div className="col-span-4 flex-grow mx-4">
                                <div className="h-1/3 text-sky-400 text-sm w-full text-center mb-1">
                                    {tinhThoiGianBay(
                                        flight.segments[1].departure.localScheduledTime,
                                        flight.segments[1].arrival.localScheduledTime,
                                    )}
                                </div>
                                <div className="h-1/3 flex justify-between items-center relative">
                                    <div className="w-2 h-2 bg-[url('/Group16.png')] bg-cover"></div>
                                    <div className="bg-[url('/Vector1.png')] h-[1px] flex-grow"></div>
                                    <div className="w-2 h-2 bg-[url('/Group16.png')] bg-cover"></div>
                                    <div className="w-5 h-5 bg-[url('/airplane1.png')] bg-cover absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                                </div>
                                <div className="h-1/3 text-gray-500 text-xs w-full text-center mt-1">Bay thẳng</div>
                            </div>
                            <div className="col-span-2 text-end">
                                <div className="h-1/3 font-semibold mb-1">
                                    <i>
                                        {flight.segments[1].arrival.airport.name} (
                                        {flight.segments[1].arrival.airport.code})
                                    </i>
                                </div>
                                <div className="h-1/3"></div>
                                <div className="h-1/3 text-gray-500 text-sm flex justify-end items-center">
                                    {parseNgayThang(flight.segments[1].arrival.localScheduledTime).time}{' '}
                                    <span className="block h-2 w-2 rounded-full bg-gray-300 mx-2"></span>{' '}
                                    {parseNgayThang(flight.segments[1].arrival.localScheduledTime).date}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
