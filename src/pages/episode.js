import React from 'react';
import Layout from '../components/layout';
import styled from "styled-components";
import { Formik } from 'formik';
import Thumb from '../components/thumb';
import FormGroup from '../components/formGroup';
import OutlineButton from '../components/outlineButton';
import { toast } from 'react-toastify';
import ReactPlayer from 'react-player';
import envConfig from "../envConfig";
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

const EpisodeData = styled.div`
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

const ChangeImageForm = (props) => (
  <Formik
    initialValues={{ file: null }}
    onSubmit={async (values, {resetForm}) => {
      if (values.file == null) {
        return
      }
      let formData = new FormData();
      formData.append('image', values.file)
      let x = await fetch(`${envConfig.API_HOST}/api/podcast/${props.id}/art`, {
        body: formData,
        method: "post"
      })
      if (x.status === 200) {
        let j = await x.json();
        resetForm();
        console.log(j)
        props.successfulSubmitHandler(j)
      }
    }}
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

const ThumbContainer = styled.div`
  display: block;
  margin-bottom: 20px;
`

const ItemContainer = styled.div`
  display: flex;
  max-width: 800px;
  flex-wrap: wrap;
  justify-content: center;
`

const ItemPreview = styled.div`
  background: ${props => props.theme.light};
  color: ${p => p.theme.dark};
  width: 200px;
  margin: 0 15px;
  margin-bottom: 30px;
  padding: 25px;
  border-radius: 4px;

  h3 {
    margin-bottom: 10px;
  }
`

const Section = styled.div`
  margin-bottom: 100px;

  .subheader {
    margin-bottom: 35px;
  }
`

const PodcastArtContainer = styled.div`
  width: 400px;
  margin: 0 auto;
  margin-bottom: 10px;
`

export default class Episode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      episodeData: null,
      newName: null,
      newDescription: null
    }

    this.successfulSubmitHandler = this.successfulSubmitHandler.bind(this)
    this.onNameChangeHandler = this.onNameChangeHandler.bind(this)
    this.onDescriptionChangeHandler = this.onDescriptionChangeHandler.bind(this)
    this.submitChangesHandler = this.submitChangesHandler.bind(this)
  }

  async componentWillMount() {
    const {params} = this.props.match;
    const r = await fetch(`${envConfig.API_HOST}/api/episode/${params.episodeId}`)
    const j = await r.json();
    
    this.setState({
      episodeData: j
    })
  }

  successfulSubmitHandler(data) {
    this.setState({
      episodeData: data
    })
  }

  onNameChangeHandler(e) {
    this.setState({
      episodeData: {
        ...this.state.episodeData,
        title: e.target.value
      }
    })
  }

  onDescriptionChangeHandler(e) {
    this.setState({
      episodeData: {
        ...this.state.episodeData,
        description: e.target.value
      }
    })
  }

  async submitChangesHandler() {
    const {episodeData} = this.state;
    let x = await fetch(`${envConfig.API_HOST}/api/episode/${episodeData.id}`, {
      method: "PATCH",
      body: JSON.stringify(episodeData),
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (x.status === 200) {
      toast("Saved changes to podcast!");
    }
  }

  render() {
    const {episodeData} = this.state;
    return (
      <Layout title={episodeData ? episodeData.title : ""}>
        <div className='podcast-single'>
          {episodeData ? (
            <EpisodeData>
              <Section>
                <h3>{episodeData.description}</h3>
                <FormGroup
                  label="Change Podcast Name"
                  onChange={this.onNameChangeHandler}
                  placeholder={episodeData.title}></FormGroup>
                <FormGroup
                  label="Change Description"
                  onChange={this.onDescriptionChangeHandler}
                  placeholder={episodeData.description.substring(0, 100)}
                  type="textarea"></FormGroup>
              </Section>
              {episodeData.url !== undefined && 
                <Section>
                  <h2 className="subheader">
                    <ThumbContainer>
                      <PodcastArt src={episodeData.podcast.podcast_art}></PodcastArt>
                    </ThumbContainer>
                    <ReactPlayer width={400} height={50} controls url={episodeData.url}>
                    </ReactPlayer>
                  </h2>
                </Section>
              }
              {episodeData.guests !== undefined && episodeData.guests.length > 0 && 
                <Section>
                  <h2 className="subheader">guests</h2>
                  <ItemContainer className="guests-container">
                    {episodeData.guests.map((guest) => (
                      <ItemPreview key={guest.id}>
                        <h3>{guest.name}</h3>
                        <p>{guest.country}</p>
                      </ItemPreview>
                    ))}
                  </ItemContainer>
                </Section>
              }

              {episodeData.podcast !== undefined && 
                <Section>
                  <h2 className="subheader">From {episodeData.podcast.name}</h2>
                  <ItemContainer>
                    
                  </ItemContainer>
                </Section>
              }
               
              <Section>
                <OutlineButton onClick={this.submitChangesHandler}>Save All Changes</OutlineButton>
              </Section>
            </EpisodeData>
          ) : <Spinner></Spinner>}
        </div>
      </Layout>
    )
  }
}
