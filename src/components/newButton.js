import React from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";

const NewPodcastButton = styled.button`
  height: 40px;
  width: 40px;
  font-size: 22px;
  background: transparent;
  outline: none;
  border: none;
  margin: 0 auto;
  a {
    padding: 0%;
    margin: 0 auto;
    line-height: 39px;
    width: 45px;
    height: 45px;
    display: block;
    border-bottom: none;
    border: solid 2px ${p => p.theme.light};
    color: ${p => p.theme.light};
    &:hover {
      background: ${p => p.theme.borderLight}
    }
  }
`

const NewButton = (props) => (
  <NewPodcastButton>
    <Link className='new-podcast-link' to={props.to}>+</Link>
  </NewPodcastButton>
)

export default NewButton;