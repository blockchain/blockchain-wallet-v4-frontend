import React, { memo } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { fiatToString } from '@core/exchange/utils'
import { WithdrawalLockResponseType } from '@core/types'
import { Icon, Text, Tooltip, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import { convertBaseToStandard } from 'data/components/exchange/services'

const SpacedRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const OuterSpacedRow = styled(SpacedRow)<{ reversed: boolean }>`
  flex: 1;
  flex-direction: ${({ reversed }) => (reversed ? 'row-reverse' : 'row')};
  padding: ${({ reversed }) => (reversed ? '12px 16px' : '10px 0 10px 16px')};
`
const InnerSpacedRow = styled(SpacedRow)`
  &:hover {
    cursor: pointer;
  }
`

export const OnHold = (props: Props) => {
  return (
    <OuterSpacedRow reversed={props.mode === 'tooltip'}>
      <Text color='grey900' size='14px' weight={500}>
        {fiatToString({
          unit: props.currency,
          value: convertBaseToStandard('FIAT', props.amount)
        })}
      </Text>
      {props.mode === 'flyout' && (
        <InnerSpacedRow role='button' onClick={props.handleClick}>
          <Text color='grey600' size='14px' weight={500}>
            <FormattedMessage id='copy.on_hold' defaultMessage='On Hold' />
          </Text>
          <Icon name='chevron-right' color='grey600' size='22px' weight={500} />
        </InnerSpacedRow>
      )}
      {props.mode === 'tooltip' && (
        <InnerSpacedRow>
          <Text color='grey900' size='14px' weight={600}>
            <FormattedMessage id='copy.on_hold' defaultMessage='On Hold' />
          </Text>
          <TooltipHost id='onhold_tooltip'>
            <TooltipIcon name='info' color='grey400' size='14px' />
          </TooltipHost>
          <Tooltip id='onhold_tooltip' place='bottom'>
            <FormattedMessage
              id='modals.brokerage.withdraw_holding_period_1'
              defaultMessage='Newly added funds are subject to a holding period. You can transfer between your Trading, Earn, and Exchange accounts in the meantime.'
            />
          </Tooltip>
        </InnerSpacedRow>
      )}
    </OuterSpacedRow>
  )
}

export type Props = WithdrawalLockResponseType['totalLocked'] &
  ({ mode: 'tooltip' } | { handleClick: () => void; mode: 'flyout' })

export default memo(OnHold)
