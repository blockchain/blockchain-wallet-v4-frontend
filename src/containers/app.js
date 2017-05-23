import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import HeaderContainer from './Header';
import HomeContainer from './Home';
import TransactionsContainer from './Transactions';

class App extends React.Component {

	render() {

		return (
        <Router>
          <div className="app">
            <HeaderContainer />
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/transactions">Transactions</Link></li>
            </ul>
            <Switch>
              <Route exact path="/" component={HomeContainer} />
              <Route exact path="/transactions" component={TransactionsContainer} />
            </Switch>
          </div>
        </Router>
		);
	}
}

export default App;
