import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { Link, TooltipHost } from 'blockchain-info-components'
import { NavbarIcon } from 'components/Navbar'
import media from 'services/ResponsiveService'

const FaqLink = styled(Link)`
  position: relative;
  padding: 5px 10px;
  border-radius: 4px;
  background-color: rgba(
    0,
    0,
    0,
    ${props => (props.highlighted ? '0.2' : '0')}
  );

  ${media.mobile`
    background-color: transparent;
    padding: 0;

    > span:first-child {
      display: none;
    }

    > span:last-child {
      display: flex;
    }
  `};
`

const FaqIcon = props => {
  const { handleClick } = props

  return (
    <TooltipHost id='faq.tooltip'>
      <FaqLink
        size='14px'
        weight={500}
        color='white'
        onClick={handleClick}
        data-e2e='faqLink'
      >
        <NavbarIcon
          id='faq-icon'
          name='question-in-circle-filled'
          size='22px'
          color='white'
          cursor
        />
      </FaqLink>
    </TooltipHost>
  )
}

FaqIcon.propTypes = {
  handleClick: PropTypes.func.isRequired,
  highlighted: PropTypes.bool.isRequired
}

export default FaqIcon
