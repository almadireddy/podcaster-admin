import React from 'react'
import Layout from '../components/layout';
import {Link} from 'react-router-dom';
import envConfig from '../envConfig';
import IndexPreviewContainer from '../components/indexPreviewContainer'
import IndexPreview from '../components/indexPreview'
import NewButton from "../components/newButton";
import Spinner from '../components/spinner';

export default class Guests extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      guests: null
    }
  }

  async componentWillMount() {
    let x = await fetch(`${envConfig.API_HOST}/api/guests`)
    let j = await x.json();

    this.setState({
      guests: j
    })
  }

  render() {
    return (
      <Layout title="Guests">
        <IndexPreviewContainer>
          <IndexPreview>
            <div className="info-container">
              <h2>New Guest</h2>
              <NewButton to="/guest/new"></NewButton>
            </div>
          </IndexPreview>
          
          {this.state.guests 
            ? this.state.guests.map((guest) => (
              <IndexPreview>
                <div className="info-container">
                  <h2>{guest.name}</h2>
                  <Link to={`/guest/${guest.id}`}>
                    Edit Guest info
                  </Link>
                </div>
              </IndexPreview>
            ))
            : <Spinner></Spinner>}
        </IndexPreviewContainer>
      </Layout>
    )  
  }
}
