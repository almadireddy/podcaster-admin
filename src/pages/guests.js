import React from 'react'
import Layout from '../components/layout';
import envConfig from '../envConfig';
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
        {this.state.guests 
          ? this.state.guests.map((guest) => (
            <div className="listing-item">
              <p>{guest.name}</p>
            </div>
          ))
          : <Spinner></Spinner>}
      </Layout>
    )  
  }
}
