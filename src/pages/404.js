import React from 'react';
import {Link} from 'react-router-dom';
import Layout from '../components/layout';
import styled from 'styled-components';

const Lead =  styled.p`
  margin-bottom: 25px;
  font-size: 22px;
`

const NotFound = () => (
  <Layout title="404 Not Found">
    <Lead>Make sure you are on the right page!</Lead>
    <Link to="/">Go Home</Link>
  </Layout>
)

export default NotFound;