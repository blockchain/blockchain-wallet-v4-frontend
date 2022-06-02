import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { CoinType } from '@core/types'
import { actions } from 'data'
import { ModalName } from 'data/types'

import Menu from './template'

class TransactionFiltersContainer extends React.PureComponent<Props> {
  handleClickReporting = () => {
    const { coin, modalActions } = this.props
    modalActions.showModal(ModalName.TRANSACTION_REPORT_MODAL, {
      coin,
      origin: 'TransactionList'
    })
  }

  render() {
    // TODO: SELF_CUSTODY
    return (
      <Menu
        canSearch={this.props.coin !== 'STX'}
        canGenerateTxReport={this.props.coin !== 'STX'}
        handleClickReporting={this.handleClickReporting}
      />
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type OwnProps = {
  coin: CoinType
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(TransactionFiltersContainer)
