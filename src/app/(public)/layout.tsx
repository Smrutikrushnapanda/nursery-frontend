import React from 'react';
import "./public.css";
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-white'>
      <Navbar/>
      {children}
      <Footer/>
    </div>
  )
}

export default PublicLayout;