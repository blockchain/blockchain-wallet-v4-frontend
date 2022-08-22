import React from 'react'
import { compose } from 'redux'

import { duration } from 'components/Flyout'
import { CardTransaction } from 'data/components/debitCard/types'
import { ModalName } from 'data/modals/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'
import TransactionDetail from './TransactionDetail.template'

const TransactionDetailContainer = (props: Props) => {
  return <TransactionDetail {...props} />
}
type OwnProps = {
  detail: CardTransaction
}

export type Props = OwnProps & ModalPropsType

const enhance = compose<React.ComponentType>(
  modalEnhancer(ModalName.TRANSACTION_DETAIL_MODAL, { transition: duration })
)

export default enhance(TransactionDetailContainer)
