import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

import { Props as OwnProps, SuccessStateType } from '.'

const CustomFlyoutWrapper = styled(FlyoutWrapper)`
  height: 100%;
`

const Iframe = styled.iframe`
  border: 0;
  width: 100%;
  height: 100%;
  margin-top: 16px;
`

const Top = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`

export type Props = OwnProps & SuccessStateType & { domain: string }

const Success = (props: Props) => {
  return (
    <CustomFlyoutWrapper>
      <Top color='grey800' size='20px' weight={600}>
        <Icon
          cursor
          name='arrow-back'
          size='20px'
          color='grey600'
          role='button'
          style={{ marginRight: '24px' }}
          onClick={() =>
            props.buySellActions.setStep({
              cryptoCurrency: props.cryptoCurrency || 'BTC',
              fiatCurrency: props.fiatCurrency,
              order: props.order,
              pair: props.pair,
              step: 'PAYMENT_METHODS'
            })
          }
        />
        <FormattedMessage id='buttons.add_card' defaultMessage='Add Card' />
      </Top>
      <Iframe src={props.domain} />
    </CustomFlyoutWrapper>
  )
}

export default Success
