import React, { useCallback, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'

import { Navbar } from 'components/Navbar'
import { PrimaryNavItem } from 'components/Navbar/Navbar'
import { selectors } from 'data'
import { Analytics, ModalName } from 'data/types'
import { useRemote } from 'hooks'

import { Props } from '.'

type OwnProps = Props & {
  history: { push: (path: string) => void }
}

const Header = (props: OwnProps) => {
  const { data } = useRemote(selectors.modules.profile.getCurrentTier)
  const isGoldVerified = useMemo(() => data === 2, [data])
  const {
    analyticsActions,
    featureFlags,
    history,
    invitations,
    isDexEligible,
    isKycVerificationEnabled,
    isReferralAvailable,
    isReferralEnabled,
    modalActions,
    refreshActions,
    sessionActions,
    settingsActions,
    walletDebitCardEnabled
  } = props
  const refreshCallback = useCallback(() => {
    refreshActions.refreshClicked()
  }, [refreshActions])

  const logoutCallback = useCallback(() => {
    sessionActions.logout()
  }, [sessionActions])

  const sendCallback = useCallback(() => {
    modalActions.showModal(ModalName.SEND_CRYPTO_MODAL, { origin: 'Header' })
  }, [modalActions])

  const receiveCallback = useCallback(() => {
    modalActions.showModal(ModalName.REQUEST_CRYPTO_MODAL, { origin: 'FeaturesTopNav' })
  }, [modalActions])

  const fabCallback = useCallback(() => {
    analyticsActions.trackEvent({
      key: Analytics.FAB_CLICKED,
      properties: {}
    })
    modalActions.showModal(ModalName.TRADE_MODAL, {
      origin: 'Header'
    })
  }, [modalActions, analyticsActions])

  const trackEventCallback = useCallback(
    (eventName) => {
      settingsActions.generalSettingsInternalRedirect(eventName)
    },
    [settingsActions]
  )

  const limitsCallback = useCallback(() => {
    modalActions.showModal(ModalName.TRADING_LIMITS_MODAL, {
      origin: 'Header'
    })
    trackEventCallback('TradingLimits')
  }, [modalActions, trackEventCallback])

  const referAFriendCallback = useCallback(() => {
    modalActions.showModal(ModalName.REFERRAL_LANDING_MODAL, {
      origin: 'Header'
    })
    trackEventCallback('Referral')
  }, [modalActions, trackEventCallback])

  const taxCenterCallback = useCallback(() => {
    history.push('/tax-center')

    analyticsActions.trackEvent({
      key: Analytics.TAX_CENTER_CLICKED,
      properties: {
        origin: 'SETTINGS'
      }
    })
  }, [analyticsActions, history])

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

  if (featureFlags.dex && isDexEligible) {
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
      fabClickHandler={fabCallback}
      isReferralAvailable={!!isReferralAvailable && isGoldVerified && isReferralEnabled}
      isReferralRetrievalEnabled={featureFlags.isReferralRetrievalEnabled}
      limitsClickHandler={limitsCallback}
      referAFriendHandler={referAFriendCallback}
      logoutClickHandler={logoutCallback}
      isKycVerificationEnabled={isKycVerificationEnabled}
      receiveClickHandler={receiveCallback}
      refreshClickHandler={refreshCallback}
      sendClickHandler={sendCallback}
      taxCenterClickHandler={taxCenterCallback}
      trackEventCallback={trackEventCallback}
    />
  )
}

export default Header
