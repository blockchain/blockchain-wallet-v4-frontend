import React from 'react'
import { connect } from 'react-redux'
import { NavLink, Route, Switch } from 'react-router-dom'
import { IconHistory, IconListBullets, IconNft } from '@blockchain-com/icons'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { actions } from 'data'

// FIXME:
// eslint-disable-next-line import/no-named-as-default
import CoinView from '../../scenes/plugin/CoinView'

const HomeNavbarItem = styled(NavLink)`
  display: block;
  position: relative;
  padding: 10px;
  font-size: 24px;
  color: #fff;
  &:not(:first-child),
  &:not(:last-child) {
    margin: 0 10px;
  }
  transition: 0.3s ease-in;
  &:after {
    content: '';
    height: 5px;
    width: 5px;
    background: transparent;
    transition: 0.3s ease-in;
    border-radius: 50%;
    position: absolute;
    bottom: 0;
    left: calc(50% - 2.5px);
  }
  &.active {
    margin-top: -3px;
  }
  &.active:after {
    background: #ffffff;
  }
`

const HomeNavbarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const HomeNavbar = ({ path }: { path: string }) => (
  <HomeNavbarWrapper>
    <HomeNavbarItem exact to='/plugin'>
      <IconListBullets />
    </HomeNavbarItem>
    <HomeNavbarItem to='/plugin/activity'>
      <IconHistory />
    </HomeNavbarItem>
    <HomeNavbarItem to='/plugin/nft'>
      <IconNft />
    </HomeNavbarItem>
  </HomeNavbarWrapper>
)

export default HomeNavbar
