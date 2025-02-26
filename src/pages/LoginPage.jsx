// import React from 'react'
// import { useNavigate } from 'react-router-dom'

// const LoginPage = () => {

//     const navigate = useNavigate()

//     return (
//         <div className="flex items-center justify-center h-screen bg-gray-200">
//             <div className="container">
//                 <div className="p-5 mx-2 bg-white rounded-lg shadow-lg md:p-20">
//                     <div className="text-center">
//                         <h2 className="text-4xl font-extrabold leading-10 tracking-tight text-gray-900 sm:text-5xl sm:leading-none md:text-6xl">
//                             CRM<span className="text-[#269F8B]">&nbsp;Tool</span>
//                         </h2>

//                         <p className="mt-10 font-semibold text-black text-md md:text-xl">This is SalezUp CRM Login Page for Manager, Sales Agent and Team Leader.</p>
//                     </div>
//                     <div className="flex flex-wrap justify-center mt-10">

//                         <div className="m-3">
//                             <button
//                                 onClick={() => { navigate('/Login', { state: { role: 'Sales Agent' } }) }}
//                                 title="Sales Agent Login"
//                                 className="inline-flex items-center h-16 px-6 py-2 font-bold tracking-wide text-center text-[#269F8B] bg-white border-2 border-[#269F8B] rounded shadow-md md:w-56 hover:border-gray-600 hover:bg-[#269F8B] hover:text-white">
//                                 <span className="mx-auto">Sales Agent Login</span>
//                             </button>
//                         </div>

//                         <div className="m-3">
//                             <button
//                                 onClick={() => { navigate('/Login', { state: { role: 'Manager' } }) }}
//                                 title="Quicktoolz On Facebook"
//                                 className="inline-flex items-center h-16 px-6 py-2 mt-0 font-bold tracking-wide text-center text-[#269F8B] bg-white border-2 border-[#269F8B] rounded shadow-md md:w-42 hover:border-gray-600 hover:bg-[#269F8B] hover:text-white">
//                                 <span className="mx-auto">Manager Login</span>
//                             </button>
//                         </div>

//                         <div className="m-3">
//                             <button title="Team Leader Login"
//                                 onClick={() => { navigate('/Login', { state: { role: 'Team Leader' } }) }}
//                                 className="inline-flex items-center h-16 px-6 py-2 font-bold tracking-wide text-center text-[#269F8B] bg-white border-2 border-[#269F8B] rounded shadow-md md:w-56 hover:border-gray-600 hover:bg-[#269F8B] hover:text-white">
//                                 <span className="mx-auto">Team Leader Login</span>
//                             </button>
//                         </div>

//                     </div>
//                 </div>
//             </div>
//         </div>

//     )
// }

// export default LoginPage





import React from 'react'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center h-screen bg-gray-200">
            <div className="container">
                <div className="p-5 mx-2 bg-white rounded-lg shadow-lg md:p-20">
                    <div className="text-center">
                        <h2 className="text-4xl font-extrabold leading-10 tracking-tight text-gray-900 sm:text-5xl sm:leading-none md:text-6xl">
                            CRM<span className="text-[#269F8B]">&nbsp;Tool</span>
                        </h2>
                        <p className="mt-10 font-semibold text-black text-md md:text-xl">This is SalezUp CRM Login Page for Manager, Sales Agent and Team Leader.</p>
                    </div>
                    <div className="flex flex-wrap justify-center mt-10">

                        <div className="m-3">
                            <button onClick={() => {navigate('/TeamLeader/4q7Z1Y2f')}} title="Super Admin Panel"
                                // href="https://salez-up-mvp-one.vercel.app/TeamLeader/4q7Z1Y2f" 
                                target='_blank'
                                className="inline-flex items-center h-16 px-6 py-2 font-bold tracking-wide text-center text-[#269F8B] bg-white border-2 border-[#269F8B] rounded shadow-md md:w-56 hover:border-gray-600 hover:bg-[#269F8B] hover:text-white">
                                <span className="mx-auto">Team Leader</span>
                            </button>
                        </div>

                        <div className="m-3">
                            <button onClick={() => {navigate('/SalesAgent/x9y8z7g3')}} title="Super Admin Panel"
                                // href="https://salez-up-mvp-one.vercel.app/SalesAgent/x9y8z7g3"
                                 target='_blank'
                                className="inline-flex items-center h-16 px-6 py-2 font-bold tracking-wide text-center text-[#269F8B] bg-white border-2 border-[#269F8B] rounded shadow-md md:w-56 hover:border-gray-600 hover:bg-[#269F8B] hover:text-white">
                                <span className="mx-auto">Sales Agent</span>
                            </button>
                        </div>

                        <div className="m-3">
                            <button onClick={() => {navigate('/OpsManager_SignIn/vH0kx3Lq5JS8')}} title="Super Admin Panel"
                                // href="https://salez-up-mvp-one.vercel.app/OpsManager_SignIn/vH0kx3Lq5JS8"
                                 target='_blank'
                                className="inline-flex items-center h-16 px-6 py-2 font-bold tracking-wide text-center text-[#269F8B] bg-white border-2 border-[#269F8B] rounded shadow-md md:w-56 hover:border-gray-600 hover:bg-[#269F8B] hover:text-white">
                                <span className="mx-auto">Manager</span>
                            </button>
                        </div>

                        {/* <div className="m-3">
                            <a title="Super Admin Panel"
                                href="https://salez-up-cco-panel.vercel.app/" target='_blank'
                                className="inline-flex items-center h-16 px-6 py-2 font-bold tracking-wide text-center text-[#269F8B] bg-white border-2 border-[#269F8B] rounded shadow-md md:w-56 hover:border-gray-600 hover:bg-[#269F8B] hover:text-white">
                                <span className="mx-auto">Super Admin Panel</span>
                            </a>
                        </div>


                        <div className="m-3">
                            <a
                                href="/admin_Login"
                                target='_blank'
                                title="Agent Login"
                                className="inline-flex items-center h-16 px-6 py-2 font-bold tracking-wide text-center text-[#269F8B] bg-white border-2 border-[#269F8B] rounded shadow-md md:w-56 hover:border-gray-600 hover:bg-[#269F8B] hover:text-white">
                                <span className="mx-auto">Admin Login</span>
                            </a>
                        </div> */}

                    </div>
                </div>
            </div>
        </div>

    )
}

export default LoginPage