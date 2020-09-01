import { BlockchainLoader } from 'blockchain-info-components'
import { Content } from './styles'
import { Props } from '.'
import React from 'react'

const NotAsked: React.FC<Props> = () => {
  return (
    <Content>
      <BlockchainLoader height='50px' width='50px' />
    </Content>
  )
}

export default NotAsked
