import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

function Home() {
  const sessionUser = useSelector(state => state.session.user)

  return (
    <div className='home-container'>
        <div className='upper-container'>
            <h1>The people platform-Where interests become friendships</h1>
            <p>lorem    </p>
            <img alt='home pic' src='' />
        </div>
        <div>
            <h3>How LinkUp works</h3>
            <p>Sign in as demo...</p>
        </div>
        <div>
            <img alt='home pic' src='' />
            <NavLink to='/groups' >See all groups</NavLink>
            <p>lorem </p>
        </div>
    </div>
  )
}

export default Home
