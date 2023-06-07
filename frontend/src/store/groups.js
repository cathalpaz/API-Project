import { csrfFetch } from "./csrf";

// types
const CREATE_GROUP = 'groups/new';
const GET_GROUPS = 'groups/allGroups';
const GET_GROUP_DETAILS = 'groups/groupDetails';
const UPDATE_GROUP = 'groups/edit';
const DELETE_GROUP = 'groups/remove';


// actions
export const actionCreateGroup = (group) => {
    return {
        type: CREATE_GROUP,
        payload: group
    }
}
export const actionGetGroups = (data) => {
    return {
        type: GET_GROUPS,
        payload: data
    }
}
export const actionGetGroupDetails = (data) => {
    return {
        type: GET_GROUP_DETAILS,
        payload: data
    }
}
export const actionUpdateGroup = (group) => {
    return {
        type: UPDATE_GROUP,
        group
    }
}
export const actionDeleteGroup = (groupId) => {
    return {
        type: DELETE_GROUP,
        groupId
    }
}


// thunks
export const thunkCreateGroup = (group, img) => async(dispatch) => {
    const res = await csrfFetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(group)
    })
    if (res.ok) {
        const data = await res.json()
        const imgRes = await csrfFetch(`/api/groups/${data.id}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                url: img,
                preview: true
            })
        })
        data.previewImage = img
        dispatch(actionCreateGroup(data))
        return data
    } else {
        const errorData = await res.json()
        return errorData
    }
}
export const thunkGetGroups = () => async(dispatch) => {
    const res = await fetch('/api/groups')
    if (res.ok) {
        const data = await res.json()
        dispatch(actionGetGroups(data))
        return data
    } else {
        const errorData = await res.json()
        return errorData
    }
}
export const thunkGetGroupDetails = (groupId) => async(dispatch) => {
    const res = await fetch(`/api/groups/${groupId}`)
    if (res.ok) {
        const data = await res.json()
        dispatch(actionGetGroupDetails(data))
        return data
    } else {
        const errorData = await res.json()
        return errorData
    }
}
export const thunkUpdateGroup = (group, groupId) => async(dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(group)
    })
    if (res.ok) {
        const data = await res.json()
        dispatch(actionUpdateGroup(group))
        return data
    } else {
        const errorData = await res.json()
        return errorData
    }
}
export const thunkDeleteGroup = (groupId) => async(dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'DELETE'
    })
    if (res.ok) {
        dispatch(actionDeleteGroup(groupId))
    } else {
        const errorData = await res.json()
        return errorData
    }
}


// reducer
const initialState = { allGroups: {}, singleGroup: {} }

const groupReducer = (state = initialState, action) => {
    // const newState = {...state, allGroups: {...state.allGroups}, singleGroup: {...state.singleGroup}}
    switch(action.type) {
        case GET_GROUPS:
            const normalizedState = {}
            action.payload.Groups.forEach(group => {
                normalizedState[group.id] = group
            })
            return {...state, allGroups: normalizedState}
        case GET_GROUP_DETAILS:
            return {...state, singleGroup: action.payload}
        case CREATE_GROUP:
            return {...state, singleGroup: action.payload}
        case UPDATE_GROUP:
            const updatedState = {...state.allGroups}
            updatedState[action.groupId] = action.group
            return {...state, allGroups: updatedState, singleGroup: action.group}
        case DELETE_GROUP:
            const newState = {...state.allGroups}
            delete newState[action.groupId]
            return {...state, allGroups: newState, singleGroup: {}}
        default:
            return state
    }
}

export default groupReducer
