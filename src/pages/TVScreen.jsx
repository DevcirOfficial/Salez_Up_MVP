import React, {useState, useEffect} from 'react'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const TVScreen = () => {


  const [selectedScreen, setSelectedScreen] = React.useState([])
  const [defaultOnOFf, setDefaultOnOff] = React.useState(false);
  const [imagePath, setImagePath] = useState('');
  const [name, setName] = useState('');
  const [screens, setScreens] = useState([]);

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

const handleSubmit = async (e) => {
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


  const Data = {
      name: name,
      image: imagePath,
      status: defaultOnOFf ? 'on' : 'off'
  };

  try {
      const response = await fetch('https://crmapi.devcir.co/api/tv_screens', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(Data),
      });

      if (response.ok) {
          toast.success('Tv-Screen successfully added', {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
          });
          console.log('Tv-Screen added successfully');
          setName('');
          setImagePath('');
          setDefaultOnOff(false);
          window.location.reload();
      } else {
          console.error('Failed to add Tv-Screen');
      }
  } catch (error) {
      console.error('Error:', error);
  }
};

useEffect(() => {
  const fetchScreens = async () => {
      try {
          const response = await fetch('https://crmapi.devcir.co/api/tv_screens');
          const data = await response.json();
          setScreens(data);
      } catch (error) {
          console.error('Error fetching screens:', error);
      }
  };

  fetchScreens();
}, []);


const screensData = [
  { id: 1, image: "images/theme1.png", name: "Theme 1" },
  { id: 2, image: "images/theme2.png", name: "Theme 2" }
];



  return (
    <div className='mx-2'>
      <Navbar />
      <div className='flex gap-3'>
        <SideBar />
        <div className='w-full mt-8 md:ml-12 mr-5 flex flex-col gap-[32px] mb-4'>
          {/* <h1 className='text-[28px] leading-[42px] text-[#555555] font-[500] -mb-6'>TV Screen</h1> */}
          <p className="text-[18px] leading-[42px] -mb-6">
              <span className="text-gray-400 font-medium">Dashboard/Others/</span><span className="text-gray-600 font-semibold">TV Screen</span>
            </p>
          <div className='flex flex-col w-full gap-6 p-8 pb-12 card' id='currentTeamLeaders'>
            <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B]'>Current TV Screens</h1>
            <div className='flex flex-wrap items-center gap-[10px] justify-start mx-5'>
              {/* will be mapped */}


              <div className='grid grid-cols-4 gap-x-[39px] gap-y-12'>
  {screensData.map((screen) => (
    <div key={screen.id} className='flex flex-col items-center gap-4 mb-6'>
      <img 
        src={screen.image} 
        alt={screen.name} 
        className={`w-[900px] h-[150px] rounded-[10px] ${selectedScreen == screen.name ? '' : 'opacity-40'}`} 
      />
      <div
        onClick={() => {
          const updatedSelection = selectedScreen == screen.name ? '' : screen.name;
          setSelectedScreen(updatedSelection);
          console.log(`Screen Name: ${screen.name}, Status: ${screen.status}`);
        }}
        className={`switch cursor-pointer w-[45.36px] h-[19.44px] rounded-[10.08px] border-[1.44px] relative ${selectedScreen == screen.name ? 'border-[#269F8B]' : 'border-[#F67E7E]'}`}
      >
        <div className={`toggler absolute w-[19.8px] h-[18.9px] -top-[1px] rounded-[10.08px] ${selectedScreen == screen.name ? 'bg-[#269F8B] right-0' : 'bg-[#F67E7E]'}`}></div>
      </div>
    </div>
  ))}
</div>

            </div>
          </div>

          <form onSubmit={handleSubmit} className='flex flex-col w-full gap-6 p-8 pb-12 card' id='currentTeamLeaders'>

            <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B]'>Add New TV Screen</h1>
            <div className='flex flex-wrap justify-start mx-2  gap-8'>
              <div className="flex flex-col items-center justify-center">
                <h3 className='text-[14px] font-normal leading-[21px] mb-3 text-dGreen'>
                  Add TV Screen theme
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
                  <input type="text"
                    id='name'
                    className='w-full bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px]'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Enter name' 
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
              <button type="submit" className='bg-themeGreen w-[152px] h-[36px] rounded-[10px] text-[16px] font-bold leading-[24px] tracking-[0.01em] [box-shadow:0px_8px_8px_0px_#40908433]'>Add</button>
            </div>
          
          </form>
          <ToastContainer />
          {/* </div> */}


        </div>
      </div>
    </div>
  )
}

export default TVScreen