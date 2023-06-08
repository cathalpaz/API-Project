import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal.js";
import { useHistory } from "react-router-dom";
import { thunkDeleteGroup } from "../../store/groups";
import './DeleteGroup.css'

function DeleteGroup() {
    const dispatch = useDispatch();
  const history = useHistory();
  const group = useSelector(state => state.groups.singleGroup);
  const { closeModal } = useModal();

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(thunkDeleteGroup(group.id));
    closeModal();
    history.push("/groups");
  };

  return (
    <div class="delete-modal">
        <h1 class="delete-modal-title">Confirm Delete</h1>
        <span class="delete-modal-message">Are you sure you want to remove this group?</span>
        <div class="delete-modal-buttons">
            <button class="delete-modal-button" onClick={handleDelete}>Yes (Delete Group)</button>
            <button class="delete-modal-button" onClick={closeModal}>No (Keep Group)</button>
        </div>
    </div>
  );
}

export default DeleteGroup;
