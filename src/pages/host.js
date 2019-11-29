import React from 'react';
import Layout from '../components/layout';
import styled from "styled-components";
import { Formik } from 'formik';
import {Link} from 'react-router-dom';
import Thumb from '../components/thumb';
import FormGroup from '../components/formGroup';
import OutlineButton from '../components/outlineButton';
import { toast } from 'react-toastify';
import envConfig from '../envConfig';
import Spinner from '../components/spinner';

const HostText = styled.p`
  font-size: 18px;
  margin-bottom: 15px;
`

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

const HostData = styled.div`
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
      let x = await fetch(`${process.env.REACT_APP_API_HOST}/api/podcast/${props.id}/art`, {
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

  a {
    display: block;
    border: 0;
    margin: 0 15px 0 0;
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

const PodcastArtContainer = styled.div`
  width: 400px;
  margin: 0 auto;
  margin-bottom: 10px;
`

export default class Host extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hostData: null,
      newName: null,
      newDescription: null
    }

    this.successfulSubmitHandler = this.successfulSubmitHandler.bind(this)
    this.hostChangeHandler = this.hostChangeHandler.bind(this)
    this.submitChangesHandler = this.submitChangesHandler.bind(this)
  }

  async componentWillMount() {
    const {params} = this.props.match;
    const r = await fetch(`${envConfig.API_HOST}/api/host/${params.hostId}`)
    const j = await r.json();
    
    this.setState({
      hostData: j
    })
  }

  successfulSubmitHandler(data) {
    this.setState({
      hostData: data
    })
  }

  hostChangeHandler(e) {
    this.setState({
      hostData: {
        ...this.state.hostData,
        ...e
      }
    })
  }

  async submitChangesHandler() {
    const {hostData} = this.state;
    let x = await fetch(`${envConfig.API_HOST}/api/host/${hostData.id}`, {
      method: "PATCH",
      body: JSON.stringify(hostData),
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (x.status === 200) {
      toast("Saved changes to host!");
    }
  }

  render() {
    const {hostData} = this.state;
    return (
      <Layout title={hostData ? hostData.name : ""}>
        <div className='podcast-single'>
          {hostData ? (
            <HostData>
              <Section>
                <HostText><b>Bio</b>: {hostData.bio}</HostText>
                <h3>{hostData.country}</h3>
                <FormGroup
                  label="Change Host Name"
                  onChange={(e) => this.hostChangeHandler({name: e})}
                  placeholder={hostData.name}></FormGroup>
                <FormGroup
                  type="textarea"
                  label="Change host's bio"
                  onChange={(e) => this.hostChangeHandler({bio: e})}
                  placeholder={hostData.bio.substring(0, 50)}></FormGroup>
                <FormGroup
                  label="Change language"
                  onChange={(e) => this.hostChangeHandler({language: e})}
                  placeholder={hostData.language}></FormGroup>
                <FormGroup
                  label="Change host's country"
                  onChange={(e) => this.hostChangeHandler({country: e})}
                  placeholder={hostData.country || "none"}></FormGroup>
                <FormGroup
                  label="Change host's email"
                  onChange={(e) => this.hostChangeHandler({email: e})}
                  placeholder={hostData.email || "none"}></FormGroup>
                <FormGroup
                  label="Change host's job title"
                  onChange={(e) => this.hostChangeHandler({job_title: e})}
                  placeholder={hostData.job_title || "none"}></FormGroup>
                <FormGroup
                  label="Change host's organization"
                  onChange={(e) => this.hostChangeHandler({organization: e})}
                  placeholder={hostData.organization || "none"}></FormGroup>
                <FormGroup
                  label="Change host's ORCID number"
                  onChange={(e) => this.hostChangeHandler({orcid: e})}
                  placeholder={hostData.orcid || "none"}></FormGroup>
                <FormGroup
                  label="Change host's website"
                  onChange={(e) => this.hostChangeHandler({website: e})}
                  placeholder={hostData.website || "none"}></FormGroup>
              </Section>
              
              {hostData.podcasts !== undefined && 
                <Section>
                  <h2 className="subheader">Host of</h2>
                    <ItemContainer className="hosts-container">
                      {hostData.podcasts.map((pod) => (
                        <Link to={`/podcast/${pod.id}`}>
                          <ItemPreview key={pod.id}>
                            <h3>{pod.name}</h3>
                            <p>{pod.language}</p>
                          </ItemPreview>
                        </Link>
                    ))}
                    </ItemContainer>
                </Section>
              }
               
              <Section>
                <OutlineButton onClick={this.submitChangesHandler}>Save All Changes</OutlineButton>
              </Section>
            </HostData>
          ) : <Spinner></Spinner>}
        </div>
      </Layout>
    )
  }
}
