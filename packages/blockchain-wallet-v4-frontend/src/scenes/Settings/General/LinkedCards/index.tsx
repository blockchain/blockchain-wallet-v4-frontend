import React, { useEffect } from 'react'
import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { BSCardType, BSPaymentMethodsType, FiatType, RemoteDataType } from '@core/types'
import { actions, selectors } from 'data'
import { ModalName } from 'data/modals/types'
import { RootState } from 'data/rootReducer'
import { UserDataType } from 'data/types'
import { useRemote } from 'hooks'

import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

const LinkedCards = () => {
  const dispatch = useDispatch()

  const fiatCurrency = useSelector(selectors.core.settings.getCurrency) ?? 'USD'

  const handleCreditCardClick = () => {
    dispatch(
      actions.components.buySell.showModal({
        origin: 'SettingsGeneral',
        step: 'DETERMINE_CARD_PROVIDER'
      })
    )

    dispatch(actions.components.buySell.setFiatCurrency(fiatCurrency))
  }

  const proceedToUserVerification = () => {
    dispatch(
      actions.modals.showModal(ModalName.COMPLETE_USER_PROFILE, {
        origin: 'SettingsGeneral'
      })
    )
  }

  useEffect(() => {
    dispatch(actions.components.buySell.fetchCards(false))
    dispatch(actions.components.buySell.fetchPaymentMethods(fiatCurrency))
  }, [])

  const { data, hasError, isLoading, isNotAsked } = useRemote(getData)

  if (hasError || isNotAsked) return <></>
  if (isLoading) return <Loading />
  if (!data) return <></>

  const isUserVerified = data.userData.tiers?.current > 0

  return (
    <Success
      {...(data as SuccessStateType)}
      handleCreditCardClick={isUserVerified ? handleCreditCardClick : proceedToUserVerification}
    />
  )
}

export type SuccessStateType = {
  cards: Array<BSCardType>
  paymentMethods: BSPaymentMethodsType
  userData: UserDataType
}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  fiatCurrency?: FiatType
}

export default LinkedCards
