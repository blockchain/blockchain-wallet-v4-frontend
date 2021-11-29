import React from 'react'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

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

const Logo = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #3d89f5;
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

    &:hover {
      background-color: #ecf5fe;
      color: #0c6cf2;
    }
  }
`

const PrimaryNavItems = styled(ListStyles)``

const SecondaryNavItems = styled(ListStyles)``

const Navbar = () => {
  return (
    <NavContainer>
      <NavLeft>
        <Logo href='/'>
          <Icon color='#3D89F5' name='blockchain-logo' size='30px' />
        </Logo>
        <PrimaryNavItems>
          <li>
            <Text size='14px' weight={600}>
              <a href=''>Home</a>
            </Text>
          </li>
          <li>
            <Text size='14px' weight={600}>
              <a href=''>Prices</a>
            </Text>
          </li>
          <li>
            <Text size='14px' weight={600}>
              <a href=''>Rewards</a>
            </Text>
          </li>
          <li>
            <Text size='14px' weight={600}>
              <a href=''>NFTs</a>
            </Text>
          </li>
        </PrimaryNavItems>
      </NavLeft>
      <NavRight>
        <SecondaryNavItems>
          <li>
            <Text size='14px' weight={600}>
              <a href=''>Trade</a>
            </Text>
          </li>
          <li>
            <Text size='14px' weight={600}>
              <a href=''>Mobile</a>
            </Text>
          </li>
          <li>
            <Text size='14px' weight={600}>
              <a href=''>Refresh</a>
            </Text>
          </li>
          <li>
            <Text size='14px' weight={600}>
              <a href=''>Settings</a>
            </Text>
          </li>
        </SecondaryNavItems>
      </NavRight>
    </NavContainer>
  )
}

type Props = {}

export default Navbar
