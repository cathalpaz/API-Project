import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  // logged in/logged out display
  let userLinks;
  if (sessionUser) {
    userLinks = (
      <div className='logged-in'>
        <NavLink to='/groups/new'>Start a new group</NavLink>
        <ProfileButton user={sessionUser} />
      </div>
    )
  } else {
    userLinks = (
      <div className='logged-out'>
        <OpenModalMenuItem itemText={'Log In'} modalComponent={<LoginFormModal />} />
        <OpenModalMenuItem itemText={'Sign Up'} modalComponent={<SignupFormModal />} />
      </div>
    )
  }

  return (
    <div className='nav-container'>
        <NavLink className='title' exact to="/">LinkUp</NavLink>
      {isLoaded && userLinks}
    </div>
  );
}

export default Navigation;
