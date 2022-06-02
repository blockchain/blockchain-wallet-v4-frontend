import React from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconRefresh } from '@blockchain-com/icons'
import styled from 'styled-components'

export const StyledIconRefresh = styled(IconRefresh)<{ isActive: boolean }>`
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  ${(props) =>
    props.isActive &&
    `
    animation: spin 0.5s linear 1;
  `}
`

const NftRefreshIcon = (props: Props) => {
  return (
    <Icon label='refresh' size={props.size} color={props.color}>
      <StyledIconRefresh isActive={props.isActive} />
    </Icon>
  )
}

type Props = {
  color: 'blue600' | 'grey600'
  isActive: boolean
  size: 'sm' | 'md' | 'lg'
}

export default NftRefreshIcon
