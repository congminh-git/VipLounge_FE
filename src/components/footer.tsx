import Link from 'next/link';

function Footer() {
    return (
        <div className="border-t bg-white p-4 sm:flex justify-between text-xs text-gray-500 fixed bottom-0 left-0 right-0">
            <div className="flex justify-between">
                <div className="mr-8">
                    <span className="w-2 h-2 mr-2 inline-block rounded-full bg-gray-200"></span>
                    <span>
                        <Link
                            href={
                                'https://www.vietjetair.com/vi/pages/de-co-chuyen-bay-tot-dep-1578323501979/dieu-kien-ve-1641466500765'
                            }
                        >
                            Fare rule
                        </Link>
                    </span>
                </div>
                <div>
                    <span className="w-2 h-2 mr-2 inline-block rounded-full bg-gray-200"></span>
                    <span>
                        <Link
                            href={
                                'https://www.vietjetair.com/vi/pages/de-co-chuyen-bay-tot-dep-1578323501979/dieu-le-van-chuyen-1601835865384'
                            }
                        >
                            Term and conditions
                        </Link>
                    </span>
                </div>
            </div>
            <div className="w-full text-center mt-4 sm:mt-0 sm:w-fit sm:text-start">Copy right 2024 @Booking demo</div>
        </div>
    );
}

export default Footer;
