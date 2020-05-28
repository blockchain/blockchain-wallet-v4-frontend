import React from 'react'
import styled from 'styled-components'

import { NavbarNavItemIcon, NavbarNavItemTextLink } from 'components/Navbar'
import { TooltipHost } from 'blockchain-info-components'

const NotificationBadge = styled.div`
  border-radius: 50%;
  width: 16px;
  height: 16px;
  text-align: center;
  color: white;
  border: 2px solid ${props => props.theme.grey900};
  background-color: ${props => props.theme.blue600};
  position: absolute;
  bottom: 16px;
  left: 16px;
  font-size: 12px;
`

const WhatsNewIcon = props => {
  const { onClick, numOfNewAnnouncements = 0 } = props
  return (
    <TooltipHost id='whatsnew.tooltip'>
      <NavbarNavItemTextLink onClick={onClick} data-e2e='notificationsLink'>
        {numOfNewAnnouncements > 0 ? (
          <NotificationBadge>{numOfNewAnnouncements}</NotificationBadge>
        ) : null}
        <NavbarNavItemIcon name='bell' size='22px' cursor />
      </NavbarNavItemTextLink>
    </TooltipHost>
  )
}

export default WhatsNewIcon
