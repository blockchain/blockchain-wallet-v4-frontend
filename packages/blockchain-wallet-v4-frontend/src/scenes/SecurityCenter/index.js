import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { withRouter, Route, Redirect, Switch } from 'react-router-dom'

import { actions, selectors } from 'data'
import Menu from './Menu'
import SecurityCenter from './template'
import BasicSecurity from './BasicSecurity'
import AdvancedSecurity from './AdvancedSecurity'

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
        <SecurityCenter progress={this.determineProgress()} {...this.props}>
          <Switch>
            <Route path='/security-center/basic' component={BasicSecurity} />
            <Route
              path='/security-center/advanced'
              component={AdvancedSecurity}
            />
            <Redirect from='/security-center' to='/security-center/basic' />
          </Switch>
        </SecurityCenter>
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
