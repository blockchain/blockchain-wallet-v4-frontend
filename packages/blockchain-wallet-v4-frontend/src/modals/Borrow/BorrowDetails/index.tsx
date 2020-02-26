import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { getData } from './selectors'
import {
  LoanType,
  OfferType,
  RemoteDataType,
  SupportedCoinsType
} from 'core/types'
import { RatesType } from 'data/types'
import { RootState } from 'data/rootReducer'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

export type OwnProps = {
  handleClose: () => void
  loan: LoanType
  offer: OfferType
}
export type SuccessStateType = {
  rates: RatesType
  supportedCoins: SupportedCoinsType
}
type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}
export type LinkDispatchPropsType = {
  borrowActions: typeof actions.components.borrow
}
type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

class BorrowDetails extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    this.props.borrowActions.setCoin(this.props.offer.terms.collateralCcy)
  }

  render () {
    return this.props.data.cata({
      Success: val => <Success {...val} {...this.props} />,
      Failure: e => (typeof e === 'object' ? e.message : e),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  borrowActions: bindActionCreators(actions.components.borrow, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BorrowDetails)
