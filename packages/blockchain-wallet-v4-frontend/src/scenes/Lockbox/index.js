import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { withRouter, Route, Switch } from 'react-router-dom'
import Joyride from 'react-joyride'

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
  state = {
    run: false,
    steps: []
  }

  componentWillMount () {
    // only find route on entry from menu click
    if (this.props.location.pathname === '/lockbox') {
      this.props.lockboxActions.determineLockboxRoute()
    }
  }

  componentDidMount () {
    this.setState({
      run: true,
      steps: [
        {
          target: '.tour-step1',
          content: (
            <div>
              You can interact with your own components through the spotlight.
              <br />
              Click the menu above!
            </div>
          ),
          textAlign: 'center',
          placement: 'bottom',
          disableBeacon: true,
          hideCloseButton: true,
          styles: {
            options: {
              zIndex: 10000
            }
          },
          title: 'Menu'
        }
        // {
        //   target: '.tour-step2',
        //   content: 'This is our sidebar, you can find everything you need here',
        //   textAlign: 'left',
        //   placement: 'right',
        //   disableBeacon: true,
        //   hideCloseButton: true,
        //   styles: {
        //     options: {
        //       zIndex: 10000
        //     }
        //   },
        //   title: 'Sidebar'
        // },
      ]
    })
  }

  render () {
    const { steps, run } = this.state
    return (
      <Wrapper>
        <Joyride
          steps={steps}
          continuous
          run={run}
          scrollToFirstStep
          showProgress
          showSkipButton
        />
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
