import React from 'react'
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';

function EventDisplay({ event }) {
  console.log(event);
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
                <p></p>
            </div>
        </NavLink>
    </div>
  )
}

export default EventDisplay
