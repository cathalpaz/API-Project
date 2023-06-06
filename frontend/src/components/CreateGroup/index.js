import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./CreateGroup.css"
import { thunkCreateGroup } from "../../store/groups";

function CreateGroup() {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.session.user);

  //   const [city, setCity] = useState('');
  //   const [state, setState] = useState('');
  const [cityState, setCityState] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState(undefined);
  const [privacy, setPrivacy] = useState(undefined);
  const [url, setUrl] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const handleSubmit = async(e) => {
    e.preventDefault();
    const errors = {}
    if (!cityState || !cityState.includes(',')) errors.cityState = 'Location is required';
    if (!name) errors.name = 'Name is required';
    if (about.length < 50) errors.about = 'Description must be at least 50 characters long';
    if (type === undefined) errors.type = 'Group Type is required';
    if (privacy === undefined) errors.privacy = 'Visibility type is required';
    if (!url.endsWith('.png') && !url.endsWith('.jpg') && !url.endsWith('.jpeg')) errors.url = 'Image URL must end in .png, .jpg, or .jpeg'

    if (Object.values(errors).length) {
        setValidationErrors(errors)
    } else {
        const city = cityState.split(',')[0];
        const state = cityState.split(',')[1];
        const payload = {name, about, type, private: privacy, city, state}
        const newGroup = await dispatch(thunkCreateGroup(payload, url))
        history.push(`/groups/${newGroup.id}`)
    }
  };

  return (
    <div class="form-container">
      <div class="form-header">
        <span class="form-title">BECOME AN ORGANIZER</span>
        <h2>
          We'll walk you through a few steps to build your local community
        </h2>
      </div>
      <hr />
      <div class="form-step">
        <h3>First, set your group's location</h3>
        <span>
          Meetup groups meet locally, in person and online. We'll connect you
          with people in your area, and more can join you online.
        </span>
        <form class="form-step-form" onSubmit={handleSubmit}>
          <div class="form-group">
            <input
              type="text"
              class="form-input"
              placeholder="City, STATE"
              value={cityState}
              onChange={(e) => setCityState(e.target.value)}
            />
            {validationErrors.cityState && (
              <span class="errors">{validationErrors.cityState}</span>
            )}
          </div>
          <div class="form-group">
            <h3>What will your group's name be?</h3>
            <span>
              Choose a name that will give people a clear idea of what the group
              is about.
            </span>
            <span>
              Feel free to get creative! You can edit this later if you change
              your mind.
            </span>
            <input
              type="text"
              class="form-input"
              placeholder="What is your group name?"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {validationErrors.name && (
              <span class="errors">{validationErrors.name}</span>
            )}
          </div>
          <div class="form-group">
            <h3>Now describe what your group will be about</h3>
            <span>
              People will see this when we promote your group, but you'll be
              able to add to it later, too.
            </span>
            <span>1. What's the purpose of the group?</span>
            <span>2. Who should join?</span>
            <span>3. What will you do at your events?</span>
            <textarea
              class="form-textarea"
              value={about}
              placeholder="Please write at least 50 characters"
              onChange={(e) => setAbout(e.target.value)}
            ></textarea>
            {validationErrors.about && (
              <span class="errors">{validationErrors.about}</span>
            )}
          </div>
          <div class="form-group">
            <h3>Final steps...</h3>
            <span>Is this an in person or online group?</span>
            <select
              class="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value={undefined}>(select one)</option>
              <option value="Online">Online</option>
              <option value="In person">In person</option>
            </select>
            {validationErrors.type && (
              <span class="errors">{validationErrors.type}</span>
            )}
            <span>Is this group private or public?</span>
            <select
              class="form-select"
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
            >
              <option value={undefined}>(select one)</option>
              <option value={true}>Private</option>
              <option value={false}>Public</option>
            </select>
            {validationErrors.privacy && (
              <span class="errors">{validationErrors.privacy}</span>
            )}
            <span>Please add an image URL for your group below.</span>
            <input
              type="url"
              class="form-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {validationErrors.url && (
              <span class="errors">{validationErrors.url}</span>
            )}
          </div>
          <hr />
          <button type="submit" class="form-submit-btn">
            Create group
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateGroup;
