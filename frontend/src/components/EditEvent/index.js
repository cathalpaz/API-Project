import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { thunkGetEventDetails, thunkUpdateEvent } from "../../store/events";

function EditEvent() {
  const dispatch = useDispatch();
  const history = useHistory()
  const { eventId } = useParams();

  const event = useSelector(state => state.events.singleEvent);
  const user = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(thunkGetEventDetails(eventId));
  }, [dispatch]);

  if (!user) {
    history.push("/");
  }
  // console.log(event);


  const [name, setName] = useState(event.name ?? "");
  const [type, setType] = useState(event.type ?? "");
  const [price, setPrice] = useState(event.price ?? "");
  const [startDate, setStartDate] = useState(event.startDate ?? "");
  const [endDate, setEndDate] = useState(event.endDate ?? "");
  const [url, setUrl] = useState(event.id ? event.EventImages[0].url : "");
  const [description, setDescription] = useState(event.description ?? "");

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (event) {
      setName(event.name);
      setType(event.type);
      setPrice(event.price);
      setStartDate(event.startDate);
      setEndDate(event.endDate);
      setUrl(event.EventImages[0].url);
      setDescription(event.description);

    }

  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault()
    const errors = {}
    if (name.length < 5) errors.name = 'Name must be longer than 5 characters'
    if (type === undefined) errors.type = 'Event Type is required'
    if (price < 0) errors.price = 'Price is required'
    if (!startDate) errors.startDate = 'Event start is required'
    if (!endDate) errors.endDate = 'Event end is required'
    if (Date.parse(startDate) < Date.now()) errors.startDate = 'Start date must be in the future'
    if (Date.parse(startDate) > Date.parse(endDate)) errors.startDate = 'Start date must be before end date'
    if (!url.endsWith('.png') && !url.endsWith('.jpg') && !url.endsWith('.jpeg')) errors.url = 'Image URL must end in .png, .jpg, or .jpeg';
    if (description.length < 30) errors.description = 'Description must be at least 30 characters long'

    if (Object.values(errors).length) {
      setValidationErrors(errors)
    } else {
        const payload = {name, type, price, startDate, endDate, description}

        dispatch(thunkUpdateEvent(payload, eventId))
        history.push(`/events/${eventId}`)
    }
  }
  return (
    <div className="form-container">
      <div className="form-header">
        <span className="form-title">Update {event?.name}</span>
      </div>
      <hr />
      <div className="form-step">
        <form className="form-step-form">
          <div className="form-group">
            <h3>What is the name of your event?</h3>
            <input
              type="text"
              className="form-input"
              placeholder="Event Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {validationErrors.name && (
              <span className="errors">{validationErrors.name}</span>
            )}
          </div>
          <div className="form-group">
            <h3>Is this an in person or online event?</h3>
            <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value={undefined}>(select one)</option>
              <option value="Online">Online</option>
              <option value="In person">In person</option>
            </select>
            {validationErrors.type && (
              <span className="errors">{validationErrors.type}</span>
            )}
            <h3>What is the price for your event?</h3>
            <input
                type='number'
                className="form-input"
                min={0}
                max={999}
                step={0.01}
                placeholder='0'
                value={Number(price)}
                onChange={(e) => setPrice(e.target.value)}
            />
            {validationErrors.price && (
              <span className="errors">{validationErrors.price}</span>
            )}
          </div>
          <div className="form-group">
            <h3>When does your event start?</h3>
            <input
                type='datetime-local'
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
            {validationErrors.startDate && (
              <span className="errors">{validationErrors.startDate}</span>
            )}
            <h3>When does your event end?</h3>
            <input
                type='datetime-local'
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />
            {validationErrors.endDate && (
              <span className="errors">{validationErrors.endDate}</span>
            )}
            </div>
          {/* <div className="form-group">
            <h3>Please add an image URL for your group below.</h3>
            <input
              type="url"
              className="form-input"
              placeholder='Image URL'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {validationErrors.url && (
              <span className="errors">{validationErrors.url}</span>
            )}
          </div> */}
          <div className='form-group'>
                <h3>Please describe your event:</h3>
                <textarea
                className="form-textarea"
                value={description}
                placeholder="Please include at least 30 characters"
                onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                {validationErrors.description && (
                <span className="errors">{validationErrors.description}</span>
                )}
            </div>
          <hr />
          <button type="submit" className="form-submit-btn" onClick={handleSubmit}>
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditEvent;
