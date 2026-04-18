import React from 'react'

const Navbar = () => {
  return (
    <>
    <nav className=' bg-background'>
    <div className='main-container flex justify-between py-3 align-items-center bg-background'>
    <div className='logo'>
        <p>
            <span className='text-4xl font-bold'>Nursery</span>
        </p>
    </div>

    <div className='nav-menu grid place-items-center'>
        <div className='nav-items'>
            <ul className='flex gap-10 items-center justify-center h-full'>
                <li>Home</li>
                <li>About</li>
                <li>Contact Us</li>
            </ul>
        </div>
    </div>

    <div className='others'>
    <button className='default-button bg-foreground font-medium text-background rounded'>
        Sign in
    </button>
    </div>

    </div>
    </nav> 
    </>
  )
}

export default Navbar
