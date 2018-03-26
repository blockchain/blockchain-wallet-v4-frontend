import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Link, Icon } from 'blockchain-info-components'

const FaqLink = styled(Link)`
  & > :first-child:hover { 
    cursor: pointer;
  }
`

const Faq = (props) => {
  const { handleFaqToggle } = props

  return (
    <FaqLink size='16px' weight={300} color='white' uppercase onClick={handleFaqToggle}>
      <Icon name='question-in-circle-filled' size='18px' color='white'/>
    </FaqLink>
  )
}

Faq.propTypes = {
  handleFaqToggle: PropTypes.func.isRequired
}

export default Faq
