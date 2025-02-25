import React from 'react'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'
import CurrentPrize from './CurrentPrize';

const Prizes = () => {
    const [prizeSelected, setPrizeSelected] = React.useState("VOUCHER");

    const handleVoucher = (prizeType) => {
        console.log(`This is ${prizeType}`);
        setPrizeSelected(prizeType);
    };

    const handleFood = (prizeType) => {
        console.log(`This is ${prizeType}`);
        setPrizeSelected(prizeType);
    };


    const handleExp = (prizeType) => {
        console.log(`This is ${prizeType}`);
        setPrizeSelected(prizeType);
    };

    return (
        <div className='mx-2'>
            <Navbar />
            <div className='flex gap-3'>
                <SideBar />
                <div className='w-full mt-8 md:ml-12 mr-5 flex flex-col gap-[32px] mb-4'>
                    {/* <h1 className='text-[28px] leading-[42px] text-[#555555] font-[500] -mb-6'>Prizes</h1> */}
                    <p className="text-[18px] leading-[42px] -mb-6">
              <span className="text-gray-400 font-medium">Dashboard/Others/</span><span className="text-gray-600 font-semibold">Prizes</span>
            </p>
                    <div className='flex flex-col w-full gap-6 p-8 pb-12 card' id='currentTeamLeaders'>
                        <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B] '>Current Prizes</h1>
                        <div className='flex flex-wrap items-center gap-[10px] justify-evenly'>

                            <div onClick={() => handleVoucher("VOUCHER")} className='cursor-pointer'>
                                <img src="/images/voucher.png" alt="" className={`w-[103px] h-[95px] ${prizeSelected == 'VOUCHER' ? "" : "opacity-40"}`} />
                                <h1 className={`text-[20px] font-normal leading-[30px] mt-6 text-center ${prizeSelected == 'VOUCHER' ? "text-[#269F8B]" : "text-[#333333] opacity-40"}`}>VOUCHER</h1>
                            </div>

                            <div onClick={() => handleFood("FOOD")} className='cursor-pointer'>
                                <img src="/images/food.png" alt="" className={`w-[103px] h-[95px] ${prizeSelected == 'FOOD' ? "" : "opacity-40"}`} />
                                <h1 className={`text-[20px] font-normal leading-[30px] mt-6 text-center ${prizeSelected == 'FOOD' ? "text-[#269F8B]" : "text-[#333333] opacity-40"}`}>FOOD</h1>
                            </div>

                            <div onClick={() => handleExp("EXPERIENCE")} className='cursor-pointer'>
                                <img src="/images/experience.png" alt="" className={`w-[103px] h-[95px] ${prizeSelected == 'EXPERIENCE' ? "" : "opacity-40"}`} />
                                <h1 className={`text-[20px] font-normal leading-[30px] mt-6 text-center ${prizeSelected == 'EXPERIENCE' ? "text-[#269F8B]" : "text-[#333333] opacity-40"}`}>EXPERIENCE</h1>
                            </div>

                        </div>
                    </div>
                    <CurrentPrize state={prizeSelected} />
                </div>
            </div>
        </div>
    )
}

export default Prizes