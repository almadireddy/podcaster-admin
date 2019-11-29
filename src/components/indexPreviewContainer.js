import React, { Component } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export default class IndexPreviewContainer extends Component {
  render() {
    return (
      <Container>
        {this.props.children}
      </Container>
    )
  }
}
