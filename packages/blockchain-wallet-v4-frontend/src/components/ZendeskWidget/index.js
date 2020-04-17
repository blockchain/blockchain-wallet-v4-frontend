import { any } from 'ramda'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { actions, selectors } from 'data'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 9999;
`
const Iframe = styled.iframe`
  height: 550px;
  width: 375px;
  border: none;
`

const postMsgToWalletHelper = (methodName, data) => {
  const frame = document.getElementById('zendesk-iframe')
  if (frame) {
    frame.contentWindow.postMessage(
      {
        method: methodName,
        messageData: data
      },
      '*'
    )
  }
}

class ZendeskWidget extends React.PureComponent {
  render () {
    const { domains, sbOrders, userData } = this.props

    const pendingSbOrder = any(
      o => o.state === 'PENDING_CONFIRMATION' || o.state === 'PENDING_DEPOSIT',
      sbOrders
    )

    // only show chat to users with pending sb orders for now
    if (pendingSbOrder) {
      postMsgToWalletHelper('showChat', {
        fullName: `${userData.firstName} ${userData.lastName}`,
        email: userData.email
      })
    } else {
      postMsgToWalletHelper('showHelp', {})
    }

    return (
      <Wrapper>
        <Iframe
          id='zendesk-iframe'
          src={domains.walletHelper + '/wallet-helper/zendesk/#/'}
        />
      </Wrapper>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

const mapStateToProps = state => ({
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  }),
  sbOrders: selectors.components.simpleBuy.getSBOrders(state).getOrElse([]),
  userData: selectors.modules.profile.getUserData(state).getOrElse({})
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ZendeskWidget)
