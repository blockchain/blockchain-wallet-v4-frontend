import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { getInvitations } from '@core/redux/settings/selectors'
import { getDexProductEnabled } from '@core/redux/walletOptions/selectors'
import { InvitationsType } from '@core/types'
import { Navbar } from 'components/Navbar'
import { PrimaryNavItem } from 'components/Navbar/Navbar'
import { modals } from 'data/actions'
import { trackEvent } from 'data/analytics/slice'
import { isDebitCardModuleEnabledForAccount } from 'data/components/debitCard/selectors'
import { getIsUserEligible } from 'data/components/dex/selectors'
import { generalSettingsInternalRedirect } from 'data/modules/settings/actions'
import { logout } from 'data/session/slice'
import { Analytics, ModalName } from 'data/types'

type Props = {
  history: { push: (path: string) => void }
}

const Header = ({ history }: Props) => {
  const invitations = useSelector(getInvitations).getOrElse({} as InvitationsType)
  const isDexEligible = useSelector(getIsUserEligible).getOrElse(false)
  const walletDebitCardEnabled = useSelector(isDebitCardModuleEnabledForAccount)
  const isDexEnabled = useSelector(getDexProductEnabled).getOrElse(false) as boolean

  const dispatch = useDispatch()

  const logoutCallback = useCallback(() => {
    dispatch(
      trackEvent({
        key: Analytics.LOGIN_SIGNED_OUT,
        properties: {
          origin: 'SETTINGS',
          site_redirect: 'WALLET'
        }
      })
    )
    dispatch(logout())
  }, [])

  const trackEventCallback = useCallback((eventName) => {
    dispatch(generalSettingsInternalRedirect(eventName))
  }, [])

  const limitsCallback = useCallback(() => {
    dispatch(modals.showModal(ModalName.TRADING_LIMITS_MODAL, { origin: 'Header' }))
    trackEventCallback('TradingLimits')
  }, [trackEventCallback])

  const referAFriendCallback = useCallback(() => {
    dispatch(modals.showModal(ModalName.REFERRAL_LANDING_MODAL, { origin: 'Header' }))
    trackEventCallback('Referral')
  }, [trackEventCallback])

  const taxCenterCallback = useCallback(() => {
    history.push('/tax-center')

    dispatch(
      trackEvent({
        key: Analytics.TAX_CENTER_CLICKED,
        properties: {
          origin: 'SETTINGS'
        }
      })
    )
  }, [history])

  const primaryNavItems: PrimaryNavItem[] = [
    {
      dest: '/home',
      e2e: 'homeLink',
      text: <FormattedMessage id='copy.home' defaultMessage='Home' />
    },
    {
      dest: '/prices',
      e2e: 'pricesLink',
      text: <FormattedMessage id='copy.prices' defaultMessage='Prices' />
    },
    {
      dest: '/earn',
      e2e: 'earnLink',
      text: <FormattedMessage id='copy.earn' defaultMessage='Earn' />
    }
  ]

  if (invitations.nftBuySell) {
    primaryNavItems.push({
      dest: '/nfts/view',
      e2e: 'nftsLink',
      text: <FormattedMessage id='layouts.wallet.menuleft.navigation.nfts' defaultMessage='NFTs' />
    })
  }

  if (walletDebitCardEnabled) {
    primaryNavItems.push({
      dest: '/debit-card',
      e2e: 'debitCardLink',
      text: <FormattedMessage id='copy.card' defaultMessage='Card' />
    })
  }

  if (isDexEnabled && isDexEligible) {
    primaryNavItems.push({
      dest: '/dex',
      e2e: 'dexLink',
      isNew: true,
      text: <FormattedMessage id='copy.dex' defaultMessage='DEX' />
    })
  }

  return (
    <Navbar
      primaryNavItems={primaryNavItems}
      limitsClickHandler={limitsCallback}
      referAFriendHandler={referAFriendCallback}
      logoutClickHandler={logoutCallback}
      taxCenterClickHandler={taxCenterCallback}
      trackEventCallback={trackEventCallback}
    />
  )
}

export default withRouter(Header)
