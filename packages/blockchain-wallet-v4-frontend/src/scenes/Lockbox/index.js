import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { withRouter, Route, Switch } from 'react-router-dom'
import Joyride from 'react-joyride'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
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
            <React.Fragment>
              <Text size='18px' weight={400} style={{marginBottom: '16px'}}>
                <FormattedMessage
                  id='scenes.lockbox.tour.stepone.title'
                  defaultMessage='Welcome to your Lockbox!'
                />
              </Text>
              <Text size='14px' weight={300}>
                <FormattedMessage
                  id='scenes.lockbox.tour.stepone.content'
                  defaultMessage="Lockbox is organized by asset. Select an asset to view it's transaction history."
                />
              </Text>
            </React.Fragment>
          ),
          placement: 'bottom',
          disableBeacon: true,
          disableOverlayClose: true,
          hideCloseButton: true,
          spotlightClicks: true
        },
        {
          target: '.tour-step2',
          content: (
            <React.Fragment>
              <Text size='18px' weight={400} style={{marginBottom: '16px'}}>
                <FormattedMessage
                  id='scenes.lockbox.tour.steptwo.title'
                  defaultMessage='Asset List'
                />
              </Text>
              <Text size='14px' weight={300}>
                <FormattedMessage
                  id='scenes.lockbox.tour.steptwo.content'
                  defaultMessage="These are the assets available to your Lockbox.  Your balances are shown by default.  Clicking on an asset with filter the transaction list to show just that asset."
                />
              </Text>
            </React.Fragment>
          ),
          placement: 'bottom',
          disableBeacon: true,
          disableOverlayClose: true,
          hideCloseButton: true,
          spotlightClicks: true
        },
        {
          target: '.tour-step3',
          content: (
            <React.Fragment>
              <Text size='18px' weight={400} style={{marginBottom: '16px'}}>
                <FormattedMessage
                  id='scenes.lockbox.tour.stepthree.title'
                  defaultMessage='Transaction Search'
                />
              </Text>
              <Text size='14px' weight={300}>
                <FormattedMessage
                  id='scenes.lockbox.tour.stepthree.content'
                  defaultMessage="Here you can search for any transaction made with your Lockbox by entering coin names, addresses or descriptions."
                />
              </Text>
            </React.Fragment>
          ),
          placement: 'bottom',
          disableBeacon: true,
          disableOverlayClose: true,
          hideCloseButton: true,
          spotlightClicks: true
        },
        {
          target: '.tour-step4',
          content: (
            <React.Fragment>
              <Text size='18px' weight={400} style={{marginBottom: '16px'}}>
                <FormattedMessage
                  id='scenes.lockbox.tour.stepfour.title'
                  defaultMessage='App Manager'
                />
              </Text>
              <Text size='14px' weight={300}>
                <FormattedMessage
                  id='scenes.lockbox.tour.stepfour.content'
                  defaultMessage="Want to add, update or remove applications?  Click here to manage all applications on your device."
                />
              </Text>
            </React.Fragment>
          ),
          placement: 'bottom-end',
          disableBeacon: true,
          disableOverlayClose: true,
          hideCloseButton: true,
          spotlightClicks: true
        },
        {
          target: '.tour-step5',
          content: (
            <React.Fragment>
              <Text size='18px' weight={400} style={{marginBottom: '16px'}}>
                <FormattedMessage
                  id='scenes.lockbox.tour.stepfive.title'
                  defaultMessage='Lockbox Settings'
                />
              </Text>
              <Text size='14px' weight={300}>
                <FormattedMessage
                  id='scenes.lockbox.tour.stepfive.content'
                  defaultMessage="Clicking here will bring you to the settings page where you can rename your device, install firmware updates, verify your devices authenticity and much more!"
                />
              </Text>
            </React.Fragment>
          ),
          placement: 'bottom-end',
          disableBeacon: true,
          disableOverlayClose: true,
          hideCloseButton: true,
          spotlightClicks: true
        }
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
          showSkipButton
          styles={{
            options: {
              primaryColor: '#004A7C',
              zIndex: 1000,
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

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(LockboxContainer)
)
