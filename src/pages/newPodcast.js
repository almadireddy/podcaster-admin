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

export default class NewPodcast extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      successfulSubmit: false,
      newPodcastId: null
    }
  }

  render() {
    return (
      <Layout title="New Podcast">
        <LeadPara>Fill out all the information and hit save to 
          create your new podcast!
        </LeadPara>
        <Formik
          className="newPodcastForm"
          initialValues={{
            name: "My New Podcast",
            startYear: new Date().getFullYear(),
            description: "My new podcast is amazing!",
            language: "English",
            podcastArt: "https://placehold.it/400",
          }}
          onSubmit={ async (values, actions) => {
            let postBody = {
              name: values.name,
              description: values.description,
              start_year: values.startYear,
              podcast_art: values.podcastArt,
              language: values.language,
            }
            let x = await fetch(`${envConfig.API_HOST}/api/podcasts`, {
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
                newPodcastId: body.id,
                successfulSubmit: true
              })
            }
          }}>
            {({handleChange, values, handleSubmit}) => (
              <form onSubmit={handleSubmit}>
                <FormGroup
                  label="Podcast Name"
                  type="text" 
                  name="name"
                  onChange={handleChange}
                  placeholder={values.name}></FormGroup>
                

                <FormGroup 
                  label="Podcast Start Year"
                  type="text" 
                  name="startYear"
                  onChange={handleChange}
                  placeholder={values.startYear}></FormGroup>

                <FormGroup 
                  label="Language"
                  type="text" 
                  name="language"
                  onChange={handleChange}
                  placeholder={values.language}></FormGroup>

                <FormGroup 
                  label="Podcast Art"
                  type="text" 
                  name="podcastArt"
                  onChange={handleChange}
                  placeholder={values.podcastArt}></FormGroup>

                <FormGroup
                  label="Podcast Description"
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
                <Link to={`/podcast/${this.state.newPodcastId}`}>
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
