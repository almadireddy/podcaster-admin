import React from 'react';
import './App.css';
import Firebase, { FirebaseContext } from './components/firebase'
import AppRouter from './components/appRouter';

class App extends React.Component {
  render() {
    return (
      <FirebaseContext.Provider
        value={new Firebase()}>
        <AppRouter></AppRouter>
      </FirebaseContext.Provider>
    );
  }
}

export default App;
