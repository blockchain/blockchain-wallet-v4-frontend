import React from 'react'
import { connect } from 'react-redux'
import { pathOr } from 'ramda'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { actions, selectors } from 'data'

import EmailAddress from './EmailAddress'
import TwoStepVerification from './TwoStepVerification'
import WalletRecoveryPhrase from './WalletRecoveryPhrase'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
  & > * {
    margin-top: 20px;
  }
`

class BasicSecurityContainer extends React.PureComponent {
  state = {
    changeEmail: pathOr(false, ['location', 'state', 'changeEmail'], this.props)
  }

  render() {
    return (
      <Wrapper>
        <EmailAddress changeEmail={this.state.changeEmail} />
        <TwoStepVerification />
        <WalletRecoveryPhrase />
      </Wrapper>
    )
  }
}

const mapStateToProps = state => ({
  authType: selectors.core.settings.getAuthType(state),
  emailVerified: selectors.core.settings.getEmailVerified(state)
})

const mapDispatchToProps = dispatch => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BasicSecurityContainer)
