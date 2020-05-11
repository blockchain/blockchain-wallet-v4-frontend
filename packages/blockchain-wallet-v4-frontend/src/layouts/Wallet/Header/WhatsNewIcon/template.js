import React from 'react'
import styled from 'styled-components'

import { Link, TooltipHost } from 'blockchain-info-components'
import { NavbarIcon } from 'components/Navbar'

const WhatsNewLink = styled(Link)`
  position: relative;
  padding: 5px;
  border-radius: 4px;
`
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
      <WhatsNewLink onClick={onClick} data-e2e='notificationsLink'>
        {numOfNewAnnouncements > 0 ? (
          <NotificationBadge>{numOfNewAnnouncements}</NotificationBadge>
        ) : null}
        <NavbarIcon
          id='whatsnew-icon'
          name='bell'
          color='whiteFade900'
          size='22px'
          cursor
        />
      </WhatsNewLink>
    </TooltipHost>
  )
}

export default WhatsNewIcon
