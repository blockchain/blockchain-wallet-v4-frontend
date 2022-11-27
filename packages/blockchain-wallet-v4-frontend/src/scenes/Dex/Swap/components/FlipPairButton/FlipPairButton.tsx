import React from 'react'
import { IconDeposit, PaletteColors } from '@blockchain-com/constellation'

import { Wrapper } from './styled'

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
      {/* FIXME: Update color for a disabled state */}
      <IconDeposit color={PaletteColors['blue-600']} label='arrow down' size='small' />
    </Wrapper>
  ) : (
    <Wrapper isQuoteLocked={false} onClick={props.onClick}>
      <IconDeposit color={PaletteColors['blue-600']} label='arrow down' size='small' />
    </Wrapper>
  )
