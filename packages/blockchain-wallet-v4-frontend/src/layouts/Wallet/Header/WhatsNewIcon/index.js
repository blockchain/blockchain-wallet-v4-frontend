import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link, Icon } from 'blockchain-info-components'

const WhatsNewLink = styled(Link)`
  position: relative;
  margin-top: 4px;

  & > :first-child:hover {
    cursor: pointer;
  }

  ::after {
    opacity: ${props => props.trayRightOpen && props.trayRightContent === 'whats-new' ? '1' : '0'};
    content: "";
    position: absolute;
    top: 24px;
    left: -2px;
    width: 0;
    height: 0;
    z-index: 3;
    border-left: 11px solid transparent;
    border-right: 11px solid transparent;
    border-bottom: 16px solid ${props => props.theme['white-blue']};
    transition: opacity ${props => props.trayRightOpen ? '.2s' : '0'};
    transition-delay: ${props => props.trayRightOpen ? '.3s' : '.1s'};
  }
`

const WhatsNewIcon = (props) => {
  const { trayRightOpen, handleTrayRightToggle, trayRightContent } = props

  return (
    <WhatsNewLink trayRightContent={trayRightContent} trayRightOpen={trayRightOpen} onClick={() => handleTrayRightToggle('whats-new')} size='16px' weight={300} color='white'>
      <Icon name='bell-filled' size='18px' color='white'/>
    </WhatsNewLink>
  )
}

WhatsNewIcon.propTypes = {
  trayRightContent: PropTypes.string.isRequired,
  handleTrayRightToggle: PropTypes.func.isRequired,
  trayRightOpen: PropTypes.bool.isRequired
}

export default WhatsNewIcon
