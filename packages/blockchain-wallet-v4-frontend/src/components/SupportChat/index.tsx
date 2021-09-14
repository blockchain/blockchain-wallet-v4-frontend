import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { WalletOptionsType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { UserDataType } from 'data/types'

// must be section so global style doesnt overwrite position style
const RelativeWrapper = styled.section`
  position: relative;
`
const AbsoluteWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 10;
`
const Iframe = styled.iframe<{ widgetOpen: State['widgetOpen'] }>`
  height: ${(props) => (props.widgetOpen ? '580px' : '60px')};
  width: ${(props) => (props.widgetOpen ? '400px' : '190px')};
  border: none;
`

class SupportChat extends React.PureComponent<LinkStatePropsType, State> {
  state = {
    chatEnabled: false,
    intervalStarted: false,
    widgetOpen: false
  }

  componentDidMount() {
    // listen for messages about widget open/close state
    window.addEventListener('message', this.updateWidgetState, false)
  }

  updateWidgetState = (e) => {
    const message = e.data
    // HMR/zendesk combo sends empty messages sometimes that result in widget state
    // being set to close when it really is still open
    if (message && typeof message.widgetOpen === 'boolean') {
      this.setState({ widgetOpen: message.widgetOpen })
    }
  }

  postMsgToWalletHelper = (methodName, data) => {
    const zendeskIframe = document.getElementById('zendesk-iframe') as HTMLIFrameElement

    const waitForFrameLoad = () => {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this
      const interval = setInterval(() => {
        setTimeout(function () {
          if (!zendeskIframe || !zendeskIframe.contentWindow) return
          zendeskIframe?.contentWindow.postMessage({ messageData: data, method: methodName }, '*')
          that.setState({ chatEnabled: true })
        }, 3000)
        clearInterval(interval)
      }, 3000)
    }

    // ensure iframe is loaded before sending message
    if (zendeskIframe?.contentWindow && !this.state.intervalStarted) {
      // component renders many times, ensure we only start one poll for the connection
      this.setState({ intervalStarted: true })
      waitForFrameLoad()
    }
  }

  render() {
    const { domains, userData } = this.props

    // if we dont have user data return
    if (!userData) return null
    const tier = userData.tiers?.current || 0

    // only show chat to gold users
    if (tier === 2 && !this.state.chatEnabled) {
      this.postMsgToWalletHelper('showChat', {
        email: userData.email,
        fullName:
          userData.firstName && userData.lastName
            ? `${userData.firstName} ${userData.lastName}`
            : ''
      })
    }

    return (
      <RelativeWrapper>
        <AbsoluteWrapper>
          <Iframe
            id='zendesk-iframe'
            src={`${domains.walletHelper}/wallet-helper/zendesk/#/`}
            widgetOpen={this.state.widgetOpen}
          />
        </AbsoluteWrapper>
      </RelativeWrapper>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  } as WalletOptionsType['domains']),
  userData: selectors.modules.profile.getUserData(state).getOrElse({} as UserDataType)
})

const connector = connect(mapStateToProps)

type LinkStatePropsType = {
  domains: { [key in string]: string }
  userData: UserDataType | null
}
type State = {
  chatEnabled: boolean
  intervalStarted: boolean
  widgetOpen: boolean
}

export default connector(SupportChat)
