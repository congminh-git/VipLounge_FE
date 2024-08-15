'use client';

export default function Passenger({ passenger, successStatus }: any) {
    return (
        <div className="w-full border rounded p-2 mb-4">
            <div className="bg-gray-400 text-white p-2 rounded-sm flex items-center">
                <span>{passenger.reservationProfile.title.toUpperCase() === 'MR' ? 'Ông' : 'Bà'}</span>
                <span className="w-2 h-2 rounded-full bg-white block mx-2"></span>
                <span>
                    {passenger.reservationProfile.lastName} {passenger.reservationProfile.firstName}
                </span>
            </div>
            <div className="mt-1">
                {successStatus === 0 ? (
                    <p>Hành khách có hạng vé đủ điều kiện vào phòng chờ</p>
                ) : successStatus === 1 ? (
                    <p>Hành khách được thêm vào yêu cầu đặc biệt sử dụng dịch vụ phòng chờ</p>
                ) : successStatus === 2 ? (
                    <p>Hành khách có hạng hội viên đủ điều kiện vào phòng chờ</p>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
