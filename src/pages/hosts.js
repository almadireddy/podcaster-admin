import React from 'react'
import Layout from '../components/layout';
import {Link} from 'react-router-dom';
import envConfig from '../envConfig';
import IndexPreviewContainer from '../components/indexPreviewContainer'
import IndexPreview from '../components/indexPreview'
import NewButton from "../components/newButton";
import Spinner from '../components/spinner';
import { withFirebase } from '../components/firebase';

class Hosts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hosts: null
    }
  }

  async componentWillMount() {
    const token = await this.props.firebase.getIdToken();
    const authHeader = {
      "authorization": token
    }

    let x = await fetch(`${envConfig.API_HOST}/api/hosts`, {
      headers: {...authHeader}
    })
    let j = await x.json();

    this.setState({
      hosts: j
    })
  }

  render() {
    return (
      <Layout title="All Hosts">
        <IndexPreviewContainer>
          <IndexPreview>
            <div className="info-container">
              <h2>New Host</h2>
              <NewButton to="/host/new"></NewButton>
            </div>
          </IndexPreview>
          {this.state.hosts 
            ? this.state.hosts.map((host) => (
              <IndexPreview>
                <div className="info-container">
                  <h2>{host.name}</h2>
                  <Link to={`/host/${host.id}`}>
                    Edit Host info
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


export default withFirebase(Hosts);