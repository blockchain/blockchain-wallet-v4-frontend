import React from 'react'
import { Icon } from 'blockchain-info-components'

const Refresh = (props) => {
  const { handleRefresh } = props
  return (
    <Icon name='refresh' onClick={handleRefresh} color='white' />
  )
}

export default Refresh
