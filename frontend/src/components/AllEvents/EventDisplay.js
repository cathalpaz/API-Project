import React from 'react'
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';

function EventDisplay({ event }) {
  // console.log(event);
  return (
    <div>
        <NavLink key={event.id} to={`/events/${event.id}`} className='display-container'>
            <div className='left-container'>
                <img alt='event' src={event.previewImage}></img>
            </div>
            <div className='right-container'>
                <span>{event.startDate}</span>
                <h2>{event.name}</h2>
                <h4>{event.Venue.city}, {event.Venue.state}</h4>
            </div>
        </NavLink>
        <p>{event.description}. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elementum integer enim neque volutpat ac tincidunt vitae semper.</p>
    </div>
  )
}

export default EventDisplay
