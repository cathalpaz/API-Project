import { csrfFetch } from "./csrf";

// types
const CREATE_EVENT = 'events/new'
const GET_EVENTS = 'events/allEvents';
const GET_EVENT_DETAILS = 'events/eventDetails';


// actions
const actionCreateEvent = (event) => {
    return {
        type: CREATE_EVENT,
        payload: event
    }
}
const actionGetEvents = (data) => {
    return {
        type: GET_EVENTS,
        payload: data
    }
}
const actionGetEventDetails = (data) => {
    return {
        type: GET_EVENT_DETAILS,
        payload: data
    }
}


// thunks
export const thunkCreateEvent = (event, img) => async(dispatch) => {
    const res = await csrfFetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
    })
    if (res.ok) {
        const data = await res.json()
        const imgRes = await csrfFetch(`/api/events/${data.id}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: img,
                preview: true
            })
        })
        const newImg = await imgRes.json()
        data.EventImages = [newImg]
        dispatch(actionCreateEvent(data))
        return data
    } else {
        const errorData = await res.json()
        return errorData
    }
}

export const thunkGetEvents = () => async(dispatch) => {
    const res = await fetch('/api/events')
    if (res.ok) {
        const data = await res.json()
        dispatch(actionGetEvents(data))
        return data
    } else {
        const errorData = await res.json()
        return errorData
    }
}
export const thunkGetEventDetails = (eventId) => async(dispatch) => {
    const res = await fetch(`/api/events/${eventId}`)
    if (res.ok) {
        const data = await res.json()
        dispatch(actionGetEventDetails(data))
        return data
    } else {
        const errorData = await res.json()
        return errorData
    }
}


// reducer
const initialState = { allEvents: {}, singleEvent: {} }

const eventReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_EVENTS:
            const normalizedState = {}
            action.payload.Events.forEach(event => {
                normalizedState[event.id] = event
            })
            return {...state, allEvents: normalizedState}
        case GET_EVENT_DETAILS:
            return {...state, singleEvent: action.payload}
        case CREATE_EVENT:
            return {...state, allEvents: {}, singleEvent: action.payload}
        default:
            return state
    }
}

export default eventReducer
