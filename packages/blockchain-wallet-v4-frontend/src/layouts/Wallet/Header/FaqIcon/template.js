import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Link, Icon } from 'blockchain-info-components'

const FaqLink = styled(Link)`
  position: relative;

  ::after {
    opacity: ${props => props.highlighted ? '1' : '0'};
    content: "";
    position: absolute;
    top: 24px;
    left: 0px;
    width: 0;
    height: 0;
    z-index: 3;
    border-left: 11px solid transparent;
    border-right: 11px solid transparent;
    border-bottom: 16px solid ${props => props.theme['white-blue']};
    transition: opacity ${props => props.highlighted ? '0.2s' : '0'};
    transition-delay: ${props => props.highlighted ? '0.3s' : '0'};
  }
`

const FaqIcon = (props) => {
  const { handleClick, highlighted } = props

  return (
    <FaqLink onClick={handleClick} highlighted={highlighted}>
      <Icon id='faq-icon' name='question-in-circle-filled' size='18px' color='white' cursor />
    </FaqLink>
  )
}

FaqIcon.propTypes = {
  handleClick: PropTypes.func.isRequired,
  highlighted: PropTypes.bool.isRequired
}

export default FaqIcon
