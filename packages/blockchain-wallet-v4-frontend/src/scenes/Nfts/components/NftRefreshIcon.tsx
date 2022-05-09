import React from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconRefresh } from '@blockchain-com/icons'
import styled from 'styled-components'

export const StyledIconRefresh = styled(IconRefresh)`
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  &.active {
    animation: spin 0.5s linear 1;
  }
`

const NftRefreshIcon = (props: Props) => {
  return (
    <Icon label='refresh' size={props.size} color='blue600'>
      <StyledIconRefresh className={props.isActive ? 'active' : ''} />
    </Icon>
  )
}

type Props = {
  isActive: boolean
  size: 'sm' | 'md' | 'lg'
}

export default NftRefreshIcon
