import React from 'react'
import { useIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { IconPhone, IconRefresh, Navigation } from '@blockchain-com/constellation'

type Props = {
  selectedTab?: 'home' | 'prices' | 'earn' | 'nfts' | 'dex'
}

type RouterProps = {
  // TODO: Install proper version of history lib to import type
  history: { push: (to: string) => void }
}

const Header: React.FC<Props & RouterProps> = ({ history, selectedTab = 'home' }) => {
  const { formatMessage } = useIntl()
  return (
    <Navigation
      defaultSelected={selectedTab}
      onSelectedChange={(key) => {
        switch (key) {
          // primary nav
          case 'home':
            history.push('/home')
            break
          case 'prices':
            history.push('/prices')
            break
          case 'earn':
            history.push('/earn')
            break
          case 'nfts':
            history.push('/nfts')
            break
          case 'dex':
            history.push('/dex')
            break
          // dropdown nav
          case 'general':
            history.push('/settings/general')
            break
          case 'security':
            history.push('/security-center')
            break
          case 'preferences':
            history.push('/settings/preferences')
            break
          case 'wallets-addresses':
            history.push('/settings/addresses')
            break
          case 'tax-center':
            history.push('/tax-center')
            break
          // TODO: Handle the following clicks
          case 'refer-friend':
          case 'trading-limits':
            break
          default:
            break
        }
      }}
      dropdownCtaButton={{
        onClick: () => undefined,
        text: 'Dropdown CTA button'
      }}
      title={formatMessage({
        defaultMessage: 'Wallet',
        id: 'navbar.title.wallet'
      })}
      navigationTabs={[
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
        },
        {
          dot: true,
          key: 'nfts',
          label: formatMessage({
            defaultMessage: 'NFTs',
            id: 'navbar.primary.nfts'
          })
        },
        {
          dot: true,
          key: 'dex',
          label: formatMessage({
            defaultMessage: 'DEX',
            id: 'navbar.primary.dex'
          })
        }
      ]}
      dropdownSecondSectionItems={[
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
          key: 'refer-friend',
          label: formatMessage({
            defaultMessage: 'Refer a friend',
            id: 'navbar.dropdown.referFriend'
          })
        },
        {
          key: 'tax-center',
          label: formatMessage({
            defaultMessage: 'Tax Center',
            id: 'navbar.dropdown.taxCenter'
          })
        }
      ]}
      dropdownSecondSectionSeparator={{
        key: 'account',
        label: formatMessage({
          defaultMessage: 'Account',
          id: 'navbar.dropdown.separator'
        })
      }}
      iconActions={[
        {
          icon: () => <IconRefresh />,
          label: formatMessage({
            defaultMessage: 'Refresh',
            id: 'navbar.icons.refresh'
          }),
          // TODO: Handle refresh
          onClick: () => undefined
        },
        {
          // TODO: Handle app QR code dropdown
          icon: () => <IconPhone />,

          label: formatMessage({
            defaultMessage: 'Phone app',
            id: 'navbar.icons.phoneApp'
          }),
          onClick: () => undefined
        }
      ]}
      // TODO: Fetch correct information and handle a click
      walletButton={{
        id: '14qViLJfdGaP4EeHnDyJbEGQysnCpwk3gd',
        imgAlt: 'ETH',
        imgSrc:
          'https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/ZJZZK5B2ZNF25LYQHMUTBTOMLU.png',
        onClick: () => undefined
      }}
      // TODO: Pass real user details
      user={{
        name: 'John Doe',
        // TODO: Handle dropdown
        onClick: () => undefined
      }}
    />
  )
}

export const DexHeader = withRouter<Props>(Header)
