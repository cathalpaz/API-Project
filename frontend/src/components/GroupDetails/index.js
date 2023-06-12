import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { thunkGetGroupDetails } from "../../store/groups";
import OpenModalButton from "../OpenModalButton";
import DeleteGroup from "../DeleteGroupModal";
import './Groupdetails.css';
import GroupEvents from "./GroupEvents";
import { thunkGetEventsByGroup } from "../../store/events";

function GroupDetails() {
  const dispatch = useDispatch();
  const history = useHistory()
  const { groupId } = useParams();
  const user = useSelector((state) => state.session.user);
  const group = useSelector((state) => state.groups.singleGroup);
  const eventState = useSelector((state) => state.events.allEvents)
  const events = Object.values(eventState).sort((a, b) => {
    let dateA = new Date(a.startDate).getTime();
    let dateB = new Date(b.startDate).getTime();
    return dateA - dateB;
  });
  // console.log(events);
  // console.log(group)

  useEffect(() => {
    dispatch(thunkGetGroupDetails(groupId));
    dispatch(thunkGetEventsByGroup(groupId))
  }, [dispatch, groupId]);

  // CRUD helpers
  const joinGroup = () => {
    alert('Feature coming soon...')
  }
  const editGroup = () => {
    history.push(`/groups/${groupId}/edit`)
  }
  const createEvent = () => {
    history.push(`/groups/${groupId}/newEvent`)
  }

  let loadedPage;
  if (group && group?.id === Number(groupId)) {
    loadedPage = (
      <div className="content-container">
        <div className="upper-container">
          <NavLink to="/groups"> &lt; Groups</NavLink>
          <div className="upper-content">
            <img alt="group pic" src={group.GroupImages[0].url} />
            <div className="content-details">
              <div className="group-details">
                <h1>{group.name}</h1>
                <p>{group.city}, {group.state}</p>
                <p>{group.numMembers} members &#8226; {group.private ? "Private" : "Public"}</p>
                <p>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</p>
              </div>
              <div className="buttons">
                {user ? (
                  user.id !== group.Organizer.id ? (
                    <button onClick={joinGroup}>Join this group</button>
                  ) : (
                    <div className="organizer-buttons">
                      <button onClick={createEvent}>Create event</button>
                      <button onClick={editGroup}>Update</button>
                      <OpenModalButton modalComponent={<DeleteGroup />} buttonText={'Delete'}/>
                    </div>
                  )
                ) : null}
          </div>
              </div>
            </div>
        </div>
          <div className="gray-container">
            <h2>Organizer</h2>
            <span>{group.Organizer.firstName} {group.Organizer.lastName}</span>
            <h2>What we're about</h2>
            <p>{group.about}. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Maecenas accumsan lacus vel facilisis volutpat. Platea dictumst vestibulum rhoncus est pellentesque. Varius morbi enim nunc faucibus a pellentesque sit amet porttitor.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus pulvinar elementum integer enim neque volutpat ac tincidunt vitae.</p>
            <div className="content-events">
              <h2>Upcoming Events ({events.length})</h2>
              <div className="event-card">
                {events && events.map(event => (
                  <GroupEvents key={event.id} event={event} group={group} />

                ))}
              </div>
            </div>
          </div>
      </div>
    );
  } else {
    loadedPage =
    <div className="loading-container">
      <div className="loading"></div>
    </div>
  }

  return <>{loadedPage}</>;
}

export default GroupDetails;
