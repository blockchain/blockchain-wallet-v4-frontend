import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link, Icon } from 'blockchain-info-components'

const FaqLink = styled(Link)`
  position: relative;

  & > :first-child:hover {
    cursor: pointer;
  }

  ::after {
    opacity: ${props => props.trayRightOpen && props.trayRightContent === 'faq' ? '1' : '0'};
    /*and trayRightContent is FAQ*/
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

const FaqIcon = (props) => {
  const { trayRightOpen, handleTrayRightToggle, trayRightContent } = props

  return (
    <FaqLink className={'ignore-react-onclickoutside'} trayRightContent={trayRightContent} trayRightOpen={trayRightOpen} onClick={() => handleTrayRightToggle('faq')} size='16px' weight={300} color='white'>
      <Icon name='question-in-circle-filled' size='18px' color='white'/>
    </FaqLink>
  )
}

FaqIcon.propTypes = {
  trayRightContent: PropTypes.string.isRequired,
  handleTrayRightToggle: PropTypes.func.isRequired,
  trayRightOpen: PropTypes.bool.isRequired
}

export default FaqIcon
