import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { NavDropdown } from 'react-bootstrap'

import { MenuItem } from 'blockchain-info-components'

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
        <FormattedMessage id='components.layouts.wallet.header.exploremenu.home' defaultMessage='Home' />
      </MenuItem>
      <MenuItem href='https://blockchain.info/charts'>
        <FormattedMessage id='components.layouts.wallet.header.exploremenu.charts' defaultMessage='Charts' />
      </MenuItem>
      <MenuItem href='https://blockchain.info/stats'>
        <FormattedMessage id='components.layouts.wallet.header.exploremenu.stats' defaultMessage='Stats' />
      </MenuItem>
      <MenuItem href='https://blockchain.info/markets'>
        <FormattedMessage id='components.layouts.wallet.header.exploremenu.markets' defaultMessage='Markets' />
      </MenuItem>
      <MenuItem href='https://blockchain.info/api'>
        <FormattedMessage id='components.layouts.wallet.header.exploremenu.api' defaultMessage='Api' />
      </MenuItem>
    </NavItemDropdown>
  )
}

export default ExploreMenu
