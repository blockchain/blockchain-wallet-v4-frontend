import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { WalletOptionsType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { UserDataType } from 'data/types'

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 10;
`
const Iframe = styled.iframe<{ widgetOpen: State['widgetOpen'] }>`
  height: ${props => (props.widgetOpen ? '580px' : '60px')};
  width: ${props => (props.widgetOpen ? '400px' : '190px')};
  border: none;
`

class ZendeskWidget extends React.PureComponent<Props, State> {
  state = {
    chatEnabled: false,
    widgetOpen: false
  }

  componentDidMount() {
    // listen for messages about widget open/close state
    window.addEventListener('message', this.updateWidgetState, false)
  }

  updateWidgetState = e => {
    const message = e.data
    // HMR/zendesk combo sends empty messages sometimes that result in widget state
    // being set to close when it really is still open
    if (
      message &&
      (message.widgetOpen === false || message.widgetOpen === true)
    ) {
      this.setState({ widgetOpen: e.data.widgetOpen })
    }
  }

  postMsgToWalletHelper = (methodName, data) => {
    const frame = document.getElementById('zendesk-iframe') as HTMLIFrameElement
    // ensure iframe is loaded before sending message
    const waitForFrameLoad = setInterval(() => {
      if (!frame || !frame.contentWindow) return
      this.setState({ chatEnabled: true })
      frame.contentWindow.postMessage(
        {
          method: methodName,
          messageData: data
        },
        '*'
      )

      clearInterval(waitForFrameLoad)
    }, 3000)
  }

  render() {
    const { domains, userData } = this.props

    if (!userData) return null
    const tier = userData.tiers?.current || 0

    // only show chat to gold users
    if (tier === 2 && !this.state.chatEnabled) {
      this.postMsgToWalletHelper('showChat', {
        fullName:
          userData.firstName && userData.lastName
            ? `${userData.firstName} ${userData.lastName}`
            : '',
        email: userData.email
      })
    }

    return (
      <Wrapper>
        <Iframe
          id='zendesk-iframe'
          src={domains.walletHelper + '/wallet-helper/zendesk/#/'}
          widgetOpen={this.state.widgetOpen}
        />
      </Wrapper>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  } as WalletOptionsType['domains']),
  userData: selectors.modules.profile
    .getUserData(state)
    .getOrElse({} as UserDataType)
})

const connector = connect(mapStateToProps)

type LinkStatePropsType = {
  domains: { [key in string]: string }
  userData: UserDataType | null
}
type State = { chatEnabled: boolean; widgetOpen: boolean }
type Props = LinkStatePropsType

export default connector(ZendeskWidget)
