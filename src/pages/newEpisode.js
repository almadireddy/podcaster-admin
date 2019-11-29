import React from 'react';
import Layout from '../components/layout';
import styled from 'styled-components';
import {Formik} from 'formik';
import { Link } from "react-router-dom";
import FormGroup from '../components/formGroup'
import OutlineButton from '../components/outlineButton';
import envConfig from '../envConfig';

const LeadPara = styled.p`
  margin-bottom: 50px;
  font-size: 22px;
`

const SubmitButton = styled.button`
  padding: 10px 15px;
  border-radius: 5px;
  background: transparent;
  border: 2px solid ${p => p.theme.light};
  color: ${p => p.theme.light};
  font-size: 18px;
  cursor: pointer;
  transition: all .2s ease;
  margin-top: 25px;
  margin-bottom: 50px;

  a {
    color: ${p => p.theme.light};
    text-decoration: none;
    border: none;
    padding: 10px 0;
  }
  &:hover {
    a {
      color: ${p => p.theme.dark};
    }
    border-color: transparent;
    color: ${p => p.theme.dark};
    background: ${p => p.theme.light};
  }
`

export default class NewEpisode extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      successfulSubmit: false,
      newEpisodeId: null
    }
  }

  render() {
    return (
      <Layout title="New Episode">
        <LeadPara>Fill out all the information and hit save to 
          create your new episode!
        </LeadPara>
        <Formik
          className="newPodcastForm"
          initialValues={{
            title: "My New Podcast",
            description: "My new podcast is amazing!",
            url: "https://google.com/",
            language: "English",
            podcastId: 1,
          }}
          onSubmit={ async (values, actions) => {
            let postBody = {
              title: values.title,
              description: values.description,
              url: values.url,
              language: values.language,
              podcast_id: values.podcastId
            }
            let x = await fetch(`${envConfig.API_HOST}/api/episodes`, {
              method: "POST",
              body: JSON.stringify(postBody),
              headers: {
                'Content-Type': 'application/json'
              }
            })
            if (x.status === 200) {
              let body = await x.json()
              console.log(body)
              this.setState({
                newEpisodeId: body.id,
                successfulSubmit: true
              })
            }
          }}>
            {({handleChange, values, handleSubmit}) => (
              <form onSubmit={handleSubmit}>
                <FormGroup
                  label="Episode Title"
                  type="text" 
                  name="title"
                  onChange={handleChange}
                  placeholder={values.title}></FormGroup>
                

                <FormGroup 
                  label="Episode URL"
                  type="text" 
                  name="url"
                  onChange={handleChange}
                  placeholder={values.url}></FormGroup>

                <FormGroup 
                  label="Language"
                  type="text" 
                  name="language"
                  onChange={handleChange}
                  placeholder={values.language}></FormGroup>

                <FormGroup 
                  label="Podcast Id"
                  type="text" 
                  name="podcastId"
                  onChange={handleChange}
                  placeholder={values.podcastId}></FormGroup>

                <FormGroup
                  label="Episode Description"
                  type="textarea"
                  name="description"
                  onChange={handleChange}
                  placeholder={values.description}
                  ></FormGroup>

                <OutlineButton 
                  onClick={handleSubmit}
                  type="submit"
                  >Submit</OutlineButton>
              </form>
            )}
          </Formik>
          {this.state.successfulSubmit && 
            <div>
              <h2>Your podcast has been created!</h2>
              <SubmitButton>
                <Link to={`/episode/${this.state.newEpisodeId}`}>
                  See it here!
                </Link>
              </SubmitButton>
            </div>  
          }
      </Layout>
    )
  }
}

// name
// start year
// language
// description
// podcast art
