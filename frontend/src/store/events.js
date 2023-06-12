import { csrfFetch } from "./csrf";

// types
const CREATE_EVENT = 'events/new'
const GET_EVENTS = 'events/allEvents';
const GET_EVENT_DETAILS = 'events/eventDetails';
const DELETE_EVENT = 'events/delete'


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
const actionDeleteEvent = (eventId) => {
    return {
        type: DELETE_EVENT,
        eventId
    }
}


// thunks
export const thunkCreateEvent = (event, groupId, img) => async(dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}/events`, {
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
        dispatch(actionCreateEvent([data]))
        console.log('hi');
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
export const thunkGetEventsByGroup = (groupId) => async(dispatch) => {
    const res = await fetch(`/api/groups/${groupId}/events`)
    if (res.ok) {
        const data = await res.json()
        dispatch(actionGetEvents(data))
        return data
    }
}
export const thunkDeleteEvent = (eventId) => async(dispatch) => {
    const res = await csrfFetch(`/api/events/${eventId}`, {
        method: 'DELETE'
    })
    if (res.ok) {
        dispatch(actionDeleteEvent(eventId))
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
            return {...state, allEvents: {...state.allEvents}, [action.payload.id]: action.payload}
        case DELETE_EVENT:
            const newState = {...state.allEvents}
            delete newState[action.eventId]
            return {...state, allEvents: newState, singleEvent: {}}
        default:
            return state
    }
}

export default eventReducer
