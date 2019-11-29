import React from 'react';
import Layout from '../components/layout';
import styled from "styled-components";
import FormGroup from '../components/formGroup';
import { toast } from 'react-toastify';
import {Link} from 'react-router-dom';
import FileForm from '../components/fileForm';
import OutlineButton from '../components/outlineButton';
import Select from 'react-select'
import envConfig from '../envConfig';
import { withFirebase } from '../components/firebase';
import Spinner from '../components/spinner';

const ArtPlaceholder = styled.div`
  width: 400px;
  border: 2px solid ${props => props.theme.light};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 35px;
  h2 {
    margin-bottom: 35px;
  }
  button {
    margin-bottom: 0;
  }
`

const PodcastArt = styled.img`
  max-width: 400px;
`

const PodcastData = styled.div`
  display: flex;
  flex-direction: column;

  h3 {
    margin-bottom: 50px;
  }

  .loaded-data {
    .subheader {
      margin-bottom: 20px;
      margin-top: 100px;
    }
  }
`

const ItemContainer = styled.div`
  display: flex;
  max-width: 800px;
  flex-wrap: wrap;

  a {
    display: block;
    border: 0;
    margin: 0 15px 30px 0;
    padding: 0;
  }
`

const ItemPreview = styled.div`
  background: transparent;
  color: ${p => p.theme.light};
  border: 2px solid ${p => p.theme.borderLight};
  width: 200px;
  margin: 0;
  padding: 25px;
  height: 100%;

  p {
    font-weight: 400;
  }

  h3 {
    margin-bottom: 10px;
  }

  a {
    color: ${p => p.theme.dark};
    border-bottom: 2px solid ${p => p.theme.dark};
    &:hover {
      color: ${p => p.theme.light};
      background: ${p => p.theme.dark}
    }
  }
`

const Section = styled.div`
  margin-bottom: 100px;

  .subheader {
    margin-bottom: 35px;
  }
`

function formatDate(date) {
  const monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  const weekdays = [
    "Mon", "Tue", "Wed",
    "Thu", "Fri", "Sat", "Sun"
  ]
  const day = date.getDate();
  const dayIndex = date.getDay();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return `${weekdays[dayIndex]} ${monthNames[monthIndex]} ${day}, ${year}`;
}

class Podcast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      podcastData: null,
      newName: null,
      newDescription: null,
      allEpisodes: null,
      allHosts: null,
      allGuests: null,
      selectedHosts: null,
      selectedEpisodes: null
    }

    this.successfulSubmitHandler = this.successfulSubmitHandler.bind(this)
    this.onNameChangeHandler = this.onNameChangeHandler.bind(this)
    this.onDescriptionChangeHandler = this.onDescriptionChangeHandler.bind(this)
    this.submitChangesHandler = this.submitChangesHandler.bind(this)
    this.submitImageHandler = this.submitImageHandler.bind(this);
    this.episodeAssignmentChangeHandler = this.episodeAssignmentChangeHandler.bind(this)
    this.hostAssignmentChangeHandler = this.hostAssignmentChangeHandler.bind(this)
  }

  async componentWillMount() {
    const {params} = this.props.match;

    const r = await fetch(`${envConfig.API_HOST}/api/podcast/${params.podcastId}`)
    const j = await r.json();
    
    const e = await fetch(`${envConfig.API_HOST}/api/episodes`)
    let y = await e.json()

    let allHosts = null
    const h = await fetch(`${envConfig.API_HOST}/api/hosts`)
    if (h.status === 200) {
      let hj = await h.json()
  
      allHosts = hj
    }

    let allGuests = null;

    const g = await fetch(`${envConfig.API_HOST}/api/guests`)
    if (g.status === 200) {
      let gj = await g.json()
  
      allGuests = gj
    }

    this.setState({
      podcastData: j,
      allEpisodes: y,
      allHosts: allHosts,
      allGuests: allGuests,
      selectedHosts: j.hosts,
      selectedGuests: j.guests,
      selectedEpisodes: j.episodes
    })
  }

  successfulSubmitHandler(data) {
    this.setState({
      podcastData: {
        ...this.state.podcastData,
        ...data
      }
    })
  }

  onNameChangeHandler(e) {
    this.setState({
      podcastData: {
        ...this.state.podcastData,
        name: e.target.value
      }
    })
  }

  onDescriptionChangeHandler(e) {
    this.setState({
      podcastData: {
        ...this.state.podcastData,
        description: e.target.value
      }
    })
  }

  async submitImageHandler(values, {resetForm}) {
    if (values.file == null) {
      return
    }
    let formData = new FormData();
    formData.append('image', values.file)
    let x = await fetch(`${envConfig.API_HOST}/api/podcast/${this.state.podcastData.id}/art`, {
      body: formData,
      method: "post"
    })
    if (x.status === 200) {
      let j = await x.json();
      resetForm();
      this.successfulSubmitHandler(j)
    }
  }

  async submitChangesHandler() {
    const {podcastData} = this.state;
    let x = await fetch(`${envConfig.API_HOST}/api/podcast/${podcastData.id}`, {
      method: "PATCH",
      body: JSON.stringify(podcastData),
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (x.status === 200) {
      toast("Saved changes to podcast!");
    }
  }

  async episodeAssignmentChangeHandler(e) {
    this.setState({
      selectedEpisodes: e
    })
  }

  async hostAssignmentChangeHandler(e) {
    this.setState({
      selectedHosts: e
    })
  }

  render() {
    const {podcastData} = this.state;
    return (
      <Layout title={podcastData ? podcastData.name : ""}>
        <div className='podcast-single'>
          {podcastData ? (
            <PodcastData>
              <Section>
                <h3>{podcastData.description}</h3>
                <FormGroup
                  label="Change Podcast Name"
                  onChange={this.onNameChangeHandler}
                  placeholder={podcastData.name}></FormGroup>
                <FormGroup
                  label="Change Description"
                  onChange={this.onDescriptionChangeHandler}
                  placeholder={podcastData.description.substring(0, 100)}
                  type="textarea"></FormGroup>
              </Section>

              {podcastData.podcast_art ? 
                <Section>
                  <PodcastArt className="podcast-art" src={podcastData.podcast_art}></PodcastArt> 
                  <h2 className='subheader'>Change image</h2>
                  <FileForm onSubmit={this.submitImageHandler}></FileForm>
                </Section>
                : 
                <Section>
                  <ArtPlaceholder className="no-podcast-placeholder">
                    <h2>No podcast art found. Add one?</h2>
                    <FileForm onSubmit={this.submitImageHandler}></FileForm>
                  </ArtPlaceholder>
                </Section>
              }

              <Section>
                <h2 className="subheader">Hosts on this Podcast</h2>
                {this.state.selectedHosts !== null && this.state.selectedHosts.length > 0 ? 
                  <ItemContainer className="hosts-container">
                    {this.state.selectedHosts.map((host) => (
                      <Link to={`/host/${host.id}`}>
                        <ItemPreview key={host.id}>
                          <h3>{host.name}</h3>
                          <p>{host.country}</p>
                        </ItemPreview>
                      </Link>
                  ))}
                  </ItemContainer>
                  : 
                  <p>No hosts selected for this podcast, add one below</p>
                }
              </Section>

              <Section>
                <h2 className="subheader">Add or Remove Hosts</h2>
                <Select
                  isMulti
                  value={this.state.selectedHosts}
                  className='react-select-container' 
                  classNamePrefix="react-select"
                  options={this.state.allHosts}
                  getOptionLabel={(r) => (r.name)}
                  getOptionValue={(r) => (r.id)}
                  onChange={this.hostAssignmentChangeHandler}></Select>
                <OutlineButton onClick={async () => {
                  let x = await fetch(`${envConfig.API_HOST}/api/podcast/${podcastData.id}/hosts`, {
                    method: 'put',
                    body: JSON.stringify({
                      hosts: this.state.selectedHosts
                    }),
                    headers: {
                      "content-type": "application/json"
                    }
                  })

                  let u = await x.json()

                  if (x.status === 200) {
                    console.log("Successful submit: ", u)
                  }

                }}>Save Hosts</OutlineButton>
              </Section>

              <Section>
                <h2 className="subheader">Episodes in this podcast</h2>
                {this.state.selectedEpisodes !== null && this.state.selectedEpisodes.length > 0 ?
                  <ItemContainer>
                    {this.state.selectedEpisodes.map((episode) => (
                      <Link to={`/episode/${episode.id}`}>
                        <ItemPreview key={episode.id}>
                          <h3>{episode.title}</h3>
                          <p>{formatDate(new Date(episode.published_at))}</p>
                        </ItemPreview>
                      </Link>
                    ))}
                  </ItemContainer>
                  :
                  <p>No Episodes selected</p>
                }
              </Section>

              <Section>
                <h2 className="subheader">Add or Remove Episodes</h2>
                <Select
                  isMulti
                  value={this.state.selectedEpisodes}
                  className='react-select-container' 
                  classNamePrefix="react-select"
                  options={this.state.allEpisodes}
                  getOptionLabel={(r) => (r.title)}
                  getOptionValue={(r) => (r.id)}
                  onChange={this.episodeAssignmentChangeHandler}></Select>
                <OutlineButton onClick={async () => {
                  let x = await fetch(`${envConfig.API_HOST}/api/podcast/${podcastData.id}/episodes`, {
                    method: 'put',
                    body: JSON.stringify({
                      episodes: this.state.selectedEpisodes
                    }),
                    headers: {
                      "content-type": "application/json"
                    }
                  })

                  let u = await x.json()

                  if (x.status === 200) {
                    console.log("Successful submit: ", u)
                  }

                }}>Save Episodes</OutlineButton>
              </Section>

               
              <Section>
                <OutlineButton onClick={this.submitChangesHandler}>Save All Changes</OutlineButton>
              </Section>
            </PodcastData>
          ) : <Spinner></Spinner>}
        </div>
      </Layout>
    )
  }
}

export default withFirebase(Podcast)
