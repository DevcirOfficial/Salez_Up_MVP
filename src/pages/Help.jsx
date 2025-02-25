import React from 'react'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'

const Help = () => {
    return (
        <>
            <Navbar />
            <div className='flex'>
                <SideBar />
                <div className='w-full mt-8 md:ml-12 mr-5'>
                    <h1 className='text-[28px] leading-[42px] text-[#555555] font-[500]'>Help</h1>
                </div>
            </div>
        </>
    )
}

export default Help