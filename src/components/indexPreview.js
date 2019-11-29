import React, { Component } from 'react'
import styled from 'styled-components'

const ItemPreview = styled.div`
  padding: 25px;
  color: ${p => p.theme.light};
  background: ${p => p.theme.dark};
  border: 2px solid ${p => p.theme.borderLight};
  width: 300px;
  display: flex;
  flex-direction: column;
  margin: 15px 15px 15px 0;

  .img-container {
    margin-bottom: 30px;
    width: 100%;

    img {
      max-width:100%;
      max-height:100%;
    }
  }

  .info-container {
    max-width: 350px;
    p {
      font-size: 18px;
      margin-bottom: 15px;
    }
  }

  h2 {
    font-weight: 300;
    font-size: 28px;
    margin-bottom: 15px;
  }
`

const IndexPreview = (props) => {
  return (
    <ItemPreview>
      {props.imgSrc && (
        <div className='img-container'>
          <img alt={props.imgAlt || ""} src={props.imgSrc}></img>
        </div>
      )}
      <div className='info-container'>
        {props.children}
      </div>
    </ItemPreview>
  )
}

export default IndexPreview