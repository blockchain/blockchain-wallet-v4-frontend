import React from 'react'
import styled from 'styled-components'

import { Link, TooltipHost } from 'blockchain-info-components'
import { NavbarIcon } from 'components/Navbar'
import media from 'services/ResponsiveService'

const FaqLink = styled(Link)`
  position: relative;
  padding: 5px 10px;
  border-radius: 4px;

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
  const { onClick } = props

  return (
    <TooltipHost id='faq.tooltip'>
      <FaqLink
        size='14px'
        weight={500}
        color='white'
        onClick={onClick}
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

export default FaqIcon
