import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { BSCardType, BSPaymentMethodsType, FiatType, RemoteDataType } from '@core/types'
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

  handleCreditCardClick = async () => {
    await this.props.buySellActions.showModal({ origin: 'SettingsGeneral' })
    await this.props.buySellActions.setFiatCurrency(this.props.fiatCurrency || 'USD')
    await this.props.buySellActions.setStep({
      step: 'DETERMINE_CARD_PROVIDER'
    })
    await this.props.buySellActions.addCardFinished()
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
  fiatCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type SuccessStateType = {
  cards: Array<BSCardType>
  paymentMethods: BSPaymentMethodsType
}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  fiatCurrency?: FiatType
}
export type Props = ConnectedProps<typeof connector>

export default connector(LinkedCards)
