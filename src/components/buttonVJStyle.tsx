import React from 'react';
import { Button } from '@nextui-org/react';
import { ReactNode } from 'react';

interface ButtonVJProps {
    handleClick: () => void;
    fullWidth?: boolean;
    svgIcon?: ReactNode;
    message?: string;
    className?: string;
    startContent?: any;
    endContent?: any;
    size?: 'sm' | 'md' | 'lg' | undefined;
}

const ButtonVJ: React.FC<ButtonVJProps> = ({
    handleClick,
    svgIcon = <></>,
    fullWidth = true,
    message = '',
    className = '',
    startContent = <></>,
    endContent = <></>,
    size = 'sm',
}) => {
    return (
        <Button
            onClick={handleClick}
            fullWidth={fullWidth}
            className={`${className} flex justify-center items-center bg-gradient-to-r from-[#F9A51A] to-[#FFDD00]`}
            startContent={startContent}
            endContent={endContent}
            size={size}
        >
            <span>{message}</span>
            {svgIcon}
        </Button>
    );
};

export { ButtonVJ };
