import React from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import ButtonPage from 'scenes/Button'

class App extends React.Component {
  render () {
    return (
      <Router>
        <Switch>
          <Redirect from='/' to='/button' exact />
          <Route exact path='/button' component={ButtonPage} />
        </Switch>
      </Router>
    )
  }
}

export default App
