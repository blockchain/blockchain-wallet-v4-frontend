import React from 'react'
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import { connect } from 'react-redux'
import { Route, Switch, withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { actions, selectors } from 'data'

import LockboxDashboard from './Dashboard'
import { TOUR_STEPS, TourTooltip } from './model'
import LockboxOnboard from './Onboard'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`
class LockboxContainer extends React.PureComponent {
  state = { run: false, steps: TOUR_STEPS }

  componentDidMount() {
    this.checkForcedRouting()
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      if (this.props.showProductTour) {
        this.onStartTour()
      }
      this.checkForcedRouting()
    }
  }

  // need to force route match on all entries from side menu click
  checkForcedRouting = () => {
    if (this.props.location.pathname === '/lockbox') {
      this.props.lockboxActions.determineLockboxRoute()
    }
  }

  onStartTour = () => {
    this.setState({ run: true })
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

  render() {
    const { run, steps } = this.state

    return (
      <Wrapper>
        <Joyride
          run={run}
          steps={steps}
          disableScrollParentFix={true}
          callback={this.handleTourCallbacks}
          tooltipComponent={TourTooltip}
          {...this.props.Joyride}
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
  connect(mapStateToProps, mapDispatchToProps)(LockboxContainer)
)
