import React from 'react'
import styled from 'styled-components'

import { NavDropdown, MenuItem } from 'components/generic/Navbar'
import { Text } from 'components/generic/Text'

const NavItemDropdown = styled(NavDropdown)`
  & > a {
    font-size: 0.9rem;
    font-weight: 300;
  }
`

const ExploreMenu = (props) => {
  return (
    <NavItemDropdown id='explore_menu' title='Explore'>
      <MenuItem href='https://blockchain.info'>
        <Text id='components.layouts.wallet.header.exploremenu.home' text='Home' />
      </MenuItem>
      <MenuItem href='https://blockchain.info/charts'>
        <Text id='components.layouts.wallet.header.exploremenu.charts' text='Charts' />
      </MenuItem>
      <MenuItem href='https://blockchain.info/stats'>
        <Text id='components.layouts.wallet.header.exploremenu.stats' text='Stats' />
      </MenuItem>
      <MenuItem href='https://blockchain.info/markets'>
        <Text id='components.layouts.wallet.header.exploremenu.markets' text='Markets' />
      </MenuItem>
      <MenuItem href='https://blockchain.info/api'>
        <Text id='components.layouts.wallet.header.exploremenu.api' text='Api' />
      </MenuItem>
    </NavItemDropdown>
  )
}

export default ExploreMenu
