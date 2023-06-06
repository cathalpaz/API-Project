import React from 'react'
import { NavLink } from 'react-router-dom'
import './GroupDisplay.css'

function GroupDisplay({ group }) {
//   console.log(group);
  return (
    <div>
        <NavLink key={group.id} to={`/groups/${group.id}`} className='display-container'>
            <div className='left-container'>
                <img alt='group-pic' src={group.previewImage}></img>
            </div>
            <div className='right-container'>
                <h2>{group.name}</h2>
                <h4>{group.city}, {group.state}</h4>
                <p>{group.about}</p>
                <div className='bottom-container'>
                    <p>{group.numMembers} members</p>
                    <p>{group.private ? 'Private' : 'Public'}</p>
                </div>
            </div>
        </NavLink>
    </div>
  )
}

export default GroupDisplay
