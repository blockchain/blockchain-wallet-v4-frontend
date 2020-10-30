import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { Props as BaseProps, SuccessStateType } from '..'
import { Button, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { getOutput } from 'data/components/swap/model'
import { SwapOrderType } from 'core/types'

const Wrapper = styled(FlyoutWrapper)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`
const IconContainer = styled.div`
  position: relative;
`
const SwapIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 72px;
  width: 72px;
  border-radius: 50%;
  background: ${props => props.theme.blue600};
`
const CheckIcon = styled.div`
  position: absolute;
  top: -8px;
  right: -6px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px;
  border-radius: 50%;
  background: ${props => props.theme.white};
`

const SuccessfulSwap: React.FC<Props> = props => {
  if (!props.order) return null

  return (
    <Wrapper>
      <IconContainer>
        <SwapIcon>
          <Icon name='arrows-horizontal' color='white' size='28px' />
        </SwapIcon>
        <CheckIcon>
          <Icon
            name='checkmark-in-circle-filled'
            color='green400'
            size='24px'
          />
        </CheckIcon>
      </IconContainer>
      <Text
        size='20px'
        color='grey800'
        weight={600}
        style={{ marginTop: '24px' }}
      >
        <FormattedMessage
          id='copy.swap_completed'
          defaultMessage='Swap Completed'
        />
      </Text>
      {props.order.state === 'FINISHED' ? (
        <Text
          size='14px'
          color='grey600'
          weight={600}
          style={{ marginTop: '4px' }}
        >
          <FormattedMessage
            id='copy.swap_in_wallet'
            defaultMessage='Your {coin} is now in your Wallet.'
            values={{
              coin: props.coins[getOutput(props.order)].coinTicker
            }}
          />
        </Text>
      ) : (
        <Text
          size='14px'
          color='grey600'
          weight={600}
          style={{ marginTop: '4px' }}
        >
          <FormattedMessage
            id='copy.swap_arrive_soon'
            defaultMessage='Your {coin} will arrive soon.'
            values={{
              coin: props.coins[getOutput(props.order)].coinTicker
            }}
          />
        </Text>
      )}
      <Button
        data-e2e='swapDone'
        nature='primary'
        fullwidth
        jumbo
        onClick={props.handleClose}
        style={{ marginTop: '16px' }}
      >
        <FormattedMessage id='buttons.done' defaultMessage='Done' />
      </Button>
    </Wrapper>
  )
}

type OwnProps = BaseProps &
  SuccessStateType & { handleClose: () => void; order?: SwapOrderType }
export type Props = OwnProps

export default SuccessfulSwap
