'use client';

import Segment from './segment';
import { calculateTimeInterval } from './segment';

export default function Journey({ journey, selectedSegment, successStatus }: any) {
    return (
        <div className="w-full border rounded p-2 pb-0">
            <p className="pb-2 font-bold">
                Chuyến bay đang kiểm tra:{' '}
                {successStatus === 3 && journey.segments.length > 1
                    ? `Thời gian chờ nối chuyến: ${calculateTimeInterval(
                          journey.segments[0].arrival.scheduledTime,
                          journey.segments[1].departure.scheduledTime,
                      )}`
                    : ''}
            </p>
            {journey.segments.map((segment: any, segmentIndex: number) => {
                return (
                    <div key={`segment-${segmentIndex}`}>
                        <Segment
                            segment={segment}
                            segmentIndex={segmentIndex}
                            status={journey.segments.length > 1 ? 1 : 0}
                            selected={selectedSegment.key === segment.key}
                        />
                    </div>
                );
            })}
        </div>
    );
}
