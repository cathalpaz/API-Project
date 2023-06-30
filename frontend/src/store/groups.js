import { csrfFetch } from "./csrf";

// types
const CREATE_GROUP = 'groups/new';
const GET_GROUPS = 'groups/allGroups';
const GET_GROUP_DETAILS = 'groups/groupDetails';
const UPDATE_GROUP = 'groups/edit';
const DELETE_GROUP = 'groups/remove';


// actions
const actionCreateGroup = (group) => {
    return {
        type: CREATE_GROUP,
        payload: group
    }
}
const actionGetGroups = (data) => {
    return {
        type: GET_GROUPS,
        payload: data
    }
}
const actionGetGroupDetails = (data) => {
    return {
        type: GET_GROUP_DETAILS,
        payload: data
    }
}
const actionUpdateGroup = (group) => {
    return {
        type: UPDATE_GROUP,
        group
    }
}
const actionDeleteGroup = (groupId) => {
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
        const newImg = await imgRes.json()
        data.GroupImages = [newImg]
        dispatch(actionCreateGroup([data]))
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

const normalizeState = (data) => {
    const normalized = {};
    data.forEach((obj) => {
      normalized[obj.id] = obj;
    });
    return normalized;
};

// reducer
const initialState = { allGroups: {}, singleGroup: {} }

const groupReducer = (state = initialState, action) => {
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
            const newGroup = normalizeState(action.payload)
            return {...state, allGroups: {...state.allGroups, ...newGroup}}
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
