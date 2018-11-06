import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Link, TooltipHost } from 'blockchain-info-components'

const FaqLink = styled(Link)`
  position: relative;
  padding: 5px 10px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.2);

  ::after {
    opacity: ${props => (props.highlighted ? '1' : '0')};
    content: '';
    position: absolute;
    top: 24px;
    left: 0px;
    width: 0;
    height: 0;
    z-index: 3;
    border-left: 11px solid transparent;
    border-right: 11px solid transparent;
    border-bottom: 16px solid ${props => props.theme['white-blue']};
    transition: opacity ${props => (props.highlighted ? '0.2s' : '0')};
    transition-delay: ${props => (props.highlighted ? '0.3s' : '0')};
  }
`

const FaqIcon = props => {
  const { handleClick, highlighted } = props

  return (
    <TooltipHost id='faq.tooltip'>
      <FaqLink
        size='14px'
        weight={400}
        color='white'
        onClick={handleClick}
        highlighted={highlighted}
        data-e2e='faqLink'
      >
        Help ?
      </FaqLink>
    </TooltipHost>
  )
}

FaqIcon.propTypes = {
  handleClick: PropTypes.func.isRequired,
  highlighted: PropTypes.bool.isRequired
}

export default FaqIcon
