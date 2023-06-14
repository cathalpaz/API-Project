import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import './Home.css';
import OpenModalButton from '../OpenModalButton';
import SignupFormModal from '../SignupFormModal'

function Home() {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className="home-container">
      <div className="home-upper-container">
        <div className="home-upper-text">
          <h1>The people platform—Where interests become friendships</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Tortor
            vitae purus faucibus ornare suspendisse sed. Hendrerit gravida
            rutrum quisque non. Tincidunt lobortis feugiat vivamus at. Quam
            vulputate dignissim suspendisse in est ante.
          </p>
        </div>
        <img alt="home" src="https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=640" />
      </div>
      <div className="home-middle-container">
        <h3>How .join(Up) works</h3>
        <p>
          Log in as demo. Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna
          aliqua.
        </p>
      </div>
      <div className="home-lower-container">
        <div className="home-links">
          <img alt="group" src="https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=256" />
          <NavLink to="/groups" className='home-navlink'>See all groups</NavLink>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div className="home-links">
          <img alt="event" src="https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=256" />
          <NavLink to="/events" className='home-navlink'>Find an event</NavLink>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div className="home-links">
          <img alt="join" src="https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=256" />
          {sessionUser ? <NavLink to="/groups/new" className='home-navlink'>Start a new group</NavLink> : <span>Start a new group</span>}
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
      <div className="home-join-btn">
        {sessionUser ? null : (
            <OpenModalButton buttonText={'Join Us'} modalComponent={<SignupFormModal />} />
        )}
      </div>
    </div>
  );
}

export default Home;
