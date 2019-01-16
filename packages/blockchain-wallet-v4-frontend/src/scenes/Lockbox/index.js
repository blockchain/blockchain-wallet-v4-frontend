import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { withRouter, Route, Switch } from 'react-router-dom'
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride'

import { actions, selectors } from 'data'
import { TOUR_STEPS } from 'model'
import LockboxDashboard from './Dashboard'
import LockboxOnboard from './Onboard'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`
class LockboxContainer extends React.PureComponent {
  state = { run: false, steps: [] }

  componentWillMount () {
    // only find route on entry from side menu click
    if (this.props.location.pathname === '/lockbox') {
      this.props.lockboxActions.determineLockboxRoute()
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props !== prevProps && this.props.showProductTour) {
      this.onStartTour()
    }
  }

  onStartTour = () => {
    this.setState({
      run: true,
      steps: TOUR_STEPS
    })
  }

  handleTourCallbacks = data => {
    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(data.type)) {
      // advance current step
      this.setState({
        stepIndex: data.index + (data.action === ACTIONS.PREV ? -1 : 1)
      })
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
      // end tour
      this.setState({ run: false })
      this.props.lockboxActions.setProductTourVisibility(false)
    }
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
          showSkipButton
          callback={this.handleTourCallbacks}
          styles={{
            options: {
              primaryColor: '#004A7C',
              zIndex: 1000
            }
          }}
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

const mapStateToProps = state => ({
  showProductTour: selectors.components.lockbox.getProductTourVisibility(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LockboxContainer)
)
