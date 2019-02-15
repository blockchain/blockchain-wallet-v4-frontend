import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { actions } from 'data'
import { AppManager } from 'components/Lockbox'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`

class AppManagerStepContainer extends React.PureComponent {
  onStepChange = () => {
    this.props.lockboxActions.changeDeviceSetupStep('pair-device')
    this.props.lockboxActions.finalizeNewDeviceSetup()
  }

  render () {
    return (
      <Wrapper>
        <AppManager
          newDevice
          mainButtonText={
            <FormattedMessage
              id='modals.lockboxsetup.appmanagerstep.continue'
              defaultMessage='Continue'
            />
          }
          onClose={this.onStepChange}
        />
      </Wrapper>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(AppManagerStepContainer)
