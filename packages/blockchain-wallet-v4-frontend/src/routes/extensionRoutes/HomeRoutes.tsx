import React from 'react'
import { connect } from 'react-redux'
import { NavLink, Route, Switch } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { actions } from 'data'
import BottomBarLayout from 'layouts/extension/BottomBarLayout'

import HistoryIcon from '../../icons/HistoryIcon'
import ListIcon from '../../icons/ListIcon'
import MoreIcon from '../../icons/MoreIcon'
import NFTIcon from '../../icons/NFTIcon'
import CoinView from '../../scenes/extension/CoinView'

const HomeNavbarItem = styled(NavLink)`
  display: block;
  position: relative;
  padding: 10px;

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
    bottom: 0px;
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
    <HomeNavbarItem exact to={`${path}`}>
      <ListIcon color='#fff' size={20} />
    </HomeNavbarItem>
    <HomeNavbarItem to={`${path}/activity`}>
      <HistoryIcon color='#fff' />
    </HomeNavbarItem>
    <HomeNavbarItem to={`${path}/nft`}>
      <NFTIcon color='#fff' />
    </HomeNavbarItem>
    <HomeNavbarItem to={`${path}/settings`}>
      <MoreIcon color='#fff' />
    </HomeNavbarItem>
  </HomeNavbarWrapper>
)

const HomeRoutes = (props) => {
  const { path } = props.match
  return (
    <BottomBarLayout footer={<HomeNavbar path={path} />}>
      <Switch>
        <Route path={`${path}`} exact component={CoinView} />
        <Route path={`${path}/activity`}>
          <Text color='white'>B</Text>
        </Route>
        <Route path={`${path}/nft`}>
          <Text color='white'>C</Text>
        </Route>
        <Route path={`${path}/settings`}>
          <Text color='white'>D</Text>
        </Route>
      </Switch>
    </BottomBarLayout>
  )
}

const mapDispatchToProps = (dispatch) => ({
  router: bindActionCreators(actions.router, dispatch)
})

export default connect(null, mapDispatchToProps)(HomeRoutes)
