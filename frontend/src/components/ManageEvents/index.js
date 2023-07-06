import { NavLink } from "react-router-dom"

function ManageEvents() {
  return (
    <div className="list-manage-container">
      <div className="return-to">
        <i class="fa-solid fa-arrow-left"></i>
        <NavLink to="/">Back to home page</NavLink>
      </div>
      <div className="no-groups">
          <img src="https://secure.meetupstatic.com/next/images/home/EmptyGroup.svg?w=256"/>
          <h2>No events attending</h2>
          <span>All events you attend and organize will be shown here.</span>
        </div>
    </div>
  )
}

export default ManageEvents
