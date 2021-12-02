import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import FabButton from 'components/FabButton'
import { media } from 'services/styles'

export type PrimaryNavItem = {
  dest: string
  e2e: string
  text: string | React.ReactNode
}

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #f0f2f7;
  height: 56px;

  ${media.mobile`
    // handle mobile navbar
  `}
`

const Logo = styled.div`
  display: flex;
  align-items: center;

  & > a {
    color: #3d89f5;
    text-decoration: none;
  }
`

const NavLeft = styled.div`
  display: flex;
  align-items: stretch;
`

const NavRight = styled.div`
  display: flex;
  align-items: stretch;
`

const ListStyles = styled.ul`
  list-style: none;
  display: flex;
  align-items: stretch;
  margin: 0;
  padding: 0 0 0 24px;

  & > li {
    display: flex;
    align-items: center;
    padding: 10px 12px;
  }

  & a {
    text-decoration: none;
    color: #677184;
    border-radius: 4px;
    padding: 10px;
    transition: background-color 0.3s, color 0.3s;

    &:hover,
    &.active {
      background-color: #ecf5fe;
      color: #0c6cf2;
    }
  }
`

const PrimaryNavItems = styled(ListStyles)`
  cursor: pointer;
`

const SecondaryNavItems = styled(ListStyles)`
  cursor: pointer;
`

const NavButton = styled(Button)`
  display: flex;
  align-items: center;
  position: relative;
  transition: color 0.3s;
  background: transparent;
  min-width: auto;
  width: auto;
  padding: 0;
  border: 0;

  &:hover {
    background-color: transparent;
  }
`

const Navbar = ({ primaryNavItems }: Props) => {
  return (
    <NavContainer>
      <NavLeft>
        <Logo>
          <NavLink to='/home' data-e2e='homeLink'>
            <Icon color='#3D89F5' name='blockchain-logo' size='35px' />
          </NavLink>
        </Logo>
        <PrimaryNavItems>
          {primaryNavItems.map((item: PrimaryNavItem) => (
            <li key={item.e2e}>
              <NavLink to={item.dest} data-e2e={item.e2e}>
                <Text size='14px' weight={600}>
                  {item.text}
                </Text>
              </NavLink>
            </li>
          ))}
        </PrimaryNavItems>
      </NavLeft>
      <NavRight>
        <SecondaryNavItems>
          <li>
            <FabButton />
          </li>
          <li>
            <NavButton data-e2e='mobileQRLink'>
              <Icon color='#98A1B2' name='mobile' size='15px' />
            </NavButton>
          </li>
          <li>
            <NavButton data-e2e='refreshLink'>
              <Icon color='#F0F2F7' name='refresh' size='23px' />
            </NavButton>
          </li>
          <li>
            <NavButton data-e2e='settingsLink'>
              <Icon color='#98A1B2' name='user' size='15px' />
            </NavButton>
          </li>
        </SecondaryNavItems>
      </NavRight>
    </NavContainer>
  )
}

type Props = {
  primaryNavItems: Array<PrimaryNavItem>
}

export default Navbar
