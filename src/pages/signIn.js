import React, {useContext, useState} from 'react';
import { FirebaseContext } from "../components/firebase";
import { Formik } from 'formik';
import FormGroup from '../components/formGroup';
import OutlineButton from '../components/outlineButton';
import styled from 'styled-components'
import { Redirect } from "react-router-dom";

const AccountFormContainer = styled.div`
  width: 400px;
`

const HiddenButton = styled.button`
  background: transparent;
  border: 2px solid ${p => p.theme.borderLight};
  outline: none;
  padding: 10px;
  font-size: 15px;
  color: ${p => p.theme.light};
  transition: all .2s ease;
  cursor: pointer;

  &:hover {
    background: ${p => p.theme.borderLight}
  }
`

const Title = styled.h1`
  font-size: 45px;
  margin-bottom: 50px;
`

const Centered = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const ForgotPasswordForm = () => {
  const firebase = useContext(FirebaseContext);
  const [showSuccess, setShowSuccess] = useState(false)

  return (
    <Formik
      className="forgotForm"
      initialValues={{
        email: ""
      }}
      onSubmit={ async (values, actions) => {
        await firebase.doPasswordReset(values.email)
        setShowSuccess(true)
      }}>
      {({handleChange, values, handleSubmit}) => (
        <form onSubmit={handleSubmit}>
          <FormGroup
            label="Your email"
            type="email"
            name="email"
            onChange={handleChange}></FormGroup>
          
          <OutlineButton
            onClick={handleSubmit}
            type="submit">Reset password</OutlineButton>

          {showSuccess && (
            <h3>Check your inbox to reset your password!</h3>
          )}
        </form>
      )}
    </Formik>
  )
}

const SignInForm = (props) => {
  const firebase = useContext(FirebaseContext);

  return (
    <Formik
      className="signInForm"
      initialValues={{
        email: "",
        password: ""
      }}
      onSubmit={ async (values, actions) => {
        await firebase.doSignInWithEmailAndPassword(values.email, values.password)
        props.history.push("/")
      }}>
      {({handleChange, values, handleSubmit}) => (
        <form onSubmit={handleSubmit}>
          <FormGroup
            label="Your email"
            type="email"
            name="email"
            onChange={handleChange}></FormGroup>
          
          <FormGroup
            label="Your password"
            type="password"
            name="password"
            onChange={handleChange}></FormGroup>
            
          <OutlineButton
            onClick={handleSubmit}
            type="submit">Sign In</OutlineButton>
        </form>
      )}
    </Formik>
  )
}

export default function SignIn(props) {
  const firebase = useContext(FirebaseContext);
  const [forgotState, setForgotState] = useState(false)

  if (firebase.isSignedIn()) {
    let {state} = props.location;
    if (state) {
      return (
        <Redirect to={state.referrer}></Redirect>
      )
    } else {
      return (
        <Redirect to="/"></Redirect>
      )
    }
  }

  return (
    <Centered>
      <AccountFormContainer>
        {forgotState ? 
          <>
            <Title>Forgot Password</Title>
            <ForgotPasswordForm history={props.history}></ForgotPasswordForm>
            <HiddenButton
              onClick={() => {
                setForgotState(false)
              }}>Cancel</HiddenButton>
          </> 
        : 
          <>
            <Title>Sign In</Title>
            <SignInForm history={props.history}></SignInForm>
            <HiddenButton
              onClick={() => {
                setForgotState(true)
              }}>Forgot Password?</HiddenButton>
          </> 
        }
      </AccountFormContainer>
    </Centered>
  )
}