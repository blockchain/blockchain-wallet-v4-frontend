import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Link, Icon, TooltipHost } from 'blockchain-info-components'

const WhatsNewLink = styled(Link)`
  position: relative;
`

const WhatsNewIcon = props => {
  const { handleClick, highlighted } = props

  return (
    <TooltipHost id='whatsnew.tooltip'>
      <WhatsNewLink
        onClick={handleClick}
        highlighted={highlighted}
        data-e2e='notificationsLink'
      >
        <Icon id='whatsnew-icon' name='bell' color='white' size='18px' cursor />
      </WhatsNewLink>
    </TooltipHost>
  )
}

WhatsNewIcon.propTypes = {
  handleClick: PropTypes.func.isRequired,
  highlighted: PropTypes.bool.isRequired
}

export default WhatsNewIcon
