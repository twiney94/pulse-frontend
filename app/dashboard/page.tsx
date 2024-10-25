"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from "@/app/components/Layout";
import Admin from './Admin';
import Organizer from './Organizer';

const DashboardPage = () => {
    const router = useRouter();
    // const { user, loading } = useUser();
    const user = { role: 'admin' };

    return (
        <>
            {user.role === 'admin' && <Admin />}
            {user.role === 'organizer' && <Organizer />}
        </>
    );
};

export default DashboardPage;