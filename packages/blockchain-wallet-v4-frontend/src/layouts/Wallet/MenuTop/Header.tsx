import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'

import { Navbar } from 'components/Navbar'
import { Analytics, ModalName } from 'data/types'

import { Props } from '.'

type OwnProps = Props & {
  history: { push: (path: string) => void }
}

const Header = (props: OwnProps) => {
  const refreshCallback = useCallback(() => {
    props.refreshActions.refreshClicked()
  }, [props.refreshActions])

  const logoutCallback = useCallback(() => {
    props.sessionActions.logout()
  }, [props.sessionActions])

  const sendCallback = useCallback(() => {
    props.modalActions.showModal(ModalName.SEND_CRYPTO_MODAL, { origin: 'Header' })
  }, [props.modalActions])

  const receiveCallback = useCallback(() => {
    props.modalActions.showModal(ModalName.REQUEST_CRYPTO_MODAL, { origin: 'FeaturesTopNav' })
  }, [props.modalActions])

  const fabCallback = useCallback(() => {
    props.modalActions.showModal(ModalName.TRADE_MODAL, {
      origin: 'Header'
    })
  }, [props.modalActions])

  const trackEventCallback = useCallback(
    (eventName) => {
      props.settingsActions.generalSettingsInternalRedirect(eventName)
    },
    [props.settingsActions]
  )

  const limitsCallback = useCallback(() => {
    props.modalActions.showModal(ModalName.TRADING_LIMITS_MODAL, {
      origin: 'TradingLimits'
    })
    trackEventCallback('TradingLimits')
  }, [props.modalActions, trackEventCallback])

  const taxCenterCallback = useCallback(() => {
    props.history.push('/tax-center')

    props.analyticsActions.trackEvent({
      key: Analytics.TAX_CENTER_CLICKED,
      properties: {
        origin: 'SETTINGS'
      }
    })
  }, [props.analyticsActions, props.history])

  const primaryNavItems = [
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
      dest: '/rewards',
      e2e: 'rewardsLink',
      text: <FormattedMessage id='copy.rewards' defaultMessage='Rewards' />
    }
  ]

  if (props.invitations.nftBuySell) {
    primaryNavItems.push({
      dest: '/nfts/view',
      e2e: 'nftsLink',
      text: <FormattedMessage id='layouts.wallet.menuleft.navigation.nfts' defaultMessage='NFTs' />
    })
  }

  if (props.walletDebitCardEnabled) {
    primaryNavItems.push({
      dest: '/debit-card',
      e2e: 'debitCardLink',
      text: <FormattedMessage id='copy.card' defaultMessage='Card' />
    })
  }

  return (
    <Navbar
      primaryNavItems={primaryNavItems}
      fabClickHandler={fabCallback}
      isReferralAvailable={props.isReferralAvailable}
      isReferralRetrievalEnabled={props.featureFlags.isReferralRetrievalEnabled}
      limitsClickHandler={limitsCallback}
      logoutClickHandler={logoutCallback}
      nftsEnabled={props.nftsEnabled}
      primaryNavItems={PrimaryNavItems}
      receiveClickHandler={receiveCallback}
      refreshClickHandler={refreshCallback}
      sendClickHandler={sendCallback}
      taxCenterClickHandler={taxCenterCallback}
      trackEventCallback={trackEventCallback}
    />
  )
}

export default Header
