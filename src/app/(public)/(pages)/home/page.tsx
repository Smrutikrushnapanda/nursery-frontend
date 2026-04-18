"use client";

import { useAppStore } from '@/utils/store/store';
import { organizationApis } from "@/src/utils/api/api";
import { useEffect } from 'react';

const Home = () => {
    const {organization, setOrganization} = useAppStore();
    const { getOrganizationData } = organizationApis;

    const organizationId = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

    const getOrganization = async ()=>{
        if(!organizationId) return;
        const data = await getOrganizationData(organizationId);
        setOrganization(data);
        console.log(data);
    }

    useEffect(()=>{
        getOrganization();
    },[])

  return (
    <div className=''>
      This is homepage
    </div>
  )
}

export default Home
