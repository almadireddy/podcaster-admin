import React from 'react';
import Layout from '../components/layout';
import styled from 'styled-components';
import {Formik} from 'formik';
import { Link } from "react-router-dom";
import FormGroup from '../components/formGroup'
import OutlineButton from '../components/outlineButton';
import envConfig from '../envConfig';
import { toast } from 'react-toastify';
import Select from 'react-select'

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

export default class NewHost extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      successfulSubmit: false,
      newHostId: null,
      allPodcasts: null,
      selectedPodcasts: null
    }

    this.podcastAssignmentChangeHandler = this.podcastAssignmentChangeHandler.bind(this)
  }

  async componentWillMount() {
    let x = await fetch(`${envConfig.API_HOST}/api/podcasts`)
    let k = await x.json();

    this.setState({
      allPodcasts: k
    })
  }

  async podcastAssignmentChangeHandler(e) {
    if (!!e) {
      let s = [...e].map((a) => a.id)
  
      this.setState({
        selectedPodcasts: s
      })
    } else {
      this.setState({selectedPodcasts: null})
    }
  }

  render() {
    return (
      <Layout title="New Host">
        <LeadPara>Fill out all the information and hit save to 
          create your new episode!
        </LeadPara>
        <Formik
          className="newPodcastForm"
          initialValues={{
            name: "David Bowie",
            bio: "My bio",
            language: "english",
            country: null,
            email: null,
            job_title: null,
            organization: null,
            orcid: null,
            website: null
          }}
          onSubmit={ async (values, actions) => {
            let postBody = {
              name: values.name,
              bio: values.bio,
              language: values.language,
              country: values.country,
              email: values.email,
              job_title: values.job_title,
              organization: values.organization,
              orcid: values.orcid,
              website: values.website,
            }
            if (this.state.selectedPodcasts !== null) {
              postBody["channel_id"] = this.state.selectedPodcasts
            }

            let x = await fetch(`${envConfig.API_HOST}/api/hosts`, {
              method: "POST",
              body: JSON.stringify(postBody),
              headers: {
                'Content-Type': 'application/json'
              }
            })
            if (x.status === 200) {
              let body = await x.json()
              toast("Successfully created new Host")
              this.setState({
                newHostId: body.id,
                successfulSubmit: true
              })
            }
          }}>
            {({handleChange, values, handleSubmit}) => (
              <form onSubmit={handleSubmit}>
                <FormGroup
                  label="Full Name"
                  name="name"
                  onChange={handleChange}
                  placeholder={values.name}></FormGroup>
                <FormGroup
                  type="textarea"
                  label="Bio"
                  name="bio"
                  onChange={handleChange}
                  placeholder={values.bio.substring(0, 50)}></FormGroup>
                <FormGroup
                  label="Language"
                  onChange={handleChange}
                  name="language"
                  placeholder={values.language}></FormGroup>
                <FormGroup
                  label="Country"
                  name="country"
                  onChange={handleChange}
                  placeholder={values.country || "Country"}></FormGroup>
                <FormGroup
                  label="Email"
                  name="email"
                  onChange={handleChange}
                  placeholder={values.email || "email@email.com"}></FormGroup>
                <FormGroup
                  label="Job title"
                  name="job_title"
                  onChange={handleChange}
                  placeholder={values.job_title || "Podcast Creator"}></FormGroup>
                <FormGroup
                  label="Organization"
                  name="organization"
                  onChange={handleChange}
                  placeholder={values.organization || "UT Dallas"}></FormGroup>
                <FormGroup
                  label="ORCID number"
                  name="orcid"
                  onChange={handleChange}
                  placeholder={values.orcid || "000000"}></FormGroup>
                <FormGroup
                  label="Website"
                  name="website"
                  onChange={handleChange}
                  placeholder={values.website || "example.com"}></FormGroup>

                <Select
                  isMulti
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={this.state.allPodcasts}
                  getOptionLabel={(r) => r.name}
                  getOptionValue={(r) => r.id}
                  onChange={this.podcastAssignmentChangeHandler}></Select>

                <OutlineButton 
                  onClick={handleSubmit}
                  type="submit"
                  >Submit</OutlineButton>
              </form>
            )}
          </Formik>
          {this.state.successfulSubmit && 
            <div>
              <h2>New host has been added!</h2>
              <SubmitButton>
                <Link to={`/host/${this.state.newHostId}`}>
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
