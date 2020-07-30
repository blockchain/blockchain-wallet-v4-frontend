import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'

import { actions } from 'data'
import { ExtractSuccess, WalletFiatType } from 'core/types'
import { getData } from './selectors'

class EnterAmount extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    this.props.custodialActions.fetchCustodialBeneficiaries(
      this.props.fiatCurrency
    )
  }

  render () {
    return <div>{JSON.stringify(this.props.data)}</div>
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  custodialActions: bindActionCreators(actions.custodial, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = { fiatCurrency: WalletFiatType; handleClose: () => void }
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(EnterAmount)
