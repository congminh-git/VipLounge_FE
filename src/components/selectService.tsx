'use client';

import React from 'react';
import { Select, SelectItem } from '@nextui-org/react';
import { Service } from '@/types/publicTypes';

interface ISelectService {
    defaultValue: Service;
    setData: (value: any) => void;
}

export default function SelectService({ defaultValue, setData }: ISelectService) {
    const services = [
        { key: 'lounge', name: 'Phòng chờ' },
        { key: 'connecting_flight', name: 'Dịch vụ nối chuyến' },
        { key: 'master', name: 'Tất cả dịch vụ' },
    ];
    return (
        <Select
            isRequired
            label="Dịch vụ"
            onChange={(e) => setData(e.target.value)}
            defaultSelectedKeys={[defaultValue]}
        >
            {services.map((element) => (
                <SelectItem key={element.key}>{element.name}</SelectItem>
            ))}
        </Select>
    );
}
