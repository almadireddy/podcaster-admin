import React, { useContext } from 'react';
import styled from 'styled-components';
import { FirebaseContext } from './firebase';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Nav from '../components/nav';

const LayoutHeader = styled.div`  
  margin-top: 150px;
  margin-bottom: 50px;
  color: ${p => p.theme.light};
  font-size: 35px;
`

const Layout = (props) => {
  const firebase = useContext(FirebaseContext)
  if (!firebase.isSignedIn()) {
    return (
      <Redirect to="/signin"></Redirect>
    )
  }
  return (
    <>
      <Nav></Nav>
      <div className="content-container">
        <div className="layout">
          <LayoutHeader>
            <h1>{props.title}</h1>
          </LayoutHeader>
          <div className='layout-content'>
            {props.children}
          </div>
        </div>
      </div>
    </>
  )
}

export default Layout;
