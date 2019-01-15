import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { withRouter, Route, Switch } from 'react-router-dom'

import { actions } from 'data'
import LockboxDashboard from './Dashboard'
import LockboxOnboard from './Onboard'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`
class LockboxContainer extends React.PureComponent {
  componentWillMount () {
    // only find route on entry from menu click
    if (this.props.location.pathname === '/lockbox') {
      this.props.lockboxActions.determineLockboxRoute()
    }
  }

  render () {
    return (
      <Wrapper>
        <Switch>
          <Route
            path='/lockbox/dashboard/:deviceIndex'
            component={LockboxDashboard}
            exact
          />
          <Route
            path='/lockbox/settings/:deviceIndex'
            component={LockboxDashboard}
            exact
          />
          <Route path='/lockbox/onboard' component={LockboxOnboard} exact />
        </Switch>
      </Wrapper>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(LockboxContainer)
)
