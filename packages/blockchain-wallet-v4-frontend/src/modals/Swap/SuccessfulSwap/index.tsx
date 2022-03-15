import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { SwapOrderType } from '@core/types'
import { Button, Image, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { getOutput } from 'data/components/swap/model'

import { Props as BaseProps, SuccessStateType } from '..'

const Wrapper = styled(FlyoutWrapper)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

const SuccessfulSwap: React.FC<Props> = (props) => {
  if (!props.order) return null
  return (
    <Wrapper>
      <Image name='swap-success' size='32px' />
      <Text size='20px' color='grey800' weight={600} style={{ marginTop: '24px' }}>
        <FormattedMessage id='copy.swap_complete' defaultMessage='Swap Complete' />
      </Text>
      {props.order.state === 'FINISHED' ? (
        <Text size='14px' color='grey600' weight={600} style={{ marginTop: '4px' }}>
          <FormattedMessage
            id='copy.swap_available_in_wallet'
            defaultMessage='Your {coin} is now available in your Wallet.'
            values={{
              coin: window.coins[getOutput(props.order)].coinfig.name
            }}
          />
        </Text>
      ) : (
        <Text size='14px' color='grey600' weight={600} style={{ marginTop: '4px' }}>
          <FormattedMessage
            id='copy.swap_arrive_soon'
            defaultMessage='Your {coin} will arrive soon.'
            values={{
              // @ts-ignore
              coin: getOutput(props.order)
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

type OwnProps = BaseProps & SuccessStateType & { handleClose: () => void; order?: SwapOrderType }
export type Props = OwnProps

export default SuccessfulSwap
