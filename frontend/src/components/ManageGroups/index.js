import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetMyGroups } from "../../store/memberships";
import { NavLink, useHistory } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import DeleteGroup from "../DeleteGroupModal";
import "./ManageGroups.css";

function ManageGroups() {
  const history = useHistory()
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const myGroups = useSelector((state) =>
    Object.values(state.memberships.myGroups)
  );
  console.log(myGroups);

  useEffect(() => {
    dispatch(thunkGetMyGroups());
  }, [dispatch]);



  return (
    <div className="list-manage-container">
      <div className="return-to">
        <i className="fa-solid fa-arrow-left"></i>
        <NavLink to="/">Back to home page</NavLink>
      </div>
      {myGroups.length > 0 ? (
        <div className="list-display">
          <div className="list-header-links">Manage Groups</div>
          <h3>Your groups in .join(Up)</h3>
          <div className="list-item">
            {myGroups.map((group) => {
              return (
                <div>
                  <div
                    // key={group.id}
                    // to={`/groups/${group.id}`}
                    className="manage-display-container"
                  >
                    <div className="left-container">
                      <img alt="group-pic" src={group.previewImage}></img>
                    </div>
                    <div className="right-container">
                      <div className="manage-right-upper-container">
                        <NavLink key={group.id} to={`/groups/${group.id}`}>{group.name}</NavLink>
                        <h4>
                          {group.city}, {group.state}
                        </h4>
                      </div>
                      <p>{group.about}</p>
                      <div className="manage-bottom-container">
                        <div className="bottom-container-words">
                          <p>{group.numMembers} members</p>
                          <p>•</p>
                          <p>{group.private ? "Private" : "Public"}</p>

                        </div>
                      {group.organizerId === user.id ? (
                          <div className="manage-btns">
                              <button onClick={(() => history.push(`/groups/${group.id}/edit`)) } >Update</button>
                              <OpenModalButton modalComponent={<DeleteGroup />} buttonText={'Delete'}/>
                          </div>
                      ): (
                          <div className="manage-btns">
                              <button onClick={(() => alert('Feature coming soon...'))}>Leave</button>
                          </div>
                      )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      ) : (
        <div className="no-groups">
          <img src="https://secure.meetupstatic.com/next/images/home/EmptyGroup.svg?w=256"/>
          <h2>No groups joined</h2>
          <span>All groups you can join and organize will be shown here.</span>
        </div>
      )}
    </div>
  );
}

export default ManageGroups;
