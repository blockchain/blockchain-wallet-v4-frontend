import React from 'react'
import { FormattedMessage } from 'react-intl'
import { lighten } from 'polished'
import styled from 'styled-components'

import { Button } from '../Buttons'
import { getActionText, getPeriodText } from '../Flyouts/model'
import { RecurringBuyPeriods } from '../Flyouts/types'
import { Icon } from '../Icons'
import { Text, TextGroup } from '../Text'
import Box from '.'

const StyledBox = styled(Box)`
  cursor: unset;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 49%;
  min-width: 392px;

  @media (max-width: 767px) {
    width: 100%;
  }

  @media (max-width: 1114px) {
    width: 100%;
  }
`

const MetaContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const ActionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`
const SyncIconWrapper = styled.div<{ coin: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  min-width: 40px;
  border-radius: 20px;
  margin-right: 20px;
  background-color: ${(props) => lighten(0.35, props.theme[props.coin])};
`

const SavedRecurringBuy = ({ action, amount, coin, nextPayment, onClick, period }: Props) => {
  return (
    <StyledBox disabled={false} isMethod={false} isMobile={false}>
      <MetaContainer>
        <SyncIconWrapper coin={coin}>
          <Icon
            cursor
            data-e2e={`${coin}savedRecurringBuy`}
            name='sync-regular'
            size='20px'
            color={coin}
            role='button'
          />
        </SyncIconWrapper>
        <TextGroup>
          <Text weight={600} size='16px' color='grey900' style={{ marginBottom: '0' }}>
            {amount} {getPeriodText(period)}
          </Text>
          <Text weight={500} size='14px' color='grey600' style={{ marginBottom: '0' }}>
            {getActionText(action, nextPayment)}
          </Text>
        </TextGroup>
      </MetaContainer>
      <ActionsContainer>
        <Button nature='empty-blue' onClick={onClick}>
          <FormattedMessage id='copy.view_details' defaultMessage='View Details' />
        </Button>
      </ActionsContainer>
    </StyledBox>
  )
}

export enum ActionEnum {
  BUY = 'BUY',
  DEPOSIT = 'DEPOSIT',
  SELL = 'SELL',
  SWAP = 'SWAP',
  WITHDRAWAL = 'WITHDRAWAL'
}

export type Props = {
  action: ActionEnum
  amount: string | number
  coin: string
  nextPayment: string | number
  onClick: () => void
  period: RecurringBuyPeriods
}
export default SavedRecurringBuy
