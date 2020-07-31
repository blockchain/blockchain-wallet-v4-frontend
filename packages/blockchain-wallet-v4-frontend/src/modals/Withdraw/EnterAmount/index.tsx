import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'

import { actions } from 'data'
import { ExtractSuccess, WalletFiatType } from 'core/types'
import { getData } from './selectors'
import { Remote } from 'blockchain-wallet-v4/src'
import Failure from './template.failure'
import Loading from './template.loading'

class EnterAmount extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    if (!Remote.Success.is(this.props.data)) {
      this.props.custodialActions.fetchCustodialBeneficiaries(
        this.props.fiatCurrency
      )
    }
  }

  render () {
    return this.props.data.cata({
      Success: val => <div>{JSON.stringify(val)}</div>,
      Failure: () => <Failure {...this.props} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  data: getData(state, ownProps)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  custodialActions: bindActionCreators(actions.custodial, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = { fiatCurrency: WalletFiatType; handleClose: () => void }
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(EnterAmount)
