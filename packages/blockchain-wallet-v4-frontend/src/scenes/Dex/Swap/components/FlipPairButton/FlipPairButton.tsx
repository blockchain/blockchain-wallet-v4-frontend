import React from 'react'
import { IconArrowDown, PaletteColors } from '@blockchain-com/constellation'

import { Wrapper } from './styles'

type OwnProps =
  | {
      isQuoteLocked: true
    }
  | {
      isQuoteLocked: false
      onClick: () => void
    }

export const FlipPairButton = (props: OwnProps) =>
  props.isQuoteLocked ? (
    <Wrapper isQuoteLocked>
      <IconArrowDown color={PaletteColors['grey-900']} label='arrow down' size='small' />
    </Wrapper>
  ) : (
    <Wrapper isQuoteLocked={false} onClick={props.onClick}>
      <IconArrowDown color={PaletteColors['grey-900']} label='arrow down' size='small' />
    </Wrapper>
  )
