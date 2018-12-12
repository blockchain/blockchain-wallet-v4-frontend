import React from 'react'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { actions, selectors } from 'data'
import Menu from './Menu'
import SecurityCenter from './template'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

class SecurityCenterContainer extends React.PureComponent {
  determineProgress = () => {
    const { authType, emailVerified, isMnemonicVerified } = this.props
    let progress = 0
    if (authType.getOrElse(0) > 0) progress++
    if (emailVerified.getOrElse(0) > 0) progress++
    if (isMnemonicVerified) progress++
    return progress
  }

  render () {
    return (
      <Wrapper>
        <Menu location={this.props.location} />
        <SecurityCenter progress={this.determineProgress()} {...this.props} />
      </Wrapper>
    )
  }
}

const mapStateToProps = state => ({
  authType: selectors.core.settings.getAuthType(state),
  emailVerified: selectors.core.settings.getEmailVerified(state),
  isMnemonicVerified: selectors.core.wallet.isMnemonicVerified(state)
})

const mapDispatchToProps = dispatch => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SecurityCenterContainer)
)
