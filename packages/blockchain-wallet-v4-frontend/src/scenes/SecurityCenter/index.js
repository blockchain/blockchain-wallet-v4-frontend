import React from 'react'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { actions, selectors } from 'data'
import { Text } from 'blockchain-info-components'
import Menu from './Menu'
import SecuritySteps from './SecuritySteps'
import BasicSettings from './Basic'
import AdvancedSettings from './Advanced'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const ContentWrapper = styled.div`
  padding: 10px 30px 30px;
  box-sizing: border-box;
`
const StatusWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`
const IntroText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;

  & :first-child {
    padding: 20px 0;
  }

  @media (min-width: 992px) {
    width: 40%;
  }
`
class SecurityCenterContainer extends React.PureComponent {
  state = { activeTab: 'basic' }

  determineProgress = () => {
    const { authType, emailVerified, isMnemonicVerified } = this.props
    let progress = 0
    if (authType.getOrElse(0) > 0) progress++
    if (emailVerified.getOrElse(0) > 0) progress++
    if (isMnemonicVerified) progress++
    return progress
  }

  setActiveTab = tab => {
    this.setState({ activeTab: tab })
  }

  render () {
    const { authType, emailVerified, isMnemonicVerified } = this.props
    const { activeTab } = this.state
    const progress = this.determineProgress()

    return (
      <Wrapper>
        <Menu activeTab={activeTab} setActiveTab={this.setActiveTab} />
        <ContentWrapper>
          <StatusWrapper>
            <IntroText>
              <Text size='14px' weight={300}>
                {progress < 3 ? (
                  <FormattedMessage
                    id='scenes.securitycenter.introtextnone'
                    defaultMessage='Complete the steps below to help prevent unauthorized access to your wallet. Add additional verification to access your funds at any time.'
                  />
                ) : (
                  <FormattedMessage
                    id='scenes.securitycenter.introtextfour'
                    defaultMessage='Congratulations, you have completed the initial steps in helping to prevent unauthorized access to your wallet and bringing you even closer to financial security. Remember to always use caution with where you store your wallet details, what information you share with others, and with phishing emails.'
                  />
                )}
              </Text>
            </IntroText>
            {
              <SecuritySteps
                isMnemonicVerified={isMnemonicVerified}
                emailVerified={emailVerified}
                authType={authType}
              />
            }
          </StatusWrapper>
          {activeTab === 'basic' ? <BasicSettings /> : <AdvancedSettings />}
        </ContentWrapper>
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
