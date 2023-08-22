import { csrfFetch } from "./csrf";

// TYPES
const GET_MY_GROUPS = 'groups/member'
const GET_GROUP_MEMBERS = 'groups/members'


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


// REDUCER
const initialState = { myGroups: {}, groupMembers: {} }

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
        default:
            return state
    }
}

export default membershipReducer
