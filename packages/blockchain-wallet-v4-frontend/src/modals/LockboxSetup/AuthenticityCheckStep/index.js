import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { actions, selectors } from 'data'
import { Button, FlatLoader, Text } from 'blockchain-info-components'
import AuthenticityCheckStep from './template'

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0;
`

class AuthenticityCheckStepContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onNextStep = this.onNextStep.bind(this)
  }

  onNextStep () {
    this.props.lockboxActions.changeDeviceSetupStep('open-btc-app')
  }

  render () {
    const { authenticity, closeModal } = this.props

    const continueMsg = (
      <FormattedMessage
        id='modals.lockboxsetup.authenticitycheck.continue'
        defaultMessage='Continue'
      />
    )

    return authenticity.cata({
      Success: resp => (
        <AuthenticityCheckStep>
          <Row>
            <Text size='14px' weight={300}>
              {resp.isAuthentic ? (
                <FormattedMessage
                  id='modals.lockboxsetup.authenticitycheck.authentic'
                  defaultMessage='Congrats! Your device is authentic!'
                />
              ) : (
                <FormattedMessage
                  id='modals.lockboxsetup.authenticitycheck.inauthentic'
                  defaultMessage='Whoops! This device appears to be not authentic. Please contact support.'
                />
              )}
            </Text>
          </Row>
          <Row>
            <Button nature='primary' fullwidth onClick={this.onNextStep}>
              {continueMsg}
            </Button>
          </Row>
        </AuthenticityCheckStep>
      ),
      Failure: () => (
        <AuthenticityCheckStep>
          <Row>
            <Text size='14px' weight={300}>
              <FormattedMessage
                id='modals.lockboxsetup.authenticitycheck.failure'
                defaultMessage='Failed to authenticate your device. Please contact support.'
              />
            </Text>
          </Row>
          <Row>
            <Button nature='primary' fullwidth onClick={closeModal}>
              {continueMsg}
            </Button>
          </Row>
        </AuthenticityCheckStep>
      ),
      Loading: () => (
        <AuthenticityCheckStep>
          <Row>
            <Text size='14px' weight={400}>
              <FormattedMessage
                id='modals.lockboxsetup.authenticitycheck.loading'
                defaultMessage='Checking device authenticity...'
              />
            </Text>
          </Row>
          <Row>
            <FlatLoader width='150px' height='25px' />
          </Row>
        </AuthenticityCheckStep>
      ),
      NotAsked: () => null
    })
  }
}

const mapStateToProps = state => ({
  authenticity: selectors.components.lockbox.getNewDeviceAuthenticity(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthenticityCheckStepContainer)
