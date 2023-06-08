import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { thunkGetEvents } from '../../store/events'
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min'
import EventDisplay from './EventDisplay'

function AllEvents() {
  const dispatch = useDispatch()
  const events = useSelector(state => Object.values(state.events.allEvents))

  useEffect(() => {
    dispatch(thunkGetEvents())
  }, dispatch)

  return (
    <div className='groups-container'>
      <div className='header-links'>
        <NavLink to='/events'>Events</NavLink>
        <NavLink to='/groups'>Groups</NavLink>
      </div>
      <div className='groups-display'>
        <h3>Events in LinkUp</h3>
        <div className='groups-list'>
          {events.map(event => {
            return <EventDisplay key={event.id} event={event} />
          })}
        </div>
      </div>
    </div>
  )
}

export default AllEvents
