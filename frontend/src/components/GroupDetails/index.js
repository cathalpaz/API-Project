import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { thunkGetGroupDetails } from "../../store/groups";
import OpenModalButton from "../OpenModalButton";
import DeleteGroup from "../DeleteGroupModal";
import GroupEvents from "./GroupEvents";
import { thunkGetEventsByGroup } from "../../store/events";
import { thunkGetGroupMembers, thunkGetMyGroups, thunkRequestGroup, thunkLeaveGroup } from "../../store/memberships";
import './GroupDetails.css';

function GroupDetails() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { groupId } = useParams();
  const user = useSelector((state) => state.session.user);
  const group = useSelector((state) => state.groups.singleGroup);
  const eventState = useSelector((state) => state.events.allEvents);
  const myGroups = useSelector((state => Object.values(state.memberships.myGroups)))
  const groupMembers = useSelector((state) => Object.values(state.memberships.groupMembers)[0]);
  const events = Object.values(eventState).sort((a, b) => {
    let dateA = new Date(a.startDate).getTime();
    let dateB = new Date(b.startDate).getTime();
    return dateA - dateB;
  });
  const upcomingEvents = []
  const pastEvents = []
  for (let event of events) {
    if (new Date(event.startDate) < new Date()) {
      pastEvents.push(event)
    } else {
      upcomingEvents.push(event)
    }
  }

  let status = null
  for (let myGroup of myGroups) {
    if (myGroup.id === group.id) {
      status = 'joined'
    }
  }
  if (groupMembers) {
    for (let memberships of groupMembers) {
      if (memberships.id === user?.id && memberships.Memberships[0].status === 'pending') {
        status = 'pending'
      }
    }
  }
  let buttonText = null
  if (status === 'joined') {
    buttonText = 'Leave this group'
  } else if (status === 'pending') {
    buttonText = 'Request pending'
  } else {
    buttonText = 'Join this group'
  }

  const order = {
    'organizer': 0,
    'co-host': 1,
    'member': 2,
    'pending': 3
}

  const sortMembers = (a, b) => {
    if (a === b) return 0
    return a < b ? -1 : 1
  }


  useEffect(() => {
    dispatch(thunkGetGroupDetails(groupId));
    dispatch(thunkGetEventsByGroup(groupId))
    dispatch(thunkGetGroupMembers(groupId))
    if (user) dispatch(thunkGetMyGroups())
  }, [dispatch, groupId]);

  // CRUD helpers

  const memberId = {
    memberId: parseInt(user?.id)
  }


  const joinGroup = async() => {
    if (!status) {
      const data = await dispatch(thunkRequestGroup(groupId))
      status = 'joined'
      window.location.reload()
      return data
    } else {
      await dispatch(thunkLeaveGroup(memberId, groupId))
      status = null
      window.location.reload()
    }
  }
  const editGroup = () => {
    history.push(`/groups/${groupId}/edit`)
  }
  const createEvent = () => {
    history.push(`/groups/${groupId}/newEvent`)
  }

  let loadedPage;
  if (group && group?.id === Number(groupId)) {
    // console.log(group);
    loadedPage = (
      <div className="content-container">
        <div className="upper-container">
          <div className="return-to">
          <i className="fa-solid fa-arrow-left"></i>
            <NavLink to="/groups">Return to All Groups</NavLink>
          </div>
          <div className="upper-content">
            <div className="group-image-container">
              <img alt="group pic" src={group.GroupImages[0].url} />
            </div>
            <div className="content-details">
              <div className="group-details">
                <h1>{group.name}</h1>
                <div className="group-details-list">
                  <div className="group-detail">
                    <i className="fa-solid fa-location-dot"></i>
                    <p>{group.city}, {group.state}</p>
                  </div>
                  <div className="group-detail">
                    <i className="fa-solid fa-users"></i>
                    <p>{group.numMembers} members &#8226; {group.private ? "Private" : "Public"}</p>
                  </div>
                  <div className="group-detail">
                    <i className="fa-solid fa-crown"></i>
                    <p>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</p>
                  </div>
                </div>
              </div>
              <div className="buttons">
                {user ? (
                  user.id !== group.Organizer.id ? (
                    <button onClick={joinGroup}>{buttonText}</button>
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
            <div className="gray-content">
              <h2>Organizer</h2>
              <span>{group.Organizer.firstName} {group.Organizer.lastName}</span>
              <h2>What we're about</h2>
              <p>{group.about}</p>
              {/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus pulvinar elementum integer enim neque volutpat ac tincidunt vitae.</p> */}
              <div className="content-events">
                <h2>Upcoming Events ({upcomingEvents.length})</h2>
                <div className="event-card">
                  {upcomingEvents.length ? upcomingEvents.map(event => (
                    <GroupEvents key={event.id} event={event} group={group} />
                  )) : (
                    <div>No upcoming events.</div>
                  )}
                </div>
                <h2>Past Events ({pastEvents.length})</h2>
                <div className="event-card">
                  {pastEvents.length ? pastEvents.map(event => (
                    <GroupEvents key={event.id} event={event} group={group} />
                  )) : (
                    <div>No past events.</div>
                  )}
                </div>
              </div>
              <div className="group-members">
                <h2>Members ({groupMembers?.length})</h2>
                <div className="members-list">
                  {groupMembers?.sort((a, b) => {
                    let idxRes = sortMembers(order[a.Memberships[0].status], order[b.Memberships[0].status])
                    if (idxRes === 0) return sortMembers(a.Memberships[0].status, b.Memberships[0].status)
                    else return idxRes
                    }).map(member => (
                      <div className="member-card">
                        <i className="fa-solid fa-circle-user"></i>
                        <div className="member-details">
                          <span className="member-name">{member.firstName} {member.lastName}</span>
                          <span className="member-membership">{member.Memberships[0].status}</span>
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
    loadedPage =
    <div className="loading-container">
      <div className="loading"></div>
    </div>
  }
  return <>{loadedPage}</>;
}

export default GroupDetails;
