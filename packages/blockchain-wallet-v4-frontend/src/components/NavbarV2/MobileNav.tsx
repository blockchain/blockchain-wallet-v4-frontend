import React from 'react'
import { FormattedMessage } from 'react-intl'
import { NavLink, withRouter } from 'react-router-dom'
import { colors, Icon, IconName } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { FlyoutContainer, FlyoutContent, FlyoutFooter } from 'components/Flyout/Layout'

import { PrimaryNavItem } from './Navbar'

const MobileNavList = styled.ul`
  margin: 0;
  padding: 0;
`

const StyledLi = styled.li<{ selected?: boolean }>`
  list-style-type: none;

  & a {
    text-decoration: none;
  }

  > div {
    padding: 16px 8px;
    margin: 10px 8px;
  }

  background: ${({ selected }) => (selected ? colors.blue0 : '')};

  &:hover {
    background: ${colors.blue0};
  }
`

const NavAccount = styled(Text)`
  padding: 24px 16px 0;
`

const StyledNavLink = styled(NavLink)`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

const MobileNav = ({ handleClose, location, primaryNavItems, tertiaryNavItems }: Props) => {
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
        top: '56px',
        zIndex: 99999
      }}
    >
      <FlyoutContainer>
        <FlyoutContent mode='top'>
          <MobileNavList>
            {primaryNavItems.map((item: PrimaryNavItem) => (
              <StyledLi key={item.e2e} selected={location.pathname.includes(item.dest)}>
                <div role='button' tabIndex={0} onClick={handleClose} onKeyDown={handleClose}>
                  <StyledNavLink to={item.dest} data-e2e={item.e2e}>
                    <Text color='grey900' size='14px' weight={600}>
                      {item.text}
                    </Text>
                    {location?.pathname?.includes(item.dest) && (
                      <Icon name={IconName.CHECK_CIRCLE} color={colors.blue600} size='sm' />
                    )}
                  </StyledNavLink>
                </div>
              </StyledLi>
            ))}
          </MobileNavList>
          <NavAccount size='12px' color='grey600' weight={600} uppercase>
            <FormattedMessage id='copy.account' defaultMessage='Account' />
          </NavAccount>
          <MobileNavList>
            {tertiaryNavItems.map(({ clickHandler, copy, 'data-e2e': e2e, to }) => (
              <StyledLi key={to} selected={to ? location?.pathname?.includes(to) : false}>
                {to ? (
                  <div role='button' tabIndex={0} onClick={handleClose} onKeyDown={handleClose}>
                    <StyledNavLink to={to} data-e2e={e2e}>
                      <Text color='grey900' size='14px' weight={600}>
                        {copy}
                      </Text>
                      {location?.pathname?.includes(to) && (
                        <Icon name={IconName.CHECK_CIRCLE} color={colors.blue600} size='sm' />
                      )}
                    </StyledNavLink>
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
  location: { pathname: string; search: string }
  primaryNavItems: PrimaryNavItem[]
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

export default withRouter(MobileNav)
