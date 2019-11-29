import React from 'react';
import styled from "styled-components";
import OutlineButton from './outlineButton';
import Thumb from './thumb'
import {Formik} from 'formik';

const ThumbContainer = styled.div`
  display: block;
  margin-bottom: 20px;
`

const FileForm = (props) => (
  <Formik
    initialValues={{ file: null }}
    onSubmit={props.onSubmit}
    render={({ values, handleSubmit, setFieldValue }) => {
      return (
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label htmlFor="file">File upload</label>
            <input id="file" name="file" type="file" onChange={(event) => {
              setFieldValue("file", event.currentTarget.files[0]);
            }} className="form-control" />
          </div>
          <ThumbContainer>
            <Thumb file={values.file} />
          </ThumbContainer>
          <OutlineButton type="submit">submit</OutlineButton>
        </form>
      );
    }} 
  ></Formik>
)

export default FileForm;