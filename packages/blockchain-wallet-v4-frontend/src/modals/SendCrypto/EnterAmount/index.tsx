import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { compose } from 'redux'
import { Field } from 'redux-form'
import reduxForm, { InjectedFormProps } from 'redux-form/lib/reduxForm'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import {
  convertCoinToCoin,
  convertCoinToFiat,
  convertFiatToCoin
} from 'blockchain-wallet-v4/src/exchange'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import { getRatesSelector } from 'blockchain-wallet-v4/src/redux/data/misc/selectors'
import { AmountTextBox } from 'components/Exchange'
import { FlyoutWrapper } from 'components/Flyout'
import { DisplayContainer } from 'components/SimpleBuy'
import { RatesType } from 'core/types'
import { SendCryptoStepType } from 'data/components/sendCrypto/types'
import { formatTextAmount } from 'services/forms'
import { media } from 'services/styles'
import { hexToRgb } from 'utils/helpers'

import { StepHeader } from '../../RequestCrypto/model'
import { Row } from '../../Swap/EnterAmount/Checkout'
import { Props as OwnProps } from '..'
import { SEND_FORM } from '../model'

const Amounts = styled.div`
  margin-top: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const AmountRow = styled(Row)`
  position: relative;
  padding: 24px;
  justify-content: center;
  border: 0;
`
const CheckoutDisplayContainer = styled(DisplayContainer)`
  justify-content: space-between;
  ${media.tablet`
    padding: 16px 20px;
  `}
`
const IconContainer = styled.div`
  display: flex;
  align-items: center;
`
const IconBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 24px;
  z-index: 100;
  background: white;
`
const StyledIcon = styled(Icon)<{ background: string }>`
  background: rgba(${(props) => hexToRgb(props.theme[props.background] || '#000000')}, 0.15);
  border-radius: 50%;

  & :not(::before) {
    opacity: 0.15;
  }

  &::before {
    color: ${(props) => props.theme[props.background]};
  }
`
const PlusMinusIconWrapper = styled.div`
  z-index: 10;
`
const QuoteActionContainer = styled.div`
  height: 32px;
`
const QuoteRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const SendEnterAmount: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const [fontRatio, setRatio] = useState(1)

  const normalizeAmount = (value, prevValue, allValues) => {
    if (Number.isNaN(Number(value)) && value !== '.' && value !== '') return prevValue
    return formatTextAmount(value, allValues && allValues.fix === 'FIAT')
  }

  const resizeSymbol = (isFiat, inputNode, fontSizeRatio, fontSizeNumber) => {
    if (Number(fontSizeRatio) > 0) {
      setRatio(fontSizeRatio > 1 ? 1 : fontSizeRatio)
    }
    const amountRowNode = inputNode.closest('#amount-row')
    const currencyNode = isFiat
      ? amountRowNode.children[0]
      : amountRowNode.children[amountRowNode.children.length - 1]
    currencyNode.style.fontSize = `${fontSizeNumber * (fontRatio - 0.3)}px`
  }

  const { formActions, formValues, rates, sendCryptoActions, walletCurrency } = props
  const { amount, fix = 'CRYPTO', selectedAccount, to } = formValues
  const { coin } = selectedAccount
  const max = convertCoinToCoin({ coin, value: selectedAccount.balance })
  const cryptoAmt =
    fix === 'FIAT'
      ? convertFiatToCoin({
          coin,
          currency: walletCurrency,
          maxPrecision: 8,
          rates,
          value: amount
        })
      : amount
  const fiatAmt =
    fix === 'CRYPTO'
      ? convertCoinToFiat({
          coin,
          currency: walletCurrency,
          isStandard: true,
          rates,
          value: amount || 0
        })
      : amount

  const quote = fix === 'CRYPTO' ? fiatAmt : cryptoAmt

  return (
    <>
      <FlyoutWrapper>
        <StepHeader>
          <Icon
            cursor
            onClick={() => sendCryptoActions.setStep({ step: SendCryptoStepType.ENTER_TO })}
            name='arrow-back'
            color='grey600'
            size='24px'
            style={{ marginRight: '20px' }}
          />
          <Text size='24px' color='grey800' weight={600}>
            <FormattedMessage id='modals.sendcrypto.enteramount.title' defaultMessage='Send' />
          </Text>
        </StepHeader>
      </FlyoutWrapper>
      <CheckoutDisplayContainer>
        <div>
          <Text size='14px' color='grey600' weight={600}>
            <FormattedMessage defaultMessage='From:' id='copy.from:' /> {selectedAccount.label}
          </Text>
          <Text size='16px' color='grey900' weight={600}>
            <FormattedMessage defaultMessage='To:' id='copy.to:' /> {to}
          </Text>
        </div>
        <IconContainer>
          <Icon
            size='32px'
            color={coin}
            name={coin}
            style={{ left: '5px', position: 'relative' }}
          />
          <PlusMinusIconWrapper>
            <IconBackground>
              <StyledIcon name='arrow-top-right' size='24px' background={coin} />
            </IconBackground>
          </PlusMinusIconWrapper>
        </IconContainer>
      </CheckoutDisplayContainer>
      <FlyoutWrapper
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingTop: '0px'
        }}
      >
        <AmountRow id='amount-row'>
          {fix === 'FIAT' && (
            <Text size='56px' color='textBlack' weight={500}>
              {Currencies[walletCurrency].units[walletCurrency].symbol}
            </Text>
          )}
          <Field
            data-e2e='sbAmountInput'
            name='amount'
            component={AmountTextBox}
            // validate={[maximumAmount, minimumAmount]}
            normalize={normalizeAmount}
            // eslint-disable-next-line
            onUpdate={resizeSymbol.bind(null, fix === 'FIAT')}
            maxFontSize='56px'
            placeholder='0'
            // leave fiatActive always to avoid 50% width in HOC?
            fiatActive
            {...{
              autoFocus: true,
              hideError: true
            }}
          />
          {fix === 'CRYPTO' && (
            <Text size='56px' color='textBlack' weight={500}>
              {coin}
            </Text>
          )}
        </AmountRow>
        <QuoteActionContainer>
          <QuoteRow>
            <div />
            <Text color='grey600' size='14px' weight={500} data-e2e='sbQuoteAmount'>
              {quote}
            </Text>
            <Icon
              color='blue600'
              cursor
              name='up-down-chevron'
              onClick={() => {
                formActions.change(SEND_FORM, 'fix', fix === 'CRYPTO' ? 'FIAT' : 'CRYPTO')
                formActions.change(SEND_FORM, 'amount', fix === 'CRYPTO' ? fiatAmt : cryptoAmt)
              }}
              role='button'
              size='24px'
              data-e2e='sbSwitchIcon'
            />
          </QuoteRow>
        </QuoteActionContainer>
        <Amounts>
          <Text
            cursor='pointer'
            // @ts-ignore
            role='button'
            onClick={() => {
              formActions.change(SEND_FORM, 'fix', 'CRYPTO')
              formActions.change(SEND_FORM, 'amount', max)
            }}
          >
            <Text color='blue600' weight={600} size='12px'>
              <FormattedMessage id='copy.available' defaultMessage='Available' />
            </Text>
            <Text
              color='black'
              weight={600}
              size='14px'
              style={{ marginTop: '4px', textAlign: 'right' }}
            >
              {max} {coin}
            </Text>
          </Text>
          <div>
            <Text color='blue600' weight={600} size='12px'>
              <FormattedMessage id='copy.network_fee' defaultMessage='Network Fee' />
            </Text>
            <Text color='black' weight={600} size='14px' style={{ marginTop: '4px' }}>
              TODO
            </Text>
          </div>
        </Amounts>
      </FlyoutWrapper>
      <FlyoutWrapper>
        <Button
          nature='primary'
          type='submit'
          data-e2e='enterAmountBtn'
          fullwidth
          jumbo
          disabled={!amount}
        >
          <FormattedMessage id='buttons.next' defaultMessage='Next' />
        </Button>
      </FlyoutWrapper>
    </>
  )
}

const mapStateToProps = (state, ownProps: OwnProps) => {
  const ratesSelector = getRatesSelector(ownProps.formValues.selectedAccount.coin, state)
  return {
    rates: ratesSelector.getOrElse({} as RatesType)
  }
}

const connector = connect(mapStateToProps)
const enhance = compose(
  connector,
  reduxForm<{}, Props>({
    destroyOnUnmount: false,
    form: SEND_FORM
  })
)

type Props = ConnectedProps<typeof connector> & OwnProps

export default enhance(SendEnterAmount) as React.ComponentType<OwnProps>
