import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import createBrowserHistory from 'history/createBrowserHistory';

import login from './views/login/login';
import home from './views/home/home';

const history = createBrowserHistory();

class App extends React.Component {

  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path='/login' component={login} />
          <Route path='/' component={home} />
        </Switch>
      </Router>
    );
  }
}

export default connect(null, null)(App);
