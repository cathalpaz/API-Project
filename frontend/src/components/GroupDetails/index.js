import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { thunkGetGroupDetails } from "../../store/groups";
import OpenModalButton from "../OpenModalButton";
import DeleteGroup from "../DeleteGroupModal";

function GroupDetails() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const group = useSelector((state) => state.groups.singleGroup);
  const { groupId } = useParams();
  const history = useHistory()
  // console.log(group, groupId);

  useEffect(() => {
    dispatch(thunkGetGroupDetails(groupId));
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
          <img alt="group pic" src={group.GroupImages} />
          <h1>{group.name}</h1>
          <h4>{group.city}, {group.state}</h4>
          <p>{group.numMembers} members</p>
          <p>{group.private ? "Private" : "Public"}</p>
          <p> Organized by {group.Organizer.firstName} {group.Organizer.lastName}</p>
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
        <div className="lower-container">
          <h2>Organizer</h2>
          <h4>{group.Organizer.firstName} {group.Organizer.lastName}</h4>
          <h2>What we're about</h2>
          <p>{group.about}</p>
        </div>
      </div>
    );
  } else {
    loadedPage = <div>loading</div>;
  }

  return <>{loadedPage}</>;
}

export default GroupDetails;
