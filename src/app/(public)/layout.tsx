import React from 'react';
import "./public.css";
import Navbar from '@/components/Navbar/Navbar';

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-white'>
      <Navbar/>
      {children}
    </div>
  )
}

export default PublicLayout;