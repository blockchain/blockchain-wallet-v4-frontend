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
  width: 15px;
  height: 15px;
  border: 1px solid ${props => props.theme.blue600};
  text-align: center;
  background-color: ${props => props.theme.white};
  position: absolute;
  bottom: 15px;
  left: 14px;
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
          color='white'
          size='22px'
          cursor
        />
      </WhatsNewLink>
    </TooltipHost>
  )
}

export default WhatsNewIcon
