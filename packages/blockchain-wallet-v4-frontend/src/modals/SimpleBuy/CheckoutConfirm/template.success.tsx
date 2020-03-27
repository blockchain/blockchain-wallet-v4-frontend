import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { ErrorCartridge } from 'components/Cartridge'
import { FiatType, SupportedCoinsType } from 'core/types'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import { Form } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { getOrderType, getOutputAmount } from 'data/components/simpleBuy/model'
import { InjectedFormProps, reduxForm } from 'redux-form'
import { LinkDispatchPropsType, OwnProps, SuccessStateType } from '.'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import React from 'react'
import styled from 'styled-components'

const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
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
type Props = OwnProps &
  LinkDispatchPropsType &
  SuccessStateType & { supportedCoins: SupportedCoinsType }

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  const orderType = getOrderType(props.order.pair)
  const outputAmt = getOutputAmount(props.order, props.quote)

  const displayFiat = (amt: string) => {
    return Currency.fiatToString({
      unit:
        Currencies[props.order.inputCurrency].units[props.order.inputCurrency],
      value: convertBaseToStandard('FIAT', amt)
    })
  }

  return (
    <CustomForm onSubmit={props.handleSubmit}>
      <FlyoutWrapper>
        <TopText color='grey900' size='20px' weight={600}>
          <Icon
            cursor
            name='arrow-left'
            size='20px'
            color='grey600'
            style={{ marginRight: '24px' }}
            role='button'
            onClick={() =>
              props.simpleBuyActions.setStep({
                fiatCurrency:
                  orderType === 'BUY'
                    ? (props.order.inputCurrency as FiatType)
                    : (props.order.outputCurrency as FiatType),
                step: 'ENTER_AMOUNT'
              })
            }
          />
          <FormattedMessage
            id='modals.simplebuy.checkoutconfirm'
            defaultMessage='Checkout'
          />
        </TopText>
        <Amount>
          <Text size='32px' weight={600} color='grey800'>
            {outputAmt}
          </Text>
          <Text
            size='32px'
            weight={600}
            color={props.supportedCoins[props.order.outputCurrency].colorCode}
          >
            {props.order.outputCurrency}
          </Text>
        </Amount>
      </FlyoutWrapper>
      <Row>
        <Title>
          <FormattedMessage
            id='modals.simplebuy.confirm.rate'
            defaultMessage='Exchange Rate'
          />
        </Title>
        <Value>
          {displayFiat(props.quote.rate)} / {props.order.outputCurrency}
        </Value>
      </Row>
      <Row>
        <Title>
          <FormattedMessage
            id='modals.simplebuy.confirm.payment'
            defaultMessage='Payment Method'
          />
        </Title>
        {/* TODO: Simple Buy - payment method types */}
        <Value>Bank Wire Transfer</Value>
      </Row>
      <Row>
        <Title>
          <FormattedMessage
            id='modals.simplebuy.confirm.fee'
            defaultMessage='Fees'
          />
        </Title>
        <Value>{displayFiat(props.quote.fee)}</Value>
      </Row>
      <Row>
        <Title>
          <FormattedMessage
            id='modals.simplebuy.confirm.total'
            defaultMessage='Total'
          />
        </Title>
        <Value>{displayFiat(props.order.inputQuantity)}</Value>
      </Row>
      <Bottom>
        <Text>
          <FormattedMessage
            id='modals.simplebuy.confirm.activity'
            defaultMessage='Your final amount may change due to market activity.'
          />
        </Text>
        {props.error && (
          <ErrorCartridge>
            <Icon
              name='alert-filled'
              color='red600'
              style={{ marginRight: '4px', marginTop: '16px' }}
            />
            Error: {props.error}
          </ErrorCartridge>
        )}
        <Button
          fullwidth
          nature='primary'
          data-e2e='confirmSBOrder'
          size='16px'
          height='48px'
          type='submit'
          style={{ marginTop: '16px' }}
          disabled={props.submitting}
        >
          {props.submitting ? (
            <HeartbeatLoader height='16px' width='16px' color='white' />
          ) : (
            <FormattedMessage
              id='modals.simplebuy.confirm.confirm'
              defaultMessage='Confirm Order'
            />
          )}
        </Button>
      </Bottom>
    </CustomForm>
  )
}

export default reduxForm<{}, Props>({ form: 'sbCheckoutConfirm' })(Success)
