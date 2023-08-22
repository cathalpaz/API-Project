import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {NavLink, useHistory, useParams,} from "react-router-dom/cjs/react-router-dom.min";
import { thunkGetEventDetails } from "../../store/events";
import { thunkGetGroupDetails } from "../../store/groups";
import OpenModalButton from "../OpenModalButton";
import DeleteEvent from "../DeleteEventModal";
import "./EventDetails.css";
import { thunkDeleteAttendance, thunkGetAttendees, thunkPostAttendance } from "../../store/attendances";

function EventDetails() {
  const history = useHistory();
  const dispatch = useDispatch();
  const event = useSelector((state) => state.events.singleEvent);
  const group = useSelector((state) => state.groups.singleGroup);
  const user = useSelector((state) => state.session.user);
  const eventAttendees = useSelector((state) => state.attendances.eventAttendees.Attendees);
  const { eventId } = useParams();

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const formattedDate = date.toISOString().split("T")[0];
    const formattedTime = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return `${formattedDate} \u2022 ${formattedTime}`;
  };

  const isOrganizer = () => {
    if (user) {
      return user.id === group.Organizer.id;
    }
  };
  const groupClick = () => {
    history.push(`/groups/${group.id}`);
  };
  const editEvent = () => {
    history.push(`/events/${eventId}/edit`)
  }

  let buttonText = 'Attend this event'
  if (eventAttendees) {
    for (let person of eventAttendees) {
      if (person.id === user?.id) {

        buttonText = 'Remove Attendance'
      }
    }
  }

  const userId = {
    userId: parseInt(user?.id)
  }

  const handleAttend = async () => {
    if (buttonText === 'Attend this event') {
      await dispatch(thunkPostAttendance(eventId))
      dispatch(thunkGetAttendees(eventId))
    } else {
      await dispatch(thunkDeleteAttendance(userId, eventId))
      dispatch(thunkGetAttendees(eventId))
    }
  }


  useEffect(() => {
    dispatch(thunkGetEventDetails(eventId));
    dispatch(thunkGetAttendees(eventId));
  }, [dispatch, eventId]);
  useEffect(() => {
    if (event) {
      dispatch(thunkGetGroupDetails(event.groupId));
    }
  }, [dispatch, event]);

  if (Object.values(event).length && Object.values(group).length) {
    return (
      <div className="event-content-container">
        <div className="event-details-header">
          <div className="return-to">
          <i className="fa-solid fa-arrow-left"></i>
            <NavLink to="/events">Return to All Events</NavLink>
          </div>
          <h1>{event.name}</h1>
          <p>Hosted by {group.Organizer.firstName} {group.Organizer.lastName}</p>
        </div>
        <div className="event-gray-container">
          <div className="event-gray-content">
            <div className="event-upper-block">
              <img alt="event" src={event ? event.EventImages[0].url : ""} />
              <div className="event-right-side">
                <div className="event-group-info" onClick={groupClick}>
                  <img alt="group" src={group.GroupImages[0].url} />
                  <div>
                    <h4>{group.name}</h4>
                    <p>{group.private ? "Private" : "Public"}</p>
                  </div>
                </div>
                <div className="event-info">
                  <div className="event-detail">
                    <i className="fa-regular fa-clock event-icon"></i>
                    <div className="event-time-date">
                      <div className="event-time-start-end">
                        <p>START</p>
                        <span>{formatTime(event.startDate)}</span>
                      </div>
                      <div className="event-time-start-end">
                        <p>END</p>
                        <span>{formatTime(event.endDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="event-detail">
                    <i className="fa-solid fa-dollar-sign event-icon"></i>
                    <span>{event.price === 0 ? "Free" : event.price}</span>
                  </div>
                  <div className="event-detail">
                    <i className="fa-solid fa-map-pin event-icon"></i>
                    <span>{event.type}</span>
                  </div>

                  {isOrganizer() ? (
                    <div className="event-delete">
                      <button onClick={editEvent}>Update</button>
                      <OpenModalButton
                        modalComponent={<DeleteEvent />}
                        buttonText={"Delete"}
                      />
                  </div>
                    ) :
                      user ?
                      <div className="event-delete">
                        <button onClick={handleAttend}>{buttonText}</button>
                      </div>
                    : null}
                </div>
              </div>
            </div>
            <div className="event-paragraph">
              <h4>Details</h4>
              <p>
                {event.description}
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Posuere morbi leo urna molestie at elementum eu facilisis. Eu
                turpis egestas pretium aenean pharetra magna ac placerat
                vestibulum.
              </p>
            </div>
            <div className="group-members">
                <h2>Attendees ({eventAttendees?.length})</h2>
                <div className="members-list">
                  {eventAttendees?.map(member => (
                      <div key={member.id} className="member-card">
                        <i className="fa-solid fa-circle-user"></i>
                        <div className="member-details">
                          <span className="member-name">{member.firstName} {member.lastName}</span>
                          <span className="member-membership">attending</span>
                        </div>
                      </div>
                   ))}
                </div>
              </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="loading-container">
        <div className="loading"></div>
      </div>
    );
  }
}

export default EventDetails;
