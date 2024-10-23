import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // to dispatch the functions
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice.js';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  
  //const [error, setError] = useState(null);
  //const [loading, setLoading] = useState(false);
  const {loading, error} = useSelector((state) => state.user); //user is the name: 'user' in userSlice
  
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  };
  //...formData: keep the data whatever it is
  //console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //setLoading(true);
      dispatch(signInStart());
      //to prevent refreshing the page when submit the form

      //add proxy in vite.config.js
      const res = await fetch('/api/auth/signin',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      //get it from index.js app.use((err, req, res, next) => {}
      //console.log(data);

      if (data.success === false) { //success if not defined from backend
        //setError(data.message);
        //setLoading(false);
        dispatch(signInFailure(data.message));
        return;
      }
      
      //setLoading(false);
      //setError(null);
      dispatch(signInSuccess(data));

      navigate('/');
      //console.log(formData);
    } catch (error) {
      //setLoading(false);
      //setError(error.message);
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
      <input type='email' placeholder='email'
      className='border p-3 rounded-lg' id='email' onChange={handleChange}></input>
      <input type='password' placeholder='password'
      className='border p-3 rounded-lg' id='password' onChange={handleChange}></input>
      <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-80'>{loading ? 'Loading...' : 'Sign In'}</button>
    </form>
    <div className='flex gap-2 mt-5'>
      <p>Don't have an account?</p>
      <Link to="/sign-up"><span className='text-blue-700'>Sign up</span></Link>
    </div>
    {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}
//m7: margin 7
//p-3: padding 3
//flex-col: elements list by column
//gap-4: add space
//mx-auto: center the container
//mt-5: margin top