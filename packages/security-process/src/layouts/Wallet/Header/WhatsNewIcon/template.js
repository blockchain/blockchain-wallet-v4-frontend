import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Link, TooltipHost } from 'blockchain-info-components'
import { NavbarIcon } from 'components/Navbar'

const WhatsNewLink = styled(Link)`
  position: relative;
  padding: 5px;
  border-radius: 4px;
  background-color: rgba(
    0,
    0,
    0,
    ${props => (props.highlighted ? '0.2' : '0')}
  );
`
const NotificationBadge = styled.div`
  border-radius: 50%;
  width: 15px;
  height: 15px;
  border: 1px solid ${props => props.theme['brand-secondary']};
  text-align: center;
  background-color: ${props => props.theme['white']};
  position: absolute;
  bottom: 15px;
  left: 14px;
  font-size: 12px;
`

const WhatsNewIcon = props => {
  const { handleClick, numOfNewAnnouncements = 0, highlighted } = props
  return (
    <TooltipHost id='whatsnew.tooltip'>
      <WhatsNewLink
        onClick={handleClick}
        highlighted={highlighted}
        data-e2e='notificationsLink'
      >
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

WhatsNewIcon.propTypes = {
  handleClick: PropTypes.func,
  numOfNewAnnouncements: PropTypes.number
}

export default WhatsNewIcon
