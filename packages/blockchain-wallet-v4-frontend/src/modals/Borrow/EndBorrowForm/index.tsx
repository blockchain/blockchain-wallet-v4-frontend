import { connect } from 'react-redux'
import { FlyoutWrapper } from 'components/Flyout'
import { getData } from './selectors'
import {
  LoanType,
  OfferType,
  RemoteDataType,
  SupportedCoinsType
} from 'core/types'
import { RatesType } from 'data/types'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'

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
type Props = OwnProps & LinkStatePropsType

class EndBorrowForm extends PureComponent<Props> {
  state = {}

  render () {
    return (
      <FlyoutWrapper>
        <h1>End Borrow Form</h1>
      </FlyoutWrapper>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EndBorrowForm)
