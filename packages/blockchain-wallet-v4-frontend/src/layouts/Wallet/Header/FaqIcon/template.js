import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import media from 'services/ResponsiveService'
import { Link, Icon, TooltipHost } from 'blockchain-info-components'

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

  > span:last-child {
    display: none;
  }

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
        <FormattedMessage id='faq.help' defaultMessage='Help?' />
        <Icon
          id='faq-icon'
          name='question-in-circle'
          size='18px'
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
