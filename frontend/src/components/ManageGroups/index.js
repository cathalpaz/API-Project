import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetMyGroups } from "../../store/memberships";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import OpenModalButton from "../OpenModalButton";
import DeleteGroup from "../DeleteGroupModal";
import "./ManageGroups.css";

function ManageGroups() {
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
        <i class="fa-solid fa-arrow-left"></i>
        <NavLink to="/">Back to home page</NavLink>
      </div>
      <div className="list-header-links">Manage Groups</div>
      <div className="list-display">
        <h3>Your groups in .join(Up)</h3>
        <div className="list-item">
          {myGroups.map((group) => {
            return (
              <div>
                <NavLink
                  key={group.id}
                  to={`/groups/${group.id}`}
                  className="display-container"
                >
                  <div className="left-container">
                    <img alt="group-pic" src={group.previewImage}></img>
                  </div>
                  <div className="right-container">
                    <div className="right-upper-container">
                      <h2>{group.name}</h2>
                      <h4>
                        {group.city}, {group.state}
                      </h4>
                    </div>
                    <p>{group.about}</p>
                    <div className="bottom-container">
                      <p>{group.numMembers} members</p>
                      <p>•</p>
                      <p>{group.private ? "Private" : "Public"}</p>
                    </div>
                    {group.organizerId === user.id ? (
                        <div className="manage-btns">
                            <button>Update</button>
                            <OpenModalButton modalComponent={<DeleteGroup />} buttonText={'Delete'}/>
                        </div>
                    ): (
                        <div className="manage-btns">
                            <button>Unjoin</button>
                        </div>
                    )}


                  </div>
                </NavLink>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ManageGroups;
