import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { CoinType } from 'blockchain-wallet-v4/src/types'
import { actions } from 'data'

import Menu from './template'

class TransactionFiltersContainer extends React.PureComponent<Props> {
  handleClickReporting = () => {
    const { coin, modalActions } = this.props
    modalActions.showModal('TRANSACTION_REPORT', {
      coin,
      origin: 'TransactionList'
    })
  }

  render() {
    return <Menu handleClickReporting={this.handleClickReporting} />
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type OwnProps = {
  coin: CoinType
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(TransactionFiltersContainer)
