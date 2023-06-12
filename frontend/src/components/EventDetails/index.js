import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { thunkGetEventDetails } from "../../store/events";
import { thunkGetGroupDetails } from "../../store/groups";
import "./EventDetails.css";
import OpenModalButton from "../OpenModalButton";
import DeleteEvent from "../DeleteEventModal";

function EventDetails() {
  const history = useHistory()
  const dispatch = useDispatch();
  const event = useSelector((state) => state.events.singleEvent);
  const group = useSelector((state) => state.groups.singleGroup);
//   console.log(event);
  console.log(group);
  const { eventId } = useParams();

  const formatDate = (d) => {
    if (!d) return null;
    let raw = new Date(d);
    let date = raw.toLocaleDateString('it-IT');
    let [month, day, year] = date.split("/");
    let time = raw.toLocaleTimeString('en-US').split(/(:| )/);
    return `${year}-${day.padStart(2, '0')}-${month.padStart(2, '0')} \u2022 ${time[0]}:${time[2]} ${time[6]}`;
}

  const groupClick = () => {
    history.push(`/groups/${group.id}`)
  }

  useEffect(() => {
    dispatch(thunkGetEventDetails(eventId));
  }, [dispatch, eventId]);
  useEffect(() => {
    if (event) {
      dispatch(thunkGetGroupDetails(event.groupId));
    }
  }, [event]);

  if (Object.values(event).length && Object.values(group).length) {
    return (
      <div className="event-content-container">
        <div className="event-details-header">
          <NavLink to="/events"> &lt; Events</NavLink>
          <h2>{event.name}</h2>
          <p>Hosted by {group.Organizer.firstName} {group.Organizer.lastName}</p>
        </div>
        <div className="event-gray-container">
          <div className="event-upper-block">
            <img alt="event" src={event.EventImages[0].url} />
            <div className="event-right-side">
              <div className="event-group-info" onClick={groupClick}>
                <img alt="group" src={group.GroupImages[0].url} />
                <div>
                  <h4>{group.name}</h4>
                  <p>{group.private ? "Private" : "Public"}</p>
                </div>
              </div>
              <div className="event-info">
                <div className="event-time">
                  <i className="fa-regular fa-clock event-icon"></i>
                  <div>
                    <span>START {formatDate(event.startDate)}</span>
                    <span>END {formatDate(event.endDate)}</span>
                  </div>
                </div>
                <div className="event-price">
                  <i className="fa-solid fa-dollar-sign event-icon"></i>
                  <span>{event.price === 0 ? "Free" : event.price}</span>
                </div>
                <div className="event-location">
                  <i className="fa-solid fa-map-pin event-icon"></i>
                  <span>{event.type}</span>
                </div>
                <div className="event-delete">
                  <OpenModalButton modalComponent={<DeleteEvent />} buttonText={'Delete'} />
                </div>
              </div>
            </div>
          </div>
          <div className="event-paragraph">
            <h4>Details</h4>
            <p>{event.description}. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Posuere morbi leo urna molestie at elementum eu facilisis. Eu turpis egestas pretium aenean pharetra magna ac placerat vestibulum.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Posuere morbi leo urna molestie at elementum eu facilisis. Eu turpis egestas pretium aenean pharetra magna ac placerat vestibulum.</p>
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
