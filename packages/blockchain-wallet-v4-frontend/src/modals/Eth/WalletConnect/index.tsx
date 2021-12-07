import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import Flyout, { duration, FlyoutChild, FlyoutWrapper } from 'components/Flyout'
import { actions, selectors } from 'data'
import { WalletConnectStep } from 'data/components/walletConnect/types'
import { ModalName } from 'data/modals/types'
import { RootState } from 'data/rootReducer'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'
import AddNewConnectionStep from './Steps/AddNewConnectionStep'
import ApproveTransactionStep from './Steps/ApproveTransactionStep'
import AuthorizeConnectionStep from './Steps/AuthorizeConnection'
import DisconnectionNoticeStep from './Steps/DisconnectionNotice'
import SessionDashboardStep from './Steps/SessionDashboard'
import Failure from './template.failure'
import Loading from './template.loading'

class WalletConnectContainer extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { show: false }
  }

  componentDidMount() {
    const { uri, walletConnectActions } = this.props
    // eslint-disable-next-line
    this.setState({ show: true })

    // only init new wc session if we detect a new uri from deeplink/goal
    if (uri) {
      walletConnectActions.initWalletConnect({ uri })
    }
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  render() {
    return (
      <Flyout
        {...this.props}
        onClose={this.handleClose}
        isOpen={this.state.show}
        data-e2e='walletConnectModal'
      >
        <FlyoutChild>
          <FlyoutWrapper>
            {this.props.stepR.cata({
              Failure: (err) => <Failure {...err} handleClose={this.handleClose} />,
              Loading: () => <Loading />,
              NotAsked: () => <Loading />,
              Success: (val) => {
                const successProps = { ...this.props, ...val, handleClose: this.handleClose }

                switch (true) {
                  case val.name === WalletConnectStep.ADD_NEW_CONNECTION:
                    return <AddNewConnectionStep {...successProps} />

                  case val.name === WalletConnectStep.APPROVE_TRANSACTION:
                    return <ApproveTransactionStep {...successProps} />

                  case val.name === WalletConnectStep.AUTHORIZE_CONNECTION:
                    return <AuthorizeConnectionStep {...successProps} />

                  case val.name === WalletConnectStep.DISCONNECTION_NOTICE:
                    return <DisconnectionNoticeStep {...successProps} />

                  case val.name === WalletConnectStep.SESSION_DASHBOARD:
                    return <SessionDashboardStep {...successProps} />

                  case val.name === WalletConnectStep.TRANSACTION_SENT:
                    return null

                  case val.name === WalletConnectStep.LOADING:
                  default:
                    return <Loading />
                }
              }
            })}
          </FlyoutWrapper>
        </FlyoutChild>
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  sessionDetails: selectors.components.walletConnect.getSessionDetails(state),
  stepR: selectors.components.walletConnect.getStep(state)
})

const mapDispatchToProps = (dispatch) => ({
  walletConnectActions: bindActionCreators(actions.components.walletConnect, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)
const enhance = compose(
  ModalEnhancer(ModalName.WALLET_CONNECT_MODAL, { transition: duration }),
  connector
)

type OwnProps = {
  uri?: string
}
export type Props = OwnProps & ModalPropsType & ConnectedProps<typeof connector>
type State = { show: boolean }

export default enhance(WalletConnectContainer)
