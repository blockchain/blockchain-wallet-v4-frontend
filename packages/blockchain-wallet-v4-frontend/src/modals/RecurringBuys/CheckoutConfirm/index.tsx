import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { ExtractSuccess } from '@core/types'
import DataError from 'components/DataError'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { RecurringBuyPeriods } from 'data/types'

import { Props as _P } from '..'
import { getData } from './selectors'
import Success from './template.success'

const Confirm = (props: Props) => {
  return props.data.cata({
    Failure: (e) => <DataError message={{ message: e }} />,
    Loading: () => <></>,
    NotAsked: () => <></>,
    Success: (val) => <Success {...props} {...val} />
  })
}

const mapStateToProps = (state: RootState) => ({
  bankAccounts: selectors.components.brokerage.getBankTransferAccounts(state).getOrElse([]),
  cards: selectors.components.buySell.getBSCards(state).getOrElse([]),
  data: getData(state),
  period: selectors.components.recurringBuy.getPeriod(state) as RecurringBuyPeriods,
  quote: selectors.components.buySell.getBSQuote(state).getOrFail('Could not get exchange rate')
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  recurringBuyActions: bindActionCreators(actions.components.recurringBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = _P & ConnectedProps<typeof connector>

export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>

export default connector(Confirm)
