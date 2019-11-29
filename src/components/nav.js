import React, {useContext} from 'react';
import { Link } from "react-router-dom";

import styled from 'styled-components';
import Firebase, { FirebaseContext } from './firebase';

const NavContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  background: ${props => props.theme.dark};
  border-right: 1px solid ${props => props.theme.borderLight};

  ul {
    display: flex;
    flex-direction: column;
    list-style-type: none;
    width: 100%;
  }
`

const NavTitle = styled.p`
  text-align: center;
  width: 100%;
  color: ${props => props.theme.light};
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 25px 0;
  border-bottom: 1px solid ${props => props.theme.borderLight};
`

export const SignOutButton = styled.button`
  background: transparent;
  outline: none;
  border: none;
  width: 100%;
  padding: 25px;
  font-size: 14px;
  color: ${p => p.theme.light};
  cursor: pointer;
  transition: all .2s ease;

  &:hover {
    background: ${p => p.theme.borderLight}
  }
`

export const NavButton = styled.button`
  background: transparent;
  border: none;
  outline: none;
  display: inline-block;
  width: 100%;
  
  a {
    background: transparent;
    border-bottom: 1px solid ${p => p.theme.borderLight};
    transition: all .2s ease;  
    color: ${p => p.theme.light};
    padding: 25px 25px;
    font-size: 15px;
    display: block;
    width: 100%;
    text-align: left;
    text-decoration: none;
  }
  &:hover {
    a {
      background: rgba(240, 240, 240, 0.2);
    }
  }
`

const NavList = styled.ul`
  flex: 1;
`

const Nav = () => {
  const firebase = useContext(FirebaseContext)
  return (
    <NavContainer className='nav'>
      <NavTitle>Podcaster Admin</NavTitle>
      <NavList>
        <li>
          <NavButton>
            <Link to="/">Home</Link>
          </NavButton>
        </li>
        <li>
          <NavButton>
            <Link to="/podcasts">Podcasts</Link>
          </NavButton>
        </li>
        <li>
          <NavButton>
            <Link to="/episodes">Episodes</Link>
          </NavButton>
        </li>
        <li>
          <NavButton>
            <Link to="/hosts">Hosts</Link>
          </NavButton>
        </li>
        <li>
          <NavButton>
            <Link to="/guests">Guests</Link>
          </NavButton>
        </li>
      </NavList>
      <SignOutButton
        onClick={() => {
          firebase.doSignOut()
        }}>
        Sign Out
      </SignOutButton>
    </NavContainer>
  )
}

export default Nav;
