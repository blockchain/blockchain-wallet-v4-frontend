import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { BSCardType, BSPaymentMethodsType, FiatType, RemoteDataType } from '@core/types'
import { actions, selectors } from 'data'
import { ModalName } from 'data/modals/types'
import { RootState } from 'data/rootReducer'
import { UserDataType } from 'data/types'

import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

class LinkedCards extends PureComponent<Props> {
  componentDidMount() {
    this.props.buySellActions.fetchCards(false)
    this.props.buySellActions.fetchPaymentMethods(this.props.fiatCurrency)
  }

  handleCreditCardClick = () => {
    this.props.buySellActions.showModal({
      origin: 'SettingsGeneral',
      step: 'DETERMINE_CARD_PROVIDER'
    })
    this.props.buySellActions.setFiatCurrency(this.props.fiatCurrency || 'USD')
  }

  proceedToUserVerification = () => {
    this.props.modalActions.showModal(ModalName.COMPLETE_USER_PROFILE, {
      origin: 'SettingsGeneral'
    })
  }

  render() {
    return this.props.data.cata({
      Failure: () => null,
      Loading: () => <Loading />,
      NotAsked: () => null,
      Success: (val) => {
        const isUserVerified = val.userData.tiers && val.userData.tiers.current > 0
        return (
          <Success
            {...val}
            {...this.props}
            handleCreditCardClick={
              isUserVerified ? this.handleCreditCardClick : this.proceedToUserVerification
            }
          />
        )
      }
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state),
  fiatCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type SuccessStateType = {
  cards: Array<BSCardType>
  paymentMethods: BSPaymentMethodsType
  userData: UserDataType
}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  fiatCurrency?: FiatType
}
export type Props = ConnectedProps<typeof connector>

export default connector(LinkedCards)
