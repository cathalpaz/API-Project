import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
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

  return (
    <div>GroupDetails</div>
  )
}

export default GroupDetails
