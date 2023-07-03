import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem'
import SignupFormModal from '../SignupFormModal'
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const disabled = credential.length < 4 || password.length < 6;

  const demoLogin = (e) => {
    return dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password' }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  }

  return (
    <div className="login-box">
      <i class="fa-brands fa-meetup"></i>
      <h1>Log in</h1>
      <div className="login-member-sign">
        <p>Not a member yet?</p>
        <OpenModalMenuItem itemText='Sign up' modalComponent={<SignupFormModal />} />
      </div>
      <form onSubmit={handleSubmit}>
        {errors.credential && (
          <p className="errors">{errors.credential}</p>
        )}
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className="submit" disabled={disabled} type="submit">Log in</button>
      </form>
      <div className="demo-separator">
        <p className="separator-border"> </p>
        <p className="separator-text">or</p>
        <p className="separator-border"> </p>
      </div>
      <div className="demo-login" onClick={() => demoLogin()}>
        <i class="fa-solid fa-user"></i>
        <div className="demo">Log in with Demo</div>
      </div>
    </div>
  );
}

export default LoginFormModal;
