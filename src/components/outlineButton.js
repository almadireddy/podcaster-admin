import React from "react";
import styled from "styled-components";

const SubmitButton = styled.button`
  padding: 10px 15px;
  border-radius: 5px;
  background: transparent;
  border: 2px solid ${p => p.theme.light};
  color: ${p => p.theme.light};
  font-size: 18px;
  cursor: pointer;
  transition: all .2s ease;
  margin-top: 25px;
  margin-bottom: 50px;

  a {
    color: ${p => p.theme.light};
    text-decoration: none;
    border: none;
    padding: 10px 0;
  }
  &:hover {
    a {
      color: ${p => p.theme.dark};
    }
    border-color: transparent;
    color: ${p => p.theme.dark};
    background: ${p => p.theme.light};
  }
`

const OutlineButton = (props) => (
  <SubmitButton onClick={props.onClick} type={props.type}>{props.children}</SubmitButton>
)

export default OutlineButton;