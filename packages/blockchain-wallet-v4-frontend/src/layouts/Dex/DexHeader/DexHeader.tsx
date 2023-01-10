import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { IconPresent, IconRefresh, Navigation } from '@blockchain-com/constellation'

import { actions, selectors } from 'data'
import { ModalName } from 'data/types'
import { useRemote } from 'hooks'
import { notReachable } from 'utils/helpers'

import { AccountDropdown, NavbarWrapper } from './components'
import { useIsReferralAvailable, useUserAlias } from './hooks'
import type { AccountNavItems, AccountNavKeys, PrimaryNavItem, PrimaryNavKeys } from './types'

type Props = {
  selectedTab?: PrimaryNavKeys
}

export const DexHeader: React.FC<Props> = ({ selectedTab = 'home' }) => {
  const dispatch = useDispatch()
  const { formatMessage } = useIntl()

  const isReferralAvailable = useIsReferralAvailable()
  const isDexEnabled = useSelector(selectors.core.walletOptions.getDexProductEnabled)
  const isNftExplorerEnabled = useSelector(selectors.core.walletOptions.getNftExplorer)
  const { data: userData } = useRemote(selectors.modules.profile.getUserData)

  const userAlias = useUserAlias(userData || { email: '' })
  const [isAccountDropdownVisible, setIsAccountDropdownVisible] = useState(false)

  const onReferFriendClick = () => {
    dispatch(
      actions.modals.showModal(ModalName.REFERRAL_LANDING_MODAL, {
        origin: 'Header'
      })
    )
    dispatch(actions.modules.settings.generalSettingsInternalRedirect('Referral'))
  }

  const onClickNavItem = (key: PrimaryNavKeys | AccountNavKeys) => {
    switch (key) {
      // primary nav
      case 'home':
        dispatch(actions.router.push('/home'))
        break
      case 'prices':
        dispatch(actions.router.push('/prices'))
        break
      case 'earn':
        dispatch(actions.router.push('/earn'))
        break
      case 'nfts':
        dispatch(actions.router.push('/nfts'))
        break
      case 'dex':
        dispatch(actions.router.push('/dex'))
        break
      // dropdown nav
      case 'general':
        dispatch(actions.modules.settings.generalSettingsInternalRedirect('General'))
        dispatch(actions.router.push('/settings/general'))
        break
      case 'security':
        dispatch(actions.router.push('/security-center'))
        break
      case 'preferences':
        dispatch(actions.modules.settings.generalSettingsInternalRedirect('Preferences'))
        dispatch(actions.router.push('/settings/preferences'))
        break
      case 'wallets-addresses':
        dispatch(actions.router.push('/settings/addresses'))
        break
      case 'tax-center':
        dispatch(actions.router.push('/tax-center'))
        break
      case 'refer-friend':
        onReferFriendClick()
        break
      case 'trading-limits':
        dispatch(
          actions.modals.showModal(ModalName.TRADING_LIMITS_MODAL, {
            origin: 'Header'
          })
        )
        dispatch(actions.modules.settings.generalSettingsInternalRedirect('TradingLimits'))
        break
      case 'sign-out':
        dispatch(actions.session.logout())
        break
      default:
        notReachable(key)
    }
  }

  const navigationTabs: PrimaryNavItem[] = [
    {
      key: 'home',
      label: formatMessage({
        defaultMessage: 'Home',
        id: 'navbar.primary.home'
      })
    },
    {
      key: 'prices',
      label: formatMessage({
        defaultMessage: 'Prices',
        id: 'navbar.primary.prices'
      })
    },
    {
      dot: true,
      key: 'earn',
      label: formatMessage({
        defaultMessage: 'Earn',
        id: 'navbar.primary.earn'
      })
    }
  ]

  if (isNftExplorerEnabled) {
    navigationTabs.push({
      dot: true,
      key: 'nfts',
      label: formatMessage({
        defaultMessage: 'NFTs',
        id: 'navbar.primary.nfts'
      })
    })
  }

  if (isDexEnabled) {
    navigationTabs.push({
      dot: true,
      key: 'dex',
      label: formatMessage({
        defaultMessage: 'DEX',
        id: 'navbar.primary.dex'
      })
    })
  }

  const accountDropdownItems: AccountNavItems[] = [
    {
      key: 'general',
      label: formatMessage({
        defaultMessage: 'General',
        id: 'navbar.dropdown.general'
      })
    },
    {
      key: 'security',
      label: formatMessage({
        defaultMessage: 'Security',
        id: 'navbar.dropdown.security'
      })
    },
    {
      key: 'trading-limits',
      label: formatMessage({
        defaultMessage: 'Trading Limits',
        id: 'navbar.dropdown.tradingLimits'
      })
    },
    {
      key: 'preferences',
      label: formatMessage({
        defaultMessage: 'Preferences',
        id: 'navbar.dropdown.preferences'
      })
    },
    {
      key: 'wallets-addresses',
      label: formatMessage({
        defaultMessage: 'Wallets & Addresses',
        id: 'navbar.dropdown.walletsAndAddresses'
      })
    },
    {
      key: 'tax-center',
      label: formatMessage({
        defaultMessage: 'Tax Center',
        id: 'navbar.dropdown.taxCenter'
      })
    }
  ]

  const iconActions = [
    {
      icon: () => <IconRefresh />,
      label: formatMessage({
        defaultMessage: 'Refresh',
        id: 'navbar.icons.refresh'
      }),
      onClick: () => {
        dispatch(actions.components.refresh.refreshClicked())
      }
    }
  ]

  if (isReferralAvailable) {
    accountDropdownItems.push({
      key: 'refer-friend',
      label: formatMessage({
        defaultMessage: 'Refer a friend',
        id: 'navbar.dropdown.referFriend'
      })
    })

    iconActions.push({
      icon: () => <IconPresent />,
      label: formatMessage({
        defaultMessage: 'Refer',
        id: 'navbar.icons.refer'
      }),
      onClick: onReferFriendClick
    })
  }

  return (
    <NavbarWrapper>
      <Navigation
        defaultSelected={selectedTab}
        iconActions={iconActions}
        navigationTabs={navigationTabs}
        dropdownSecondSectionItems={accountDropdownItems}
        // TODO: Add type support to constellation
        onSelectedChange={(key) => onClickNavItem(key as any)}
        dropdownCtaButton={{
          onClick: () => onClickNavItem('sign-out'),
          text: formatMessage({
            defaultMessage: 'Sign out',
            id: 'navbar.dropdown.signOut'
          })
        }}
        title={formatMessage({
          defaultMessage: 'Wallet',
          id: 'navbar.title.wallet'
        })}
        dropdownSecondSectionSeparator={{
          key: 'account',
          label: formatMessage({
            defaultMessage: 'Account',
            id: 'navbar.dropdown.separator'
          })
        }}
        // TODO: Fetch correct information and handle a click
        walletButton={{
          id: '14qViLJfdGaP4EeHnDyJbEGQysnCpwk3gd',
          imgAlt: 'ETH',
          imgSrc:
            'https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/ZJZZK5B2ZNF25LYQHMUTBTOMLU.png',
          onClick: () => undefined
        }}
        user={{
          name: userAlias,
          onClick: () => setIsAccountDropdownVisible((prev) => !prev)
        }}
      />
      {/* TODO: Remove when migrated to a separate Account Settings screen */}
      {isAccountDropdownVisible ? (
        <AccountDropdown
          navItems={accountDropdownItems}
          onClickNavItem={onClickNavItem}
          onClose={() => setIsAccountDropdownVisible(false)}
        />
      ) : null}
    </NavbarWrapper>
  )
}
