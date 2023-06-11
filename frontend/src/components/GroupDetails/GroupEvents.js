// import React from 'react'

// function GroupEvents() {
//   return (
//     <div>GroupEvents</div>
//   )
// }

// export default GroupEvents
import { useHistory } from "react-router-dom";
import "./Groupdetails.css";
import { useSelector } from "react-redux";

const formatDate = (d) => {
  if (!d) return null;
  let raw = new Date(d);
  let date = raw.toLocaleDateString('it-IT');
  let [month, day, year] = date.split("/");
  let time = raw.toLocaleTimeString('en-US').split(/(:| )/);
  return `${year}-${day.padStart(2, '0')}-${month.padStart(2, '0')} \u2022 ${time[0]}:${time[2]} ${time[6]}`;
}

const GroupEvents = ({ event, group }) => {
  const history = useHistory();
  const groups = useSelector((state) => state.groups.allGroups);
  console.log(event);
  if (!group) group = groups[event.groupId];

  const onClick = () => {
    history.push(`/events/${event.id}`);
  }

  return (
    <div className="event-card-dets">
      <article onClick={onClick}>
        <div className="event-card-pic">
          <img src={event.previewImage} />
        </div>
        <header className="event-card-header">
          <p className="event-card-date">
            {formatDate(event.startDate)}
          </p>
          <h2 className="event-card-title">
            {event.name}
          </h2>
          <p className="event-card-location">{event.Venue.city}, {event.Venue.state}</p>
        </header>
      </article>
        <p className="event-card-description">
          {event.description}. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis lectus nulla at volutpat diam ut venenatis tellus. Rhoncus dolor purus non enim praesent.
        </p>
    </div>
  )
}

export default GroupEvents;
