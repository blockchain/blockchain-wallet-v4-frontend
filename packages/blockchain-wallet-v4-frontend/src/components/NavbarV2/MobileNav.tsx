import React from 'react'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'

import FlyoutContainer from '../Flyout/Container'
import FlyoutContent from '../Flyout/Content'
import FlyoutFooter from '../Flyout/Footer'
import FlyoutHeader from '../Flyout/Header'
import { CheckoutRow } from '../Rows'
import { PrimaryNavItem } from './Navbar'

const MobileNavList = styled.ul`
  margin: 0;
  padding: 0;
`

const StyledLi = styled.li`
  list-style-type: none;
  padding: 12px 8px;
  margin: 10px 8px;

  & a {
    text-decoration: none;
  }
`

const NavAccount = styled(Text)`
  padding: 24px 16px 0;
`

const MobileNav = ({
  handleClose,
  primaryNavItems,
  secondaryNavItems,
  tertiaryNavItems
}: Props) => {
  const clickAndClose = (clickHandler: () => void = () => {}) => {
    return () => {
      clickHandler()
      handleClose()
    }
  }
  const logoutInfo = tertiaryNavItems.pop()
  return (
    <div
      style={{
        backgroundColor: 'white',
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 99999
      }}
    >
      <FlyoutContainer>
        <FlyoutHeader mode='close' data-e2e='MobileNavFlyout' onClick={handleClose} />
        <FlyoutContent mode='top'>
          <MobileNavList>
            {primaryNavItems.map((item: PrimaryNavItem) => (
              <StyledLi key={item.e2e}>
                <div role='button' tabIndex={0} onClick={handleClose} onKeyDown={handleClose}>
                  <NavLink to={item.dest} data-e2e={item.e2e}>
                    <Text color='grey900' size='14px' weight={600}>
                      {item.text}
                    </Text>
                  </NavLink>
                </div>
              </StyledLi>
            ))}
          </MobileNavList>
          <NavAccount size='12px' color='grey600' weight={600} uppercase>
            <FormattedMessage id='copy.account' defaultMessage='Account' />
          </NavAccount>
          <MobileNavList>
            {tertiaryNavItems.map(({ clickHandler, copy, 'data-e2e': e2e, to }) => (
              <StyledLi key={to}>
                {to ? (
                  <div role='button' tabIndex={0} onClick={handleClose} onKeyDown={handleClose}>
                    <NavLink to={to} data-e2e={e2e}>
                      <Text color='grey900' size='14px' weight={600}>
                        {copy}
                      </Text>
                    </NavLink>
                  </div>
                ) : (
                  <div
                    role='button'
                    tabIndex={0}
                    onClick={clickAndClose(clickHandler)}
                    onKeyDown={clickHandler}
                  >
                    <Text color='grey900' size='14px' weight={600}>
                      {copy}
                    </Text>
                  </div>
                )}
              </StyledLi>
            ))}
          </MobileNavList>
        </FlyoutContent>
        <FlyoutFooter collapsed>
          {logoutInfo && (
            <Button
              data-e2e={logoutInfo['data-e2e']}
              nature='light-red'
              fullwidth
              onClick={logoutInfo.clickHandler}
            >
              {logoutInfo.copy}
            </Button>
          )}
        </FlyoutFooter>
      </FlyoutContainer>
    </div>
  )
}

type Props = {
  handleClose: () => void
  primaryNavItems: PrimaryNavItem[]
  secondaryNavItems: { clickHandler?: () => void; component: React.ReactNode; name: string }[]
  tertiaryNavItems: (
    | {
        clickHandler: () => void
        copy: React.ReactNode
        'data-e2e': string
        to?: never
      }
    | {
        clickHandler?: never
        copy: React.ReactNode
        'data-e2e': string
        to: string
      }
  )[]
}
export default MobileNav
