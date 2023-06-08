

// types
const GET_EVENTS = 'events/allEvents';
const GET_EVENT_DETAILS = 'events/eventDetails';


// actions
const actionGetEvents = (data) => {
    return {
        type: GET_EVENTS,
        payload: data
    }
}


// thunks
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
        default:
            return state
    }
}

export default eventReducer
