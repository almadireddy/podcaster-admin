import React from 'react';
import { Link } from "react-router-dom";
import Layout from '../components/layout';
import styled from 'styled-components';
import NewButton from '../components/newButton';
import envConfig from "../envConfig";
import IndexPreview from "../components/indexPreview";
import IndexPreviewContainer from "../components/indexPreviewContainer";
import Spinner from '../components/spinner';

export default class Podcasts extends React.Component {
  constructor(props) {
    super(props) 
    this.state = {
      podcasts: null
    }
  }
  
  async componentWillMount() {
    const r = await fetch(`${envConfig.API_HOST}/api/podcasts`, {})
    const j = await r.json();
    
    this.setState({podcasts: j}) 
  }
  
  render() {
    return(
      <Layout title="All Podcasts">
        <IndexPreviewContainer>
          <IndexPreview
            imgSrc="https://placehold.it/400">
            <h2>New Podcast</h2>
            <NewButton
              to="podcast/new">
            </NewButton>
          </IndexPreview>
          {this.state.podcasts ? this.state.podcasts.map((podcast) => (
            <IndexPreview
              key={podcast.id} 
              className="podcast"
              imgSrc={podcast.podcast_art}
              imgAlt={`podcast art for ${podcast.name}`}>
                <h2>{podcast.name}</h2>
                <p>{podcast.description.substring(0, 50)}...</p>
                <Link to={`podcast/${podcast.id}`}>Edit Podcast</Link>
            </IndexPreview>
          )) : <Spinner></Spinner>}
        </IndexPreviewContainer>
      </Layout>
    )
  }
}
