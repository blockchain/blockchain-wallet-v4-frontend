import React from 'react'
import PropTypes from 'prop-types'
import styled, { css, keyframes } from 'styled-components'

import {
  NavbarNavItem,
  NavbarNavItemButton,
  NavbarNavItemIcon
} from 'components/Navbar'

const rotation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const animationRule = css`
  animation: ${/* sc-property */ rotation} 0.5s linear;
`

export const SpinningIcon = styled(NavbarNavItemIcon)<{ rotating: boolean }>`
  margin-top: 2px;
  margin-right: 0px;
  display: initial !important;
  ${({ rotating }) => rotating && animationRule};
`

const Refresh = ({ handleRefresh, rotating }) => (
  <NavbarNavItem>
    <NavbarNavItemButton
      size='14px'
      uppercase
      onClick={handleRefresh}
      data-e2e='refreshLink'
    >
      <SpinningIcon name='refresh' size='24px' rotating={rotating} />
    </NavbarNavItemButton>
  </NavbarNavItem>
)

Refresh.propTypes = {
  handleRefresh: PropTypes.func.isRequired
}

export default Refresh
