import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { Button, Icon, Text } from 'blockchain-info-components'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { Props } from '.'
import { Status } from './model'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import moment from 'moment'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const Bottom = styled(FlyoutWrapper)`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  height: 100%;
`
const Amount = styled.div`
  margin-top: 40px;
  > div {
    display: inline;
  }
`
const Row = styled.div`
  padding: 16px 40px;
  box-sizing: border-box;
  border-top: 1px solid ${props => props.theme.grey000};
  &:last-child {
    border-bottom: 1px solid ${props => props.theme.grey000};
  }
`
const Title = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.grey600};
`
const Value = styled(Text)`
  margin-top: 4px;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.grey800};
`

const Success: React.FC<Props> = props => {
  const amount = Currency.fiatToString({
    unit:
      Currencies[props.order.inputCurrency].units[props.order.inputCurrency],
    value: convertBaseToStandard('FIAT', props.order.inputQuantity)
  })

  return (
    <Wrapper>
      <div>
        <FlyoutWrapper>
          <TopText color='grey900' size='20px' weight={600}>
            {/* TODO: Simple Buy - order types */}
            <FormattedMessage
              id='modals.simplebuy.ordersummary'
              defaultMessage='Buy Order Summary'
            />
            <Icon
              cursor
              name='close'
              size='20px'
              color='grey600'
              onClick={() => props.handleClose()}
            />
          </TopText>
          <Amount>
            <Text size='32px' weight={600} color='grey800'>
              {amount} of
            </Text>
            <Text
              size='32px'
              weight={600}
              color={props.supportedCoins[props.order.outputCurrency].colorCode}
            >
              {props.order.outputCurrency}
            </Text>
          </Amount>
          <div style={{ margin: '16px 0' }}>
            <Status {...props} />
          </div>
          {/* TODO: Simple Buy - payment methods, don't show if payment method is cc */}
          {props.order.state === 'PENDING_DEPOSIT' && (
            <Button
              fullwidth
              data-e2e='sbViewDetails'
              size='16px'
              height='48px'
              nature='primary'
              onClick={() =>
                props.simpleBuyActions.setStep({
                  step: 'TRANSFER_DETAILS',
                  order: props.order
                })
              }
            >
              <FormattedMessage
                id='modals.simplebuy.summary.viewtransferdets'
                defaultMessage='View Bank Transfer Details'
              />
            </Button>
          )}
        </FlyoutWrapper>
        <Row>
          <Title>
            <FormattedMessage
              id='modals.simplebuy.summary.txid'
              defaultMessage='Transaction ID'
            />
          </Title>
          <Value>{props.order.id}</Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage
              id='modals.simplebuy.summary.created'
              defaultMessage='Created'
            />
          </Title>
          <Value>{moment(props.order.insertedAt).format('LLL')}</Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage
              id='modals.simplebuy.summary.purchasing'
              defaultMessage='Purchasing'
            />
          </Title>
          <Value>
            {amount} of {props.order.outputCurrency}
          </Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage
              id='modals.simplebuy.summary.paymentmethod'
              defaultMessage='Payment Method'
            />
          </Title>
          {/* TODO: Simple Buy - payment method types */}
          <Value>Bank Wire Transfer</Value>
        </Row>
      </div>
      {(props.order.state === 'PENDING_CONFIRMATION' ||
        props.order.state === 'PENDING_DEPOSIT') && (
        <Bottom>
          <Button
            data-e2e='sbCancelPending'
            size='16px'
            height='48px'
            nature='light-red'
            onClick={() => {}}
          >
            {/* TODO: Simple Buy - order types */}
            <FormattedMessage
              id='modals.simplebuy.summary.cancelbuy'
              defaultMessage='Cancel Buy'
            />
          </Button>
        </Bottom>
      )}
    </Wrapper>
  )
}

export default Success
