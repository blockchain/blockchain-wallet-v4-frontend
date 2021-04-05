import React from 'react'

import { BlockchainLoader } from 'blockchain-info-components'

import { Props } from '.'
import { Content } from './styles'

const NotAsked: React.FC<Props> = () => {
  return (
    <Content>
      <BlockchainLoader height='50px' width='50px' />
    </Content>
  )
}

export default NotAsked
