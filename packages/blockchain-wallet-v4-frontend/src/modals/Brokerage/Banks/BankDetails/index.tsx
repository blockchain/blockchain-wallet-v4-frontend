import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import { WalletCurrencyType } from 'blockchain-wallet-v4/src/types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { BankTransferAccountType, BrokerageModalOriginType, ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../../types'
import Template from './template'

export type OwnProps = {
  handleClose: () => void
} & ModalPropsType

export type LinkDispatchPropsType = {
  brokerageActions: typeof actions.components.brokerage
}
export type LinkStatePropsType = {
  account: BankTransferAccountType | undefined
  walletCurrency: WalletCurrencyType
}
// export type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

class BankDetails extends PureComponent<Props, {}> {
  state: State = { show: false }

  componentDidMount() {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  handleSubmit = () => {
    if (this.props.account) {
      this.props.brokerageActions.showModal({
        modalType: 'REMOVE_BANK_MODAL',
        origin: BrokerageModalOriginType.BANK
      })
      this.props.brokerageActions.setBankDetails({
        account: this.props.account,
        redirectBackToStep: true
      })
    }
  }

  render() {
    if (!this.props.account) {
      return null
    }
    return (
      <Flyout
        {...this.props}
        onClose={this.handleClose}
        isOpen={this.state.show}
        data-e2e='bankDetailsModal'
      >
        <FlyoutChild>
          <Template {...this.props} onSubmit={this.handleSubmit} handleClose={this.handleClose} />
        </FlyoutChild>
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  account: selectors.components.brokerage.getAccount(state),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  ModalEnhancer(ModalName.BANK_DETAILS_MODAL, { transition: duration }),
  connector
)

export type Props = OwnProps & LinkStatePropsType & ConnectedProps<typeof connector>

type State = { show: boolean }

export default enhance(BankDetails)
