import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {NavLink, useHistory, useParams,} from "react-router-dom/cjs/react-router-dom.min";
import { thunkGetEventDetails } from "../../store/events";
import { thunkGetGroupDetails } from "../../store/groups";
import "./EventDetails.css";
import OpenModalButton from "../OpenModalButton";
import DeleteEvent from "../DeleteEventModal";

function EventDetails() {
  const history = useHistory();
  const dispatch = useDispatch();
  const event = useSelector((state) => state.events.singleEvent);
  const group = useSelector((state) => state.groups.singleGroup);
  const user = useSelector((state) => state.session.user);
  // console.log(event);
  // console.log(group);
  const { eventId } = useParams();

  // console.log(event.startDate);
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

  useEffect(() => {
    dispatch(thunkGetEventDetails(eventId));
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
                    <span>START {formatTime(event.startDate)}</span>
                    <span>END {formatTime(event.endDate)}</span>
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
                  {isOrganizer() ? (
                    <OpenModalButton
                      modalComponent={<DeleteEvent />}
                      buttonText={"Delete"}
                    />
                  ) : null}
                </div>
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
