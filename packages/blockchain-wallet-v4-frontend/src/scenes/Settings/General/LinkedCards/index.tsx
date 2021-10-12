import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import {
  FiatType,
  RemoteDataType,
  SBCardType,
  SBPaymentMethodsType
} from '@core/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

class LinkedCards extends PureComponent<Props> {
  componentDidMount() {
    this.props.buySellActions.fetchCards(false)
    this.props.buySellActions.fetchPaymentMethods(this.props.fiatCurrency)
  }

  handleCreditCardClick = () => {
    this.props.buySellActions.showModal({ origin: 'SettingsGeneral' })
    this.props.buySellActions.setFiatCurrency(this.props.fiatCurrency || 'USD')
    this.props.buySellActions.setStep({
      step: 'ADD_CARD'
    })
    this.props.buySellActions.addCardFinished()
  }

  render() {
    return this.props.data.cata({
      Failure: () => null,
      Loading: () => <Loading />,
      NotAsked: () => null,
      Success: (val) => (
        <Success {...val} {...this.props} handleCreditCardClick={this.handleCreditCardClick} />
      )
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type SuccessStateType = {
  cards: Array<SBCardType>
  paymentMethods: SBPaymentMethodsType
}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  fiatCurrency?: FiatType
}
export type Props = ConnectedProps<typeof connector>

export default connector(LinkedCards)
