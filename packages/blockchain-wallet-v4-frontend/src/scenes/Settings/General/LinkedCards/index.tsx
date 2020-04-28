import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import {
  FiatType,
  RemoteDataType,
  SBCardType,
  SBPaymentMethodsType
} from 'core/types'
import { getData } from './selectors'
import { Remote } from 'core'
import { RootState } from 'data/rootReducer'
import { SBFormPaymentMethod } from 'data/types'
import React, { PureComponent } from 'react'
import Success from './template.success'

class LinkedCards extends PureComponent<Props> {
  componentDidMount () {
    this.props.simpleBuyActions.fetchSBCards()
    this.props.simpleBuyActions.fetchSBPaymentMethods(
      this.props.fiatCurrency || 'USD'
    )
  }

  shouldComponentUpdate (nextProps: Props) {
    return Remote.Success.is(nextProps.data)
  }

  handleCreditCardClick = (defaultMethod?: SBFormPaymentMethod) => {
    this.props.simpleBuyActions.showModal('settingsGeneral')
    this.props.simpleBuyActions.setStep({
      step: 'ENTER_AMOUNT',
      defaultMethod: defaultMethod,
      fiatCurrency: this.props.fiatCurrency || 'USD'
    })
  }

  render () {
    return this.props.data.cata({
      Success: val => (
        <Success
          {...val}
          {...this.props}
          handleCreditCardClick={this.handleCreditCardClick}
        />
      ),
      Loading: () => null,
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

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

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
