import React from 'react'
import { FormattedMessage } from 'react-intl'
import { lighten } from 'polished'
import styled from 'styled-components'

import { Box, Button, Icon, SkeletonRectangle, Text, TextGroup } from 'blockchain-info-components'

import { ActionEnum, RecurringBuyPeriods } from '../../data/types'
import { getActionText, getPeriodText } from '../Flyout/model'

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
  background-color: ${(props) => {
    const coinColor = props.theme[props.coin]

    return coinColor ? lighten(0.35, coinColor) : props.theme.grey100
  }};
`

const LoadingTextDark = styled(SkeletonRectangle)`
  border-radius: 10px;
  margin-bottom: 3px;
`

const LoadingTextLight = styled(SkeletonRectangle)`
  opacity: 0.7;
  margin-bottom: 3px;
`

const LoadingIcon = styled.div`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.grey000};
`

const SavedRecurringBuy = ({
  action,
  amount,
  coin,
  loading,
  nextPayment,
  onClick,
  period
}: Props) => {
  if (loading || !period || !action || !nextPayment || !coin) {
    return (
      <StyledBox disabled={false} isMethod={false} isMobile={false}>
        <MetaContainer>
          <LoadingIcon />
          <TextGroup>
            <LoadingTextDark height='16px' width='75px' />
            <LoadingTextLight height='14px' width='50px' />
          </TextGroup>
        </MetaContainer>
      </StyledBox>
    )
  }

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
        <Button
          data-e2e={`${coin}savedRecurringBuyViewDetails`}
          nature='empty-blue'
          onClick={onClick}
        >
          <FormattedMessage id='copy.view_details' defaultMessage='View Details' />
        </Button>
      </ActionsContainer>
    </StyledBox>
  )
}

export type Props =
  | {
      action: ActionEnum
      amount: string | number
      coin: string
      loading?: never
      nextPayment: string | number
      onClick: () => void
      period: RecurringBuyPeriods
    }
  | {
      action?: never
      amount?: never
      coin?: never
      loading: true
      nextPayment?: never
      onClick?: never
      period?: never
    }
export default SavedRecurringBuy
