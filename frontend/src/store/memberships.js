import { csrfFetch } from "./csrf";

// TYPES
const GET_MY_GROUPS = 'groups/member'
const GET_GROUP_MEMBERS = 'groups/members'
const REQUEST_GROUP = 'groups/request'
const LEAVE_GROUP = 'groups/leave'


// ACTIONS
const actionGetMyGroups = (data) => {
    return {
        type: GET_MY_GROUPS,
        payload: data
    }
}
const actionGetGroupMembers = (data) => {
    return {
        type: GET_GROUP_MEMBERS,
        payload: data
    }
}
const actionRequestGroup = (data) => {
    return {
        type: REQUEST_GROUP,
        payload: data
    }
}
const actionLeaveGroup = (data) => {
    return {
        type: LEAVE_GROUP,
        payload: data
    }
}


// THUNKS
export const thunkGetMyGroups = () => async(dispatch) => {
    const res = await csrfFetch(`/api/groups/current`)
    if (res.ok) {
        const data = await res.json()
        dispatch(actionGetMyGroups(data))
        return data
    } else {
        const errorData = await res.json()
        return errorData
    }
}
export const thunkGetGroupMembers = (groupId) => async(dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}/members`)
    if (res.ok) {
        const data = await res.json()
        dispatch(actionGetGroupMembers(data))
        return data
    } else {
        const errorData = await res.json()
        return errorData
    }
}
export const thunkRequestGroup = (groupId) => async(dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}/membership`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    if (res.ok) {
        const data = await res.json()
        dispatch(actionRequestGroup(data))
        return data
    } else {
        const errorData = await res.json()
        return errorData
    }
}
export const thunkLeaveGroup = (memberId, groupId) => async(dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}/membership`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberId)
    })
    if (res.ok) {
        dispatch(actionLeaveGroup(groupId))
    } else {
        const errorData = await res.json()
        return errorData
    }
}


// REDUCER
const initialState = { myGroups: {}, groupMembers: {}, groupRequests: {} }

const membershipReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_MY_GROUPS:
            const normalizedState = {}
            action.payload.Groups.forEach(group => {
                normalizedState[group.id] = group
            })
            return {...state, myGroups: normalizedState}
        case GET_GROUP_MEMBERS:
            const newState = {...state}
            newState.groupMembers[action.payload.groupId] = action.payload.Members
            return newState
        case REQUEST_GROUP:
            const newState2 = {...state}
            newState2.groupRequests[action.payload.groupId] = action.payload.Members
            return newState2
        case LEAVE_GROUP:
            const newState3 = {...state}
            delete newState3.myGroups[action.payload]
            return newState3
        default:
            return state
    }
}

export default membershipReducer
