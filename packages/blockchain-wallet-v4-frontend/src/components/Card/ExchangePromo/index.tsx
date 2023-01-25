import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Experiments } from '@core/network/api/experiments/types'
import { actions, selectors } from 'data'
import { ExchangeAuthOriginType } from 'data/types'

import ExchangePromo from './ExchangePromo'

// local storage keys for dismiss stuff
const DATE_DISSMISSED_KEY = 'exchange-promo-dismiss-date'
const DISSMISSED_KEY = 'exchange-promo-dismiss-forever'
const A_WEEK = 7 * 24 * 60 * 60 * 1000

// From experiments API
const isExperimentOn = (experiments: Experiments) => {
  if (!Object.keys(experiments).length) return false
  return Number(experiments.walletAwarenessPrompt) >= 1
}

const getDismissedDate = (): number | null => {
  const rawDate = localStorage.getItem(DATE_DISSMISSED_KEY)
  if (!rawDate) return null
  return parseInt(rawDate, 10)
}

const wasDismissed = () => {
  // Card dismissed twice so gone forever
  const dismissed = localStorage.getItem(DISSMISSED_KEY)
  if (dismissed) return true

  // Card dismissed once, hide for a week
  const dateDismissed = getDismissedDate()
  if (dateDismissed && dateDismissed + A_WEEK > +new Date()) {
    return true
  }
  return false
}

const onDismiss = () => {
  const dateDismissed = getDismissedDate()
  if (dateDismissed) {
    // dissmissed twice now
    localStorage.setItem(DISSMISSED_KEY, 'true')
  } else {
    localStorage.setItem(DATE_DISSMISSED_KEY, String(+new Date()))
  }
}

const mustShow = (hide: boolean, featureFlag, experiments: Experiments): boolean => {
  if (hide) return false

  if (!featureFlag) return false

  if (!isExperimentOn(experiments)) return false

  if (wasDismissed()) return false

  return true
}

const ExchangePromoContainer = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(actions.experiments.fetch())
  }, [dispatch])

  const experimentsState = useSelector(selectors.experiments.get)
  const experiments = experimentsState.getOrElse({})

  const featureFlag = useSelector(selectors.core.walletOptions.getExchangePromoEnabled).getOrElse(
    false
  )

  const isUnified = useSelector(selectors.cache.getUnifiedAccountStatus)

  // State to hide it after clicks
  const [hide, setHide] = useState(false)

  const onClick = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: 'Exchange Awareness Prompt Clicked',
        properties: {
          current_origin: 'Wallet-Prompt',
          sso_user: !!isUnified
        }
      })
    )
    setHide(true)
    onDismiss()
    dispatch(actions.modules.profile.authAndRouteToExchangeAction(ExchangeAuthOriginType.SideMenu))
  }

  const onClose = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: 'Exchange Awareness Prompt Dismissed',
        properties: {
          current_origin: 'Wallet-Prompt',
          sso_user: !!isUnified
        }
      })
    )
    setHide(true)
    onDismiss()
  }

  const showCard = mustShow(hide, featureFlag, experiments)

  useEffect(() => {
    if (showCard) {
      dispatch(
        actions.analytics.trackEvent({
          key: 'Exchange Awareness Prompt Shown',
          properties: {
            current_origin: 'Wallet-Prompt',
            sso_user: !!isUnified,
            user_eligible_for_prompt: true
          }
        })
      )
    }
  }, [showCard])

  if (!showCard) return null

  return <ExchangePromo onClick={onClick} onClose={onClose} />
}

export default ExchangePromoContainer
