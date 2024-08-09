interface ISignOutSVG {
    className?: string;
}

export const SignOutSVG: React.FC<ISignOutSVG> = ({ className }) => {
    return (
        <svg
            className={`${className} w-6 h-6 text-gray-800 dark:text-white`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 16"
        >
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
            />
        </svg>
    );
};
