import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { thunkGetGroups } from '../../store/groups';
import GroupDisplay from './GroupDisplay';
import './AllGroups.css'
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';

function AllGroups() {
  const dispatch = useDispatch()
  const groups = useSelector(state => Object.values(state.groups.allGroups))

  useEffect(() => {
    dispatch(thunkGetGroups())
  }, [dispatch])

  return (
    <div className='groups-container'>
        <div className='header-links'>
            <NavLink to='/events'>Events</NavLink>
            <NavLink to='/groups'>Groups</NavLink>
        </div>
        <div className='groups-display'>
            <h3>Groups in Meetup</h3>
            <div className='groups-list'>
                {groups.map(group => {
                    return <GroupDisplay key={group.id} group={group} />
                })}
            </div>
        </div>
    </div>
  )
}

export default AllGroups;
