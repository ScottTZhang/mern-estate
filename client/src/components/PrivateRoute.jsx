import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

// An <Outlet> should be used in parent route elements to render their child route elements. This allows nested UI to show up when child routes are rendered.

//Cover the <Profile /> component with this component
export default function PrivateRoute() {
  const {currentUser} = useSelector(state => state.user.user);

  //console.log(currentUser);
  
  return currentUser ? <Outlet /> : <Navigate to='/sign-in' />;
}
