import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { thunkGetEventDetails } from '../../store/events'
import { thunkGetGroupDetails } from '../../store/groups'
import './EventDetails.css'

function EventDetails() {
  const dispatch = useDispatch()
  const event = useSelector(state => state.events.singleEvent)
  const group = useSelector(state => state.groups.singleGroup)
  const { eventId } = useParams()

  useEffect(() => {
    dispatch(thunkGetEventDetails(eventId))
  }, [dispatch, eventId])
  useEffect(() => {
    if (event) {
        dispatch(thunkGetGroupDetails(event.groupId))
    }
  }, [event])

  if (Object.values(event).length && Object.values(group).length) {
    return (
      <div className='content-container'>
          <div>
              <NavLink to='/events'> &lt; Events</NavLink>
              <h1>{event.name}</h1>
              <h4>Hosted by, {group.Organizer.firstName} {group.Organizer.lastName}</h4>
          </div>
          <div className='gray-container'>
              <div className='upper-block'>
                  <img alt='event' src={event.EventImages[0].url} />
                  <div className='right-side'>
                      <div className='group-info'>
                          <img alt='group' src={group.GroupImages[0].url} />
                          <div>
                              <h4>{group.name}</h4>
                              <p>{group.private ? 'Private' : 'Public'}</p>
                          </div>
                      </div>
                      <div className='event-info'>
                          <div>
                              <i className="fa-regular fa-clock"></i>
                              <div>
                                  <span>START</span>
                                  <span>END</span>
                              </div>
                              <div>
                                  <span>{event.startDate}</span>
                                  <span>{event.endDate}</span>
                              </div>
                          </div>
                          <div>
                              <i className="fa-solid fa-dollar-sign"></i>
                              <div>
                                  <span>{event.price === 0 ? "Free" : event.price}</span>
                              </div>
                          </div>
                          <div>
                              <i className="fa-solid fa-map-pin"></i>
                          </div>
                      </div>
                  </div>
              </div>
              <div>
                  <h4>Details</h4>
                  <p>{event.description}</p>
              </div>
          </div>
      </div>
    )
} else {
    return <div>loading</div>
}
}

export default EventDetails
