import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Link, Icon } from 'blockchain-info-components'

const RefreshLink = styled(Link)`
  & > :first-child:hover { 
    cursor: pointer;
  }
`

const RefreshIcon = (props) => {
  const { handleRefresh } = props

  return (
    <RefreshLink size='14px' weight={300} color='white' uppercase onClick={handleRefresh}>
      <Icon name='refresh-filled' color='white'/>
    </RefreshLink>
  )
}

RefreshIcon.propTypes = {
  handleRefresh: PropTypes.func.isRequired
}

export default RefreshIcon
