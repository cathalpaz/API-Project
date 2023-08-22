import { csrfFetch } from './csrf';

const GET_ATTENDEES = 'event/GET_ATTENDEES'
const POST_ATTENDANCE = 'event/POST_ATTENDANCE'
const DELETE_ATTENDANCE = 'event/DELETE_ATTENDANCE'


const actionGetAttendees = (data) => {
    return {
        type: GET_ATTENDEES,
        payload: data
    }
}
const actionPostAttendance = (data) => {
    return {
        type: POST_ATTENDANCE,
        payload: data
    }
}
const actionDeleteAttendance = (data) => {
    return {
        type: DELETE_ATTENDANCE,
        payload: data
    }
}


export const thunkGetAttendees = (eventId) => async(dispatch) => {
    const res = await csrfFetch(`/api/events/${eventId}/attendees`)
    if (res.ok) {
        const data = await res.json()
        dispatch(actionGetAttendees(data))
        return data
    } else {
        const errorData = await res.json()
        return errorData
    }
}
export const thunkPostAttendance = (eventId) => async(dispatch) => {
    const res = await csrfFetch(`/api/events/${eventId}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    if (res.ok) {
        const data = await res.json()
        dispatch(actionPostAttendance(data))
        return data
    } else {
        const errorData = await res.json()
        return errorData
    }
}
export const thunkDeleteAttendance = (userId, eventId) => async(dispatch) => {
    const res = await csrfFetch(`/api/events/${eventId}/attendance`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userId)
    })
    if (res.ok) {
        dispatch(actionDeleteAttendance(eventId))
    } else {
        const errorData = await res.json()
        return errorData
    }
}






const initialState = { myEvents: {}, eventAttendees: {} }

const attendanceReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_ATTENDEES:
            newState = { ...state}
            newState.eventAttendees = action.payload
            return newState
        case POST_ATTENDANCE:
            newState = { ...state}
            newState.myEvents[action.payload.id] = action.payload
            return newState
        case DELETE_ATTENDANCE:
            newState = { ...state}
            delete newState.myEvents[action.payload]
            return newState
        default:
            return state;
    }
}

export default attendanceReducer;
