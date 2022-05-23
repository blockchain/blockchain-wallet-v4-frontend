import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { ExtractSuccess } from '@core/types'
import DataError from 'components/DataError'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { BankTransferAccountType } from 'data/types'

import { getData } from './selectors'
import Success from './template.success'

const Authorize = ({ data, ...props }: Props) => {
  return data.cata({
    Failure: (e) => <DataError message={{ message: e }} />,
    Loading: () => <></>,
    NotAsked: () => <></>,
    Success: (val) => <Success {...props} {...val} />
  })
}

const mapStateToProps = (state: RootState) => ({
  bankAccounts: selectors.components.brokerage
    .getBankTransferAccounts(state)
    .getOrElse([] as Array<BankTransferAccountType>),
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  handleClose: () => void
}

export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Authorize)
