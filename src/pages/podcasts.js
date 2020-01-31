import React from 'react';
import { Link, Redirect } from "react-router-dom";
import Layout from '../components/layout';
import styled from 'styled-components';
import NewButton from '../components/newButton';
import envConfig from "../envConfig";
import IndexPreview from "../components/indexPreview";
import IndexPreviewContainer from "../components/indexPreviewContainer";
import Spinner from '../components/spinner';
import { withFirebase } from '../components/firebase';

class Podcasts extends React.Component {
  constructor(props) {
    super(props) 
    this.state = {
      podcasts: null,
      redirect: false
    }
  }
  
  async componentWillMount() {
    if (this.props.firebase.isSignedIn()) {
      let id = await this.props.firebase.getIdToken();
      const r = await fetch(`${envConfig.API_HOST}/api/podcasts`, {
        headers: {
          authorization: id
        }
      })
      const j = await r.json();
      
      this.setState({podcasts: j}) 
    } else {
      this.setState({redirect: true})
    }
  }
  
  render() {
    if (this.state.redirect) {
      console.log(this.props.location)
      return(
        <Redirect to={{
          pathname: "/signin",
          state: {
            referrer: this.props.location.pathname
          }
        }}></Redirect>
      )
    }

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

export default withFirebase(Podcasts);