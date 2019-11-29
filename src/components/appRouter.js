import React from 'react'
import { withFirebase } from './firebase';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import NewEpisode from '../pages/newEpisode';
import NewHost from '../pages/newHost';
import Episode from '../pages/episode';
import Host from '../pages/host';
import SignIn from '../pages/signIn';
import Home from '../pages/home';
import Podcasts from "../pages/podcasts";
import Podcast from "../pages/podcast";
import NewPodcast from '../pages/newPodcast';
import Episodes from "../pages/episodes";
import Hosts from "../pages/hosts";
import Guests from "../pages/guests";
import NotFound from '../pages/404';
import Nav from '../components/nav';

const AppBg = styled.div`
  background-color: #1b1f23;
`

class AppRouter extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isSignedIn: false
    }
  }

  componentDidMount() {
    const { firebase } = this.props;
    this.unregisterAuthObserver = firebase.auth.onAuthStateChanged(
      (user) => this.setState({ isSignedIn: !!user })
    )
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    return (
      <Router>
        <ThemeProvider
          theme={{
            light: '#e8eaf6',
            dark: '#1b1f23',
            yellow: '#fbc02d',
            borderLight: '#2F363D'
          }}>
          <AppBg className='App'>
            <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/podcasts" component={Podcasts} />
              <Route path="/hosts" component={Hosts} />
              <Route path="/guests" component={Guests} />
              <Route path="/episodes" component={Episodes} />
              <Route exact path="/signin" component={SignIn}></Route>
              <Route exact path="/podcast/new" component={NewPodcast}></Route>
              <Route exact path="/episode/new" component={NewEpisode}></Route>
              <Route exact path="/host/new" component={NewHost}></Route>
              <Route exact path="/podcast/:podcastId([0-9]+)" component={Podcast} />
              <Route exact path="/episode/:episodeId([0-9]+)" component={Episode} />
              <Route exact path="/host/:hostId([0-9]+)" component={Host} />
              <Route component={NotFound}></Route>
            </Switch>
          </AppBg>
        </ThemeProvider>
      </Router>
    )
  }
}

export default withFirebase(AppRouter);