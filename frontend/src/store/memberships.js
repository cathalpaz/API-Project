import { csrfFetch } from "./csrf";

// TYPES
const GET_MY_GROUPS = 'groups/member'


// ACTIONS
const actionGetMyGroups = (data) => {
    return {
        type: GET_MY_GROUPS,
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


// REDUCER
const initialState = { myGroups: {} }

const membershipReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_MY_GROUPS:
            const normalizedState = {}
            action.payload.Groups.forEach(group => {
                normalizedState[group.id] = group
            })
            return {...state, myGroups: normalizedState}
        default:
            return state
    }
}

export default membershipReducer
