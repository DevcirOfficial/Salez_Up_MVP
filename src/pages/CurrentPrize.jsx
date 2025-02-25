
import React, {useState, useEffect} from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Voucher = () => {

    const [selectedVoucher, setSelectedVoucher] = React.useState([]);
    const [defaultOnOFf, setDefaultOnOff] = React.useState(false);
    const [imagePath, setImagePath] = useState('');
    const [name, setName] = useState('');
    const [vouchers, setVouchers] = useState([]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
            if (validImageTypes.includes(file.type)) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePath(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                alert('Invalid file format. Please upload an image file (png, jpg, jpeg, webp).');
            }
        }
    };



    const handleSubmitVoucher = async (e) => {
        e.preventDefault();

        if (!name || !imagePath) {
            toast.error('Please fill all the credentials.', {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            return;
          }

        const voucherData = {
            name: name,
            voucher_image: imagePath,
            status: defaultOnOFf ? 'on' : 'off'
        };

        try {
            const response = await fetch('https://crmapi.devcir.co/api/vouchers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(voucherData),
            });

            if (response.ok) {
                toast.success('Voucher successfully added', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                console.log('Voucher added successfully');
                setName('');
                setImagePath('');
                setDefaultOnOff(false);
                window.location.reload();
            } else {
                console.error('Failed to add voucher');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await fetch('https://crmapi.devcir.co/api/vouchers');
                const data = await response.json();
                setVouchers(data);
            } catch (error) {
                console.error('Error fetching vouchers:', error);
            }
        };

        fetchVouchers();
    }, []);



    return (
        <>
            <div className='flex flex-col w-full gap-6 p-8 pb-12 card' id='currentTeamLeaders'>
                <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B]'>Current Vouchers</h1>
                <div className='flex flex-wrap items-center gap-[10px] justify-start mx-5'>

<div className='grid grid-cols-6 gap-x-[30px] gap-y-12'>
  {vouchers.map((voucher) => (
    <div key={voucher.id} className='flex flex-col items-center gap-4 mb-6'>
      <img
        src={voucher.voucher_image}
        alt={voucher.name}
        className={`w-[130px] h-[90px] ${selectedVoucher == voucher.name ? '' : 'opacity-40'} border border-1 border-black/10 rounded-xl`}
      />
      <div
        onClick={() => {
          const updatedSelection = selectedVoucher == voucher.name ? '' : voucher.name;
          setSelectedVoucher(updatedSelection);
          console.log(`Voucher Name: ${voucher.name}, Status: ${voucher.status}`);
        }}
        className={`switch cursor-pointer w-[45.36px] h-[19.44px] rounded-[10.08px] border-[1.44px] relative ${selectedVoucher == voucher.name ? 'border-[#269F8B]' : 'border-[#F67E7E]'}`}
      >
        <div
          className={`toggler absolute w-[19.8px] h-[18.9px] -top-[1px] rounded-[10.08px] ${selectedVoucher == voucher.name ? 'bg-[#269F8B] right-0' : 'bg-[#F67E7E]'}`}
        ></div>
      </div>
    </div>
  ))}
</div>


               </div>
               </div>

            <form onSubmit={handleSubmitVoucher} className='flex flex-col w-full gap-6 p-8 pb-12 card' id='currentTeamLeaders'>
                <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B]'>Add New Voucher</h1>
                <div className='flex flex-wrap justify-start gap-8 mx-2'>
                    <div className="flex flex-col items-center justify-center">
                        <h3 className='text-[14px] font-normal leading-[21px] mb-3 text-dGreen'>
                            Voucher Logo
                        </h3>
                        <label htmlFor="fileInput" className="cursor-pointer">
                            <div className="items-center justify-center block w-32 h-32 overflow-hidden border-black  rounded-xl">
                                <img src="/images/image.jpg" alt="Selected" className="w-32 h-32 m-auto" />
                            </div>
                        </label>
                        <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            onChange={handleImageChange} 
                        />
                    </div>
                    <div className='flex flex-col'>
                        <div>
                            <label htmlFor='name' className='text-[14px] font-normal leading-[21px] mb-3 text-dGreen'>Name</label>
                            <input 
                                type="text"
                                id='name'
                                className='w-full bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px]'
                                placeholder='Enter name' 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                />
                        </div>
                        <div className='mt-5'>
                            <label htmlFor='onoff' className='text-[14px] font-normal leading-[21px] mb-3 text-dGreen'>Default On/Off</label>
                            <div
                                onClick={() => setDefaultOnOff(prev => !prev)}
                                className={`switch cursor-pointer mt-2 w-[45.36px] h-[19.44px] rounded-[10.08px] border-[1.44px] relative ${defaultOnOFf ? "border-[#269F8B]" : "border-[#F67E7E]"}`}>
                                <div className={`toggler absolute w-[19.8px] h-[18.9px] -top-[1px] rounded-[10.08px] ${defaultOnOFf ? "bg-[#269F8B] right-0" : "bg-[#F67E7E]"}`}></div>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col items-center justify-center'>
                        <h3 className='text-[14px] font-normal leading-[21px] mb-3 text-dGreen'>
                            Preview Upload
                        </h3>
                 <div className="flex flex-col items-center justify-center w-32 h-32 rounded-[20px] bg-lGreen cursor-pointer">
                        {imagePath && (
                            <img
                                src={imagePath}
                                alt="Preview"
                                className="flex flex-col items-center justify-center w-32 h-32 rounded-[20px] bg-lGreen cursor-pointer"
                            />
                        )}
                    </div>
                    </div>

                </div>
                <div className='flex justify-end w-full'>
                    <button type="submit" className='bg-themeGreen w-[152px] h-[36px] rounded-[10px] text-[16px] font-bold leading-[24px] tracking-[0.01em] [box-shadow:0px_8px_8px_0px_#40908433]'>Add Voucher</button>
                </div>
            
            </form>
            <ToastContainer />
        </>
    )
}

// ________________________________________________________  FOOD DIV ____________________________________________________________________________________

const Food = () => {

    const [selectedFood, setSelectedFood] = React.useState([]);
    const [defaultOnOFf, setDefaultOnOff] = React.useState(false);
    const [imagePathFood, setImagePathFood] = useState('');
    const [nameFood, setNameFood] = useState('');
    const [food, setFood] = useState([]);

    const handleImageChangeFood = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
            if (validImageTypes.includes(file.type)) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePathFood(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                alert('Invalid file format. Please upload an image file (png, jpg, jpeg, webp).');
            }
        }
    };
    

    

    const handleSubmitFood = async (e) => {
        e.preventDefault();

        if (!nameFood || !imagePathFood) {
            toast.error('Please fill all the credentials.', {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            return;
          }

        const FoodData = {
            name: nameFood,
            food_image: imagePathFood,
            status: defaultOnOFf ? 'on' : 'off'
        };

        try {
            const response = await fetch('https://crmapi.devcir.co/api/foods', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(FoodData),
            });

            if (response.ok) {
                toast.success('Food successfully added', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                console.log('Food added successfully');
                setNameFood('');
                setImagePathFood('');
                setDefaultOnOff(false);
                window.location.reload();
            } else {
                console.error('Failed to add voucher');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const fetchFood = async () => {
            try {
                const response = await fetch('https://crmapi.devcir.co/api/foods');
                const data = await response.json();
                setFood(data);
            } catch (error) {
                console.error('Error fetching foods:', error);
            }
        };

        fetchFood();
    }, []);


    return (
        <>
            <div className='flex flex-col w-full gap-6 p-8 pb-12 card' id='currentTeamLeaders'>
                <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B]'>Current Food</h1>
                <div className='flex flex-wrap items-center gap-[10px] justify-start mx-5'>
                    {/* will be mapped */}

<div className='grid grid-cols-6 gap-x-[30px] gap-y-12'>
  {food.map((food) => (
    <div key={food.id} className='flex flex-col items-center gap-4 mb-6'>
      <img
        src={food.food_image}
        alt={food.name}
        className={`w-[130px] h-[90px] ${selectedFood == food.name ? '' : 'opacity-40'} border border-1 border-black/10 rounded-xl`}
      />
      <div
        onClick={() => {
          const updatedSelection = selectedFood == food.name ? '' : food.name;
          setSelectedFood(updatedSelection);
          console.log(`Food Name: ${food.name}, Status: ${food.status}`);
        }}
        className={`switch cursor-pointer w-[45.36px] h-[19.44px] rounded-[10.08px] border-[1.44px] relative ${selectedFood == food.name ? 'border-[#269F8B]' : 'border-[#F67E7E]'}`}
      >
        <div
          className={`toggler absolute w-[19.8px] h-[18.9px] -top-[1px] rounded-[10.08px] ${selectedFood == food.name ? 'bg-[#269F8B] right-0' : 'bg-[#F67E7E]'}`}
        ></div>
      </div>
    </div>
  ))}
</div>

                </div>
            </div>
            <form onSubmit={handleSubmitFood} className='flex flex-col w-full gap-6 p-8 pb-12 card' id='currentTeamLeaders'>

                <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B]'>Add New Food</h1>
                <div className='flex flex-wrap justify-start gap-8 mx-2'>
                    <div className="flex flex-col items-center justify-center">
                        <h3 className='text-[14px] font-normal leading-[21px] mb-3 text-dGreen'>
                            Food Logo
                        </h3>
                        <label htmlFor="fileInput" className="cursor-pointer">
                        <div className="items-center justify-center block w-32 h-32 overflow-hidden border-black  rounded-xl">
                                <img src="/images/image.jpg" alt="Selected" className="w-32 h-32 m-auto" />
                            </div>

                        </label>

                        <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            onChange={handleImageChangeFood}
                        />

                    </div>
                    <div className='flex flex-col'>
                        <div>
                            <label htmlFor='name' className='text-[14px] font-normal leading-[21px] mb-3 text-dGreen'>Name</label>
                            <input type="text"
                                id='name'
                                className='w-full bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px]'
                                placeholder='Enter name' 
                                value={nameFood}
                                onChange={(e) => setNameFood(e.target.value)}
                                
                                />
                        </div>
                        <div className='mt-5'>
                            <label htmlFor='onoff' className='text-[14px] font-normal leading-[21px] mb-3 text-dGreen'>Default On/Off</label>
                            <div
                                onClick={() => setDefaultOnOff(prev => !prev)}
                                className={`switch cursor-pointer mt-2 w-[45.36px] h-[19.44px] rounded-[10.08px] border-[1.44px] relative ${defaultOnOFf ? "border-[#269F8B]" : "border-[#F67E7E]"}`}>
                                <div className={`toggler absolute w-[19.8px] h-[18.9px] -top-[1px] rounded-[10.08px] ${defaultOnOFf ? "bg-[#269F8B] right-0" : "bg-[#F67E7E]"}`}></div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                        <h3 className='text-[14px] font-normal leading-[21px] mb-3 text-dGreen'>
                            Preview Upload
                        </h3>
                        <div className="flex flex-col items-center justify-center w-32 h-32 rounded-[20px] bg-lGreen cursor-pointer">
                        {imagePathFood && (
                            <img
                                src={imagePathFood}
                                alt="Preview"
                                className="flex flex-col items-center justify-center w-32 h-32 rounded-[20px] bg-lGreen cursor-pointer"
                            />
                        )}
                    </div>
                    </div>
                </div>
                <div className='flex justify-end w-full'>
                    <button type="submit" className='bg-themeGreen w-[152px] h-[36px] rounded-[10px] text-[16px] font-bold leading-[24px] tracking-[0.01em] [box-shadow:0px_8px_8px_0px_#40908433]'>Add Food</button>
                </div>
                </form>
                <ToastContainer />
            {/* </div> */}
        </>
    )
}

// ________________________________________________________  FOOD DIV ____________________________________________________________________________________



// ________________________________________________________  EXP DIV ____________________________________________________________________________________


const Experience = () => {

    const [selectedExperience, setSelectedExperience] = React.useState([]);
    const [defaultOnOFf, setDefaultOnOff] = React.useState(false);
    const [imagePathExp, setImagePathExp] = useState('');
    const [nameExp, setNameExp] = useState('');
    const [exp, setExp] = useState([]);

    const handleImageChangeExp = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
            if (validImageTypes.includes(file.type)) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePathExp(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                alert('Invalid file format. Please upload an image file (png, jpg, jpeg, webp).');
            }
        }
    };

    const handleSubmitExp = async (e) => {
        e.preventDefault();

        if (!nameExp || !imagePathExp) {
            toast.error('Please fill all the credentials.', {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            return;
          }

        const ExpData = {
            name: nameExp,
            experience_image: imagePathExp,
            status: defaultOnOFf ? 'on' : 'off'
        };

        try {
            const response = await fetch('https://crmapi.devcir.co/api/experiences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ExpData),
            });

            if (response.ok) {
                toast.success('Experience successfully added', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                console.log('Experience added successfully');
                setNameExp('');
                setImagePathExp('');
                setDefaultOnOff(false);
                window.location.reload();
            } else {
                console.error('Failed to add voucher');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const fetchExp = async () => {
            try {
                const response = await fetch('https://crmapi.devcir.co/api/experiences');
                const data = await response.json();
                setExp(data);
            } catch (error) {
                console.error('Error fetching Experiences:', error);
            }
        };

        fetchExp();
    }, []);



    return (
        <>
            <div className='flex flex-col w-full gap-6 p-8 pb-12 card' id='currentTeamLeaders'>
                <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B]'>Current Experiences</h1>
                <div className='flex flex-wrap items-center gap-[10px] justify-start mx-5'>

<div className='grid grid-cols-6 gap-x-[30px] gap-y-12'>
  {exp.map((exp) => (
    <div key={exp.id} className='flex flex-col items-center gap-4 mb-6'>
      <img
        src={exp.experience_image}
        alt={exp.name}
        className={`w-[130px] h-[90px] ${selectedExperience == exp.name ? '' : 'opacity-40'} border border-1 border-black/10 rounded-xl`}
      />
      <div
        onClick={() => {
          const updatedSelection = selectedExperience == exp.name ? '' : exp.name;
          setSelectedExperience(updatedSelection);
          console.log(`Experience Name: ${exp.name}, Status: ${exp.status}`);
        }}
        className={`switch cursor-pointer w-[45.36px] h-[19.44px] rounded-[10.08px] border-[1.44px] relative ${selectedExperience == exp.name ? 'border-[#269F8B]' : 'border-[#F67E7E]'}`}
      >
        <div
          className={`toggler absolute w-[19.8px] h-[18.9px] -top-[1px] rounded-[10.08px] ${selectedExperience == exp.name ? 'bg-[#269F8B] right-0' : 'bg-[#F67E7E]'}`}
        ></div>
      </div>
    </div>
  ))}
</div>


                </div>
            </div>
            <form onSubmit={handleSubmitExp} className='flex flex-col w-full gap-6 p-8 pb-12 card' id='currentTeamLeaders'>

                <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B]'>Add New Experience</h1>
                <div className='flex flex-wrap justify-start gap-8 mx-2'>
                    <div className="flex flex-col items-center justify-center">
                        <h3 className='text-[14px] font-normal leading-[21px] mb-3 text-dGreen'>
                            Experience Logo
                        </h3>
                        <label htmlFor="fileInput" className="cursor-pointer">
                        <div className="items-center justify-center block w-32 h-32 overflow-hidden border-black  rounded-xl">
                                <img src="/images/image.jpg" alt="Selected" className="w-32 h-32 m-auto" />
                            </div>
                        </label>

                        <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            onChange={handleImageChangeExp}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <div>
                            <label htmlFor='name' className='text-[14px] font-normal leading-[21px] mb-3 text-dGreen'>Name</label>
                            <input type="text"
                                id='name'
                                className='w-full bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px]'
                                placeholder='Enter name' 
                                value={nameExp}
                                onChange={(e) => setNameExp(e.target.value)}
                                />
                        </div>
                        <div className='mt-5'>
                            <label htmlFor='onoff' className='text-[14px] font-normal leading-[21px] mb-3 text-dGreen'>Default On/Off</label>
                            <div
                                onClick={() => setDefaultOnOff(prev => !prev)}
                                className={`switch cursor-pointer mt-2 w-[45.36px] h-[19.44px] rounded-[10.08px] border-[1.44px] relative ${defaultOnOFf ? "border-[#269F8B]" : "border-[#F67E7E]"}`}>
                                <div className={`toggler absolute w-[19.8px] h-[18.9px] -top-[1px] rounded-[10.08px] ${defaultOnOFf ? "bg-[#269F8B] right-0" : "bg-[#F67E7E]"}`}></div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                        <h3 className='text-[14px] font-normal leading-[21px] mb-3 text-dGreen'>
                            Preview Upload
                        </h3>
                        <div className="flex flex-col items-center justify-center w-32 h-32 rounded-[20px] bg-lGreen cursor-pointer">
                        {imagePathExp && (
                            <img
                                src={imagePathExp}
                                alt="Preview"
                                className="flex flex-col items-center justify-center w-32 h-32 rounded-[20px] bg-lGreen cursor-pointer"
                            />
                        )}
                    </div>
                    </div>
                </div>
                <div className='flex justify-end w-full'>
                    <button type="submit" className='bg-themeGreen w-[152px] h-[36px] rounded-[10px] text-[16px] font-bold leading-[24px] tracking-[0.01em] [box-shadow:0px_8px_8px_0px_#40908433]'>Add Experience  </button>
                </div>
            </form>
            <ToastContainer />
            {/* </div> */}
        </>
    )
}


const CurrentPrize = ({ state }) => {
    if (state == "VOUCHER")
        return <Voucher />
    else if (state == "FOOD")
        return <Food />
    else return <Experience />
}

export default CurrentPrize