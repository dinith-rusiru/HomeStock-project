import  { useState } from 'react';
import log from '../assest/signin.gif';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"; 
import { Link, useNavigate } from 'react-router-dom'; // Use useNavigate instead of useNavigation
import axios from 'axios';

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const [data, setData] = useState({
    email: '',
    password: ''    
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Correct hook for navigation

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const Handle = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when login starts
    try {
      const response = await axios.post('http://localhost:3001/api/signin', data);
      console.log(response.data);

      // Store token in localStorage
      localStorage.setItem('authtoken', response.data.token);

      // Navigate to home page or dashboard
      navigate('/');
    } catch (error) {
      console.error(error);
      setErrorMessage('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false); // Set loading to false once the login is done (either success or fail)
    }
  };

  return (
    <>
      <div className='bg-stone-200 min-h-screen flex justify-center items-center'>
      
        <div className='bg-white p-2 py-5 w-full max-w-md mx-auto'>
          <div className='mx-auto w-20 h-20'>
            <img src={log} alt="login icon" />
          </div>

          <form onSubmit={Handle}>
            <div>
              <label>Email:</label>
              <input 
                onChange={(e) => setData({ ...data, email: e.target.value })}
                type='email' 
                required // Add required attribute for validation
                className='mb-6 w-full border p-2 border-gray-300 rounded-lg' 
              />
            </div>

            <div>
              <label>Password:</label>
              <div className='flex items-center relative'>
                <input 
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  type={passwordVisible ? "text" : "password"} 
                  required // Add required attribute for validation
                  className='mb-6 w-full border p-2 border-gray-300 rounded-lg' 
                />
                <div 
                  className='absolute right-2 top-4 cursor-pointer'
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
                </div>
              </div>
              <Link to={'/forgot-password'} className='block w-fit ml-auto hover:underline hover:text-red-700'>
                Forgot Password
              </Link>
            </div>

            {/* Show error message if login fails */}
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}

            <button 
              type="submit"
              className='bg-red-500 px-3 py-1 rounded-lg text-white hover:bg-green-500 hover:scale-110 hover:text-red-700'
              disabled={loading} // Disable button when loading
            >
              {loading ? 'Logging in...' : 'Login'} {/* Show loading text */}
            </button>
          </form>
          <p className='mt-5'>
           If not have an account? <Link to={'/Sign'}>Sign up</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
