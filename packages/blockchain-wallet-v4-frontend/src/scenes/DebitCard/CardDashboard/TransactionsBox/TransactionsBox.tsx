import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'

import TransactionsBox from './TransactionsBox.template'

const TransactionsBoxContainer = (props) => <TransactionsBox {...props} />

const mapDispatchToProps = (dispatch) => ({
  debitCardActions: bindActionCreators(actions.components.debitCard, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

const enhance = compose(connector)

export default enhance(TransactionsBoxContainer)
