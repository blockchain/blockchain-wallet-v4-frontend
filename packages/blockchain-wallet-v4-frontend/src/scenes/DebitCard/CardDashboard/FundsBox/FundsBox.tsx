import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { compose, Dispatch } from 'redux'

import { selectors } from 'data'

import FundsBox from './FundsBox.template'

const FundsBoxContainer = (props) => <FundsBox {...props} />

const mapStateToProps = (state) => ({
  currentCardAccount: selectors.components.debitCard.getCurrentCardAccount(state),
  funds: selectors.components.debitCard.getEligibleAccounts(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {}

export type Props = OwnProps & ConnectedProps<typeof connector>

const enhance = compose(connector)

export default enhance(FundsBoxContainer)
