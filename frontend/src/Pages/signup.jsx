import { useState, useEffect } from 'react';
import log from '../assest/signin.gif';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link } from 'react-router-dom';

import SummeryApi from '../common/index';
import { toast } from 'react-toastify';

// Helper function to convert image to base64
const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};


const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmpasswordVisible, setconfirmPasswordVisible] = useState(false); 
  const [data, setData] = useState({
    email: '',
    password: '',
    name: 'fh',
    confirmpassword: '',
    photo: '',
    role:''
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const togglecomfirmPasswordVisibility = () => {
    setconfirmPasswordVisible(!confirmpasswordVisible);
  };

; // Import ImageTobase64 function
  
   const handleupload = async (e) => {
    const file = e.target.files[0];
    try {
      // Convert the image to base64
      const imgBase64 = await convertImageToBase64(file);
      setData({ ...data, photo: imgBase64 });
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };
  useEffect(() => {
    if (data.photo) {
      console.log("Updated photo:", data.photo); // This will log the updated photo
    }
  }, [data.photo]); // Trig

  const Handle = async (e) => {
    e.preventDefault();
    console.log(data);
    if (data.password === data.confirmpassword) {
      try {
        const response = await fetch(SummeryApi.signUp.url, {
          method: SummeryApi.signUp.method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
  
        // Check if the request was successful
        if (response.ok) {
          const responseData = await response.json();
          console.log("User created successfully:", responseData);
          toast.success("User created successfully");
         
        } else {
          const errorData = await response.json();
          console.log("Error: ", errorData.message);
          toast.error(`Error: ${errorData.message}`);
        }
      } catch (err) {
        console.log("Error:", err);
        toast.error("An error occurred while creating the user");
      }
    } else {
      toast.error("Passwords do not match");
    }
  };
  
   
    

  return (
    <>
      <div className='mx-auto items-center flex h-screen container p-5'>
        <div className='bg-white p-2 py-12 w-full max-w-md mx-auto'>
          <div className='mx-auto w-20 h-20 relative overflow-hidden'>
            <img src={log} alt="login icon" />

            {/* Image upload form */}
            <form>
              <label>
                <div className=' bg-slate-400 mt-3 absolute bottom-0 rounded-b-full max-w-32 mx-auto text-md cursor-pointer text-center'>
                  Upload Photo
                </div>
                <input type='file' className='hidden' onChange={handleupload} />
              </label>
          {/* Display uploaded image preview */}
          {data.photo && (
            <div className="mx-auto w-40 h-20 scale-75 absolute bottom-4 -left-10">
              <img
                src={data.photo}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full mx-auto object-cover"
              />
            </div>
          )}

            </form>
          </div>



          <form onSubmit={Handle}>
            <div>
              <label>Email:</label>
              <input
              required
                onChange={(e) => setData({ ...data, email: e.target.value })}
                
                type='email'
                className='mb-6 w-full border p-2 border-gray-300 rounded-lg'
              />
            </div>
            <div>
              <label>Name:</label>
              <input
              required
                onChange={(e) => setData({ ...data, name: e.target.value })}
                type='text'
                className='mb-6 w-full border p-2 border-gray-300 rounded-lg'
              />
            </div>

            <div>
              <label>Password:</label>
              <div className='flex items-center relative'>
                <input
                required
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  type={passwordVisible ? "text" : "password"}
                  className='mb-6 w-full border p-2 border-gray-300 rounded-lg'
                />
                <div
                  className='absolute right-2 top-4 cursor-pointer'
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
                </div>
              </div>
            </div>

            <div>
              <label>Confirm Password:</label>
              <div className='flex items-center relative'>
                <input
                required
                  onChange={(e) => setData({ ...data, confirmpassword: e.target.value })}
                  type={confirmpasswordVisible ? "text" : "password"}
                  className='mb-6 w-full border p-2 border-gray-300 rounded-lg'
                />
                <div
                  className='absolute right-2 top-4 cursor-pointer'
                  onClick={togglecomfirmPasswordVisibility}
                >
                  {confirmpasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
                </div>
              </div>
            </div>

            <button className='bg-red-500 px-3 py-1 rounded-lg text-white hover:bg-green-500 hover:scale-110 hover:text-red-700'>
              Sign Up
            </button>
          </form>

          <p className='mt-5'>
            Already have an account? <Link to={'/sign-up'}>Log in</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
