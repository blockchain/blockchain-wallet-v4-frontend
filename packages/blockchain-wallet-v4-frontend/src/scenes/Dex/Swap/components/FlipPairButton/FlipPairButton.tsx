import React from 'react'
import { IconDeposit, PaletteColors } from '@blockchain-com/constellation'

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
      <IconDeposit color={PaletteColors['grey-200']} label='arrow down' size='small' />
    </Wrapper>
  ) : (
    <Wrapper isQuoteLocked={false} onClick={props.onClick}>
      <IconDeposit color={PaletteColors['blue-600']} label='arrow down' size='small' />
    </Wrapper>
  )
