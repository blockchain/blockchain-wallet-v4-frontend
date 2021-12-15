import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'

import { Navbar } from 'components/NavbarV2'
import { ModalName } from 'data/types'
import { useMedia } from 'services/styles'

import { Props } from '.'
import Large from './template.large'
import Medium from './template.medium'
import Small from './template.small'

type OwnProps = Props & { handleToggle: () => void }

const Header = (props: OwnProps) => {
  const isLaptop = useMedia('laptop')
  const isTablet = useMedia('tablet')

  const refreshCallback = useCallback(() => {
    props.refreshActions.refreshClicked()
  }, [])

  const logoutCallback = useCallback(() => {
    props.sessionActions.logout()
  }, [])

  const fabCallback = useCallback(() => {
    props.modalActions.showModal(ModalName.TRADE_MODAL, {
      origin: 'Header'
    })
  }, [])

  const limitsCallback = useCallback(() => {
    props.modalActions.showModal(ModalName.TRADING_LIMITS_MODAL, {
      origin: 'TradingLimits'
    })
    props.settingsActions.generalSettingsInternalRedirect('TradingLimits')
  }, [])

  const PrimaryNavItems = [
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

  if (props.featureFlags.nfts) {
    PrimaryNavItems.push({
      dest: '/nfts',
      e2e: 'nftsLink',
      text: <FormattedMessage id='layouts.wallet.menuleft.navigation.nfts' defaultMessage='NFTs' />
    })
  }

  if (props.featureFlags.daaps) {
    PrimaryNavItems.push({
      dest: '/daaps',
      e2e: 'daapsLink',
      text: <FormattedMessage id='copy.daaps' defaultMessage='Daaps' />
    })
  }

  if (props.isRedesignEnabled) {
    return (
      <Navbar
        primaryNavItems={PrimaryNavItems}
        fabClickHandler={fabCallback}
        refreshClickHandler={refreshCallback}
        limitsClickHandler={limitsCallback}
        logoutClickHandler={logoutCallback}
      />
    )
  }
  return (
    <>{isTablet ? <Small {...props} /> : isLaptop ? <Medium {...props} /> : <Large {...props} />}</>
  )
}

export default Header
