import { any } from 'ramda'
import { connect } from 'react-redux'
import { RootState } from 'data/rootReducer'
import { SBOrderType } from 'core/types'

import { selectors } from 'data'
import { UserDataType } from 'data/types'
import React from 'react'
import styled from 'styled-components'

type LinkStatePropsType = {
  domains: { [key in string]: string }
  sbOrders: Array<SBOrderType>
  userData: UserDataType | null
}
type State = { widgetOpen: boolean }
type CustomIframe = State
type Props = LinkStatePropsType & CustomIframe

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 10;
`
const Iframe = styled.iframe<CustomIframe>`
  height: ${props => (props.widgetOpen ? '800px' : '60px')};
  width: ${props => (props.widgetOpen ? '400px' : '150px')};
  border: none;
`

const postMsgToWalletHelper = (methodName, data) => {
  const frame = document.getElementById('zendesk-iframe') as HTMLIFrameElement
  if (frame && frame.contentWindow) {
    frame.contentWindow.postMessage(
      {
        method: methodName,
        messageData: data
      },
      '*'
    )
  }
}

class ZendeskWidget extends React.PureComponent<Props, State> {
  state = {
    widgetOpen: false
  }
  componentDidMount () {
    window.addEventListener('message', this.updateWidgetState, false)
  }

  updateWidgetState = e => {
    this.setState({ widgetOpen: e.data.widgetOpen })
  }

  render () {
    const { domains, sbOrders, userData } = this.props
    const pendingSbOrder = any(
      o => o.state === 'PENDING_CONFIRMATION' || o.state === 'PENDING_DEPOSIT',
      sbOrders
    )

    // only show chat to users with pending sb orders for now
    if (userData && pendingSbOrder) {
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
          widgetOpen={this.state.widgetOpen}
        />
      </Wrapper>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  }),
  sbOrders: selectors.components.simpleBuy.getSBOrders(state).getOrElse([]),
  userData: selectors.modules.profile.getUserData(state).getOrElse(null)
})

export default connect(mapStateToProps)(ZendeskWidget)
