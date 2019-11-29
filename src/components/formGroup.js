import React from 'react';
import styled from 'styled-components';

const FormGroupContainer = styled.div`
  margin-bottom: 20px;

  input {
    font-size: 18px;
  }
`

const FormGroup = (props) => {
  return(
    <FormGroupContainer className="formGroup">
      <label>{props.label}</label>
      {props.type === "textarea" 
      ? <textarea
          name={props.name}
          onChange={props.onChange}
          placeholder={props.placeholder}></textarea> 
      : <input 
          type={props.type} 
          name={props.name}
          onChange={props.onChange}
          placeholder={props.placeholder}></input>
        }
    </FormGroupContainer>
  )
}

export default FormGroup
