import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from "@/app/components/Layout";
import Admin from './Admin';
import Organizer from './Organizer';

const DashboardPage = () => {
    const router = useRouter();
    // const { user, loading } = useUser();
    const user = { role: 'admin' };

    return (
        <Layout>
            {user.role === 'admin' && <Admin />}
            {user.role === 'organizer' && <Organizer />}
        </Layout>
    );
};

export default DashboardPage;