import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BSCardType, BSPaymentMethodsType } from '@core/types'
import { actions, selectors } from 'data'
import { ModalName } from 'data/modals/types'
import { UserDataType } from 'data/types'
import { useRemote } from 'hooks'

import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

const LinkedCards = () => {
  const dispatch = useDispatch()

  const fiatCurrency = useSelector(selectors.core.settings.getCurrency).getOrElse('USD')

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

  if (isLoading) return <Loading />
  if (hasError || isNotAsked || !data) return null

  // TODO: FRICTIONS If user is from UK && missing things, call it here
  // Endpoint to call will be a GET to /nabu-gateway/uk-frictions/state
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

export default LinkedCards
