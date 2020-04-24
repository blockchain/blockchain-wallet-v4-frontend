import { actions } from 'data'
import { CoinType } from 'core/types'
import { connect, ConnectedProps } from 'react-redux'

import Menu from './template'
import React from 'react'

class TransactionFiltersContainer extends React.PureComponent<Props> {
  handleClickReporting = () => {
    const { coin, showModal } = this.props
    showModal('TRANSACTION_REPORT', { coin })
  }

  render () {
    return <Menu handleClickReporting={this.handleClickReporting} />
  }
}

const mapDispatchToProps = dispatch => ({
  showModal: (modal, options) =>
    dispatch(actions.modals.showModal(modal, options))
})

const connector = connect(
  null,
  mapDispatchToProps
)

type OwnProps = {
  coin: CoinType
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(TransactionFiltersContainer)
