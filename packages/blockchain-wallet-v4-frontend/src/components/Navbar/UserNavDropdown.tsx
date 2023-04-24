import React, { useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { IconUser, PaletteColors } from '@blockchain-com/constellation'

import { Destination } from 'layouts/Wallet/components'
import { useOnClickOutside } from 'services/misc'

import { DropdownMenu, DropdownMenuArrow, DropdownMenuItem } from './Dropdown'
import { DropdownNavLink, NavButton } from './Navbar'

export const userNavItems = ({
  isKycVerificationEnabled,
  isReferralAvailable,
  isReferralRetrievalEnabled,
  limitsClickHandler,
  logoutClickHandler,
  referAFriendHandler,
  taxCenterClickHandler,
  trackEventCallback
}: Props) => [
  {
    clickHandler: () => {
      trackEventCallback('General')
    },
    copy: <FormattedMessage id='navbar.settings.general' defaultMessage='General' />,
    'data-e2e': 'settings_generalLink',
    to: '/settings/general'
  },
  {
    copy: <FormattedMessage id='buttons.security' defaultMessage='Security' />,
    'data-e2e': 'securityCenterLink',
    to: '/security-center'
  },
  {
    clickHandler: limitsClickHandler,
    copy: (
      <FormattedMessage id='layouts.wallet.header.tradinglimits' defaultMessage='Trading Limits' />
    ),
    'data-e2e': 'settings_profileLink',
    isHidden: !isKycVerificationEnabled
  },
  {
    clickHandler: () => {
      trackEventCallback('Preferences')
    },
    copy: <FormattedMessage id='layouts.wallet.header.preferences' defaultMessage='Preferences' />,
    'data-e2e': 'settings_preferencesLink',
    to: '/settings/preferences'
  },
  {
    clickHandler: () => {
      trackEventCallback('Preferences')
    },
    copy: (
      <FormattedMessage
        id='layouts.wallet.header.walletsaddresses'
        defaultMessage='Wallets & Addresses'
      />
    ),
    'data-e2e': 'settings_walletsLink',
    to: '/settings/addresses'
  },
  {
    clickHandler: referAFriendHandler,
    copy: (
      <FormattedMessage id='layouts.wallet.header.referafriend' defaultMessage='Refer a Friend' />
    ),
    'data-e2e': 'settings_referAFriend',
    isHidden: !(isReferralAvailable && isReferralRetrievalEnabled)
  },
  {
    clickHandler: taxCenterClickHandler,
    copy: <FormattedMessage id='navbar.tax' defaultMessage='Tax Center' />,
    'data-e2e': 'tax_CenterLink'
  },
  {
    clickHandler: logoutClickHandler,
    copy: <FormattedMessage id='layouts.wallet.header.Sign Out' defaultMessage='Sign Out' />,
    'data-e2e': 'logoutLink'
  }
]

const UserNavDropdown: React.FC<Props> = (props) => {
  const ref = useRef(null)
  const [isMenuOpen, toggleIsMenuOpen] = useState(false)
  useOnClickOutside(ref, () => toggleIsMenuOpen(false))

  const handleMenuToggle = () => {
    toggleIsMenuOpen((isMenuOpen) => !isMenuOpen)
  }

  return (
    <NavButton onClick={handleMenuToggle} data-e2e='settingsLink'>
      <IconUser color={PaletteColors['grey-400']} label='open-menu' size='small' />
      {isMenuOpen && (
        <DropdownMenu ref={ref}>
          <DropdownMenuArrow />
          {userNavItems({ ...props }).map(
            ({ clickHandler = () => {}, copy, 'data-e2e': e2e, isHidden = false, to }) => {
              if (isHidden) return
              if (!to) {
                return (
                  <DropdownMenuItem key={e2e} onClick={clickHandler} data-e2e={e2e}>
                    <Destination>{copy}</Destination>
                  </DropdownMenuItem>
                )
              }
              return (
                <DropdownNavLink key={e2e} to={to}>
                  <DropdownMenuItem data-e2e={e2e} onClick={clickHandler}>
                    <Destination>{copy}</Destination>
                  </DropdownMenuItem>
                </DropdownNavLink>
              )
            }
          )}
        </DropdownMenu>
      )}
    </NavButton>
  )
}

type Props = {
  isKycVerificationEnabled: boolean
  isReferralAvailable?: boolean
  isReferralRetrievalEnabled?: boolean
  limitsClickHandler: () => void
  logoutClickHandler: () => void
  referAFriendHandler: () => void
  taxCenterClickHandler: () => void
  trackEventCallback: (s: string) => void
}

export default UserNavDropdown
