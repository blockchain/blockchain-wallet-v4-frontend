import PropTypes from 'prop-types'
import React from 'react'
import styled, { css, keyframes } from 'styled-components'

import { NavbarNavItemIcon, NavbarNavItemTextLink } from 'components/Navbar'
import { TooltipHost } from 'blockchain-info-components'

const rotation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const animationRule = css`
  animation: ${/* sc-property */ rotation} 0.5s linear;
`

export const SpinningIcon = styled(NavbarNavItemIcon)<{ rotating: boolean }>`
  margin-right: 0px;
  ${({ rotating }) => rotating && animationRule};
`

const Refresh = ({ handleRefresh, rotating }) => (
  <TooltipHost id='refresh.tooltip'>
    <NavbarNavItemTextLink
      size='14px'
      weight={400}
      color='whiteFade900'
      uppercase
      onClick={handleRefresh}
      data-e2e='refreshLink'
    >
      <SpinningIcon
        name='refresh'
        size='24px'
        color='whiteFade900'
        cursor
        rotating={rotating}
      />
    </NavbarNavItemTextLink>
  </TooltipHost>
)

Refresh.propTypes = {
  handleRefresh: PropTypes.func.isRequired
}

export default Refresh
