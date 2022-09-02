import React from 'react'
import { IconRefresh, PaletteColors } from '@blockchain-com/constellation'
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
    <StyledIconRefresh
      isActive={props.isActive}
      label='refresh'
      size={props.size}
      color={PaletteColors[props.color]}
    />
  )
}

type Props = {
  color: 'blue-600' | 'grey-700'
  isActive: boolean
  size: 'small' | 'medium' | 'large'
}

export default NftRefreshIcon
