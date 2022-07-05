import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { compose } from 'redux'

import TransactionsBox from './TransactionsBox.template'

const TransactionsBoxContainer = (props) => <TransactionsBox {...props} />

const connector = connect(null, null)

export type Props = ConnectedProps<typeof connector>

const enhance = compose(connector)

export default enhance(TransactionsBoxContainer)
