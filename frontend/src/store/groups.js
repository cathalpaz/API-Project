// import { csrfFetch } from "./csrf";

// types
const GET_GROUPS = 'groups/allGroups';
const GET_GROUP_DETAILS = 'groups/groupDetails';


// actions
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


// thunks
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
        default:
            return state
    }
}

export default groupReducer
