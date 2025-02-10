import {FaSearch} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import { useState, useEffect } from 'react';

export default function Header() {
  //state.user comes from the userSlice.js name:'user'
  const currentUser = useSelector(state => state.user.user.currentUser); 
  //The useSelector hook connects a component to the Redux store and returns a part of the state when given a function argument.
  //useSelector(state => state.user.user.currentUser) is a React-Redux hook that returns the user.user.currentUser part of the state
  //console.log(currentUser);
  
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search); //search area in current browser window
    urlParams.set('searchTerm', searchTerm); //replace or add 'searchTerm' value
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  //add useEffect to update search area in header
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  
  return (
    <header className='bg-slate-200 shadow-dm'>
    <div className='flex justify-between items-center max-w-6xl mx-auto p-2'>
    <Link to='/'>
      <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
        <span className='text-slate-500'>Ting</span>
        <span className='text-slate-700'>Estate</span>
      </h1>
      </Link>
      <form onSubmit={handleSubmit} className='bg-slate-100 p-2 rounded-lg flex items-center'>
        <input type='text' placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-48 md:w-64'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        ></input>
        <button>
          <FaSearch className='text-slate-500'></FaSearch>
        </button>
        
      </form>
      <ul className='flex gap-4'>
      <Link to='/'>
        <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
        </Link>
        <Link to='/about'>
        <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
        </Link>
        <Link to='/profile'>
        {currentUser ? (
          <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile' />
         ) : (
          <li className='text-slate-700 hover:underline'>
            Sign in
          </li>
          )}
        </Link>
      </ul>
      </div>
    </header>
  )
}
