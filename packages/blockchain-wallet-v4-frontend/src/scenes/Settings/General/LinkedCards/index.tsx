import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import {
  FiatType,
  RemoteDataType,
  SBCardType,
  SBPaymentMethodsType
} from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

class LinkedCards extends PureComponent<Props> {
  componentDidMount() {
    this.props.simpleBuyActions.fetchSBCards()
    this.props.simpleBuyActions.fetchSBPaymentMethods(
      this.props.fiatCurrency || 'USD'
    )
  }

  handleCreditCardClick = () => {
    this.props.simpleBuyActions.showModal('SettingsGeneral')
    this.props.simpleBuyActions.setFiatCurrency(
      this.props.fiatCurrency || 'USD'
    )
    this.props.simpleBuyActions.setStep({
      step: 'ADD_CARD'
    })
    this.props.simpleBuyActions.addCardFinished()
  }

  render() {
    return this.props.data.cata({
      Success: val => (
        <Success
          {...val}
          {...this.props}
          handleCreditCardClick={this.handleCreditCardClick}
        />
      ),
      Loading: () => <Loading />,
      Failure: () => null,
      NotAsked: () => null
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state),
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
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
