import React from 'react'
import { compose } from 'redux'

import { duration } from 'components/Flyout'
import { CardTransaction } from 'data/components/debitCard/types'
import { ModalName } from 'data/modals/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'
import TransactionList from './TransactionList.template'

const TransactionListContainer = (props: Props) => {
  return <TransactionList {...props} />
}
type OwnProps = {
  detail: CardTransaction
}

export type Props = OwnProps & ModalPropsType

const enhance = compose<React.ComponentType>(
  modalEnhancer(ModalName.TRANSACTION_LIST_MODAL, { transition: duration })
)

export default enhance(TransactionListContainer)
