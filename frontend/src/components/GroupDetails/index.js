import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { thunkGetGroupDetails } from '../../store/groups'

function GroupDetails() {
  const user = useSelector(state => state.session.user)
  const dispatch = useDispatch()

  const { groupId } = useParams()
  const group = useSelector(state => state.groups.singleGroup)
  console.log(group, groupId);

  useEffect(() => {
      dispatch(thunkGetGroupDetails(groupId))
    }, [dispatch, groupId])

  // organizer = group.Organizer

  // UD features:


  return (
    <div className='content-container'>
      <div className='upper-container'>
        <NavLink to='/groups'> &lt; Groups</NavLink>
        <img alt='group pic' src={group.GroupImages} />
        <h1>{group.name}</h1>
        <h4>{group.city}, {group.state}</h4>
        <p>{group.numMembers} members</p>
        <p>{group.private ? 'Private' : 'Public'}</p>
        {/* <p>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</p> */}
        {/* {user ? (
          user.id !== group.Organizer.id ? ( <button onClick={() => alert('Feature coming soon...')}>Join this group</button> )
          : ( <div className='organizer-buttons'><button>Create event</button><button>Update</button><button>Delete</button></div> )

        ) : null } */}
      </div>
      <div className='lower-container'>
        <h2>Organizer</h2>
        {/* <h4>{group.Organizer.firstName} {group.Organizer.lastName}</h4> */}
        <h2>What we're about</h2>
        <p>{group.about}</p>
      </div>

    </div>
  )
}

export default GroupDetails
