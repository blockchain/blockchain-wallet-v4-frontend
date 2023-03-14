import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { BSAccountType, FiatType, RemoteDataType } from '@core/types'
import DataError from 'components/DataError'
import { GenericNabuErrorFlyout } from 'components/GenericNabuErrorFlyout'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import { UserDataType } from 'data/types'
import { isNabuError } from 'services/errors'

import Loading from '../template.loading'
import { getData } from './selectors'
import Success from './template.success'

const WireInstructions = (props) => {
  useEffect(() => {
    if (props.fiatCurrency) {
      props.buySellActions.setFiatCurrency(props.fiatCurrency)
    }
    props.buySellActions.fetchPaymentAccount()
  }, [props.buySellActions, props.fiatCurrency])

  return props.data.cata({
    Failure: (e) => {
      if (isNabuError(e)) {
        return <GenericNabuErrorFlyout error={e} onDismiss={props.handleClose} />
      }
      return <DataError message={{ message: e }} />
    },
    Loading: () => <Loading />,
    NotAsked: () => <Loading />,
    Success: (val) => <Success {...val} {...props} />
  })
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  fiatCurrency: FiatType
  handleClose: () => void
}

export type SuccessStateType = {
  account: BSAccountType
  userData: UserDataType
}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(WireInstructions)
