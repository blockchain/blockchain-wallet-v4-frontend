import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import BigNumber from 'bignumber.js'
import { compose } from 'redux'
import reduxForm, { InjectedFormProps } from 'redux-form/lib/reduxForm'
import styled from 'styled-components'

import { convertCoinToCoin, convertFiatToCoin } from '@core/exchange'
import { getRatesSelector } from '@core/redux/data/misc/selectors'
import { RatesType } from '@core/types'
import { Button, Icon, SpinningLoader, Text } from 'blockchain-info-components'
import CollapseText from 'components/CollapseText'
import DataError from 'components/DataError'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { FlyoutWrapper, Row } from 'components/Flyout'
import { AmountWrapper, StepHeader } from 'components/Flyout/SendRequestCrypto'
import Form from 'components/Form/Form'
import { selectors } from 'data'
import { SendCryptoStepType } from 'data/components/sendCrypto/types'
import { SwapBaseCounterTypes } from 'data/types'

import { Props as OwnProps } from '..'
import { SEND_FORM } from '../model'
import InsufficientBalanceError from './InsufficientBalanceError'

const Wrapper = styled(Form)`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  min-height: 100%;
`
const CustomRow = styled(Row)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div:last-child * {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
`

const isInsufficientBalance = (e: string) => {
  try {
    const error = JSON.parse(e)
    if (
      error.errorKey === 'INSUFFICIENT_BALANCE' &&
      error.error === 'Insufficient balance for transaction'
    ) {
      return true
    }

    return false
  } catch (e) {
    return false
  }
}

const Confirm: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const { formValues, rates, sendCryptoActions, walletCurrency } = props
  const { amount, fee, fix, memo, selectedAccount, selectedAccount: account, to } = formValues
  const { coin, type } = selectedAccount
  const isAccount = type === SwapBaseCounterTypes.ACCOUNT

  const isMax = amount === 'MAX'
  const standardCryptoAmt =
    fix === 'FIAT'
      ? convertFiatToCoin({
          coin,
          currency: walletCurrency,
          rates,
          value: amount
        })
      : amount
  const baseCryptoAmt = isMax
    ? 'MAX'
    : convertCoinToCoin({ baseToStandard: false, coin, value: standardCryptoAmt })

  useEffect(() => {
    sendCryptoActions.buildTx({
      account,
      baseCryptoAmt,
      destination: to,
      fee,
      fix,
      memo,
      rates,
      walletCurrency
    })
  }, [])

  return (
    <Wrapper
      onSubmit={(e) => {
        e.preventDefault()
        sendCryptoActions.submitTransaction()
      }}
    >
      <div>
        <FlyoutWrapper>
          <StepHeader>
            <Icon
              cursor
              onClick={() => {
                if (isMax) {
                  props.formActions.change(SEND_FORM, 'amount', '0')
                }
                sendCryptoActions.setStep({ step: SendCryptoStepType.ENTER_AMOUNT })
              }}
              name='arrow-back'
              role='button'
              color='grey600'
              size='24px'
              style={{ marginRight: '20px' }}
            />
            <Text size='24px' color='grey800' weight={600}>
              <FormattedMessage id='modals.sendcrypto.enteramount.title' defaultMessage='Send' />
            </Text>
          </StepHeader>
        </FlyoutWrapper>
        {props.prebuildTxR.cata({
          Failure: (e) =>
            isInsufficientBalance(e) ? (
              <InsufficientBalanceError
                tryAgain={() =>
                  props.sendCryptoActions.setStep({ step: SendCryptoStepType.ENTER_AMOUNT })
                }
                handleMax={() =>
                  sendCryptoActions.buildTx({
                    account,
                    baseCryptoAmt: 'MAX',
                    destination: to,
                    fee,
                    fix,
                    memo,
                    rates,
                    walletCurrency
                  })
                }
              />
            ) : (
              <DataError message={{ message: e }} />
            ),
          Loading: () => (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <SpinningLoader width='14px' height='14px' borderWidth='3px' />
            </div>
          ),
          NotAsked: () => (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <SpinningLoader width='14px' height='14px' borderWidth='3px' />
            </div>
          ),
          Success: (tx) => (
            <>
              <AmountWrapper>
                <CoinDisplay coin={coin} size='32px' weight={600} color='black'>
                  {new BigNumber(tx.summary.amount).plus(tx.summary.absoluteFeeEstimate)}
                </CoinDisplay>
              </AmountWrapper>
              <CustomRow>
                <div>
                  <Text size='16px' weight={500} color='black'>
                    <FormattedMessage id='copy.send' defaultMessage='Send' />
                  </Text>
                </div>
                <div>
                  <CoinDisplay coin={coin} size='16px' weight={500} color='black'>
                    {tx.summary.amount}
                  </CoinDisplay>
                  <FiatDisplay coin={coin} size='14px' weight={500} color='grey500'>
                    {tx.summary.amount}
                  </FiatDisplay>
                </div>
              </CustomRow>
              <CustomRow>
                <div>
                  <Text size='16px' weight={500} color='black'>
                    <FormattedMessage id='copy.from' defaultMessage='From' />
                  </Text>
                </div>
                <div>
                  <Text size='16px' weight={500} color='black'>
                    {selectedAccount.label}
                  </Text>
                </div>
              </CustomRow>
              <CustomRow>
                <div>
                  <Text size='16px' weight={500} color='black'>
                    <FormattedMessage id='copy.to' defaultMessage='To' />
                  </Text>
                </div>
                <div>
                  <Text size='16px' weight={500} color='black'>
                    <CollapseText text={to} size='16px' color='black' weight={500} place='left' />
                  </Text>
                </div>
              </CustomRow>
              <CustomRow>
                <div>
                  <Text size='16px' weight={500} color='black'>
                    {isAccount ? (
                      <FormattedMessage id='copy.network_fee' defaultMessage='Network Fee' />
                    ) : (
                      <FormattedMessage id='copy.processing_fee' defaultMessage='Processing Fee' />
                    )}
                  </Text>
                </div>
                <div>
                  <CoinDisplay coin={coin} size='16px' weight={500} color='black'>
                    {tx.summary.absoluteFeeEstimate}
                  </CoinDisplay>
                  <FiatDisplay coin={coin} size='14px' weight={500} color='grey500'>
                    {tx.summary.absoluteFeeEstimate}
                  </FiatDisplay>
                </div>
              </CustomRow>
              {tx.rawTx?.payload.payload.memo.content ? (
                <CustomRow>
                  <div>
                    <Text size='16px' weight={500} color='black'>
                      <FormattedMessage id='copy.memo' defaultMessage='Memo' />
                    </Text>
                  </div>
                  <div>
                    <Text size='16px' weight={500} color='black'>
                      {tx.rawTx.payload.payload.memo.content}
                    </Text>
                  </div>
                </CustomRow>
              ) : null}
              <CustomRow>
                <div>
                  <Text size='16px' weight={600} color='black'>
                    <FormattedMessage id='copy.total' defaultMessage='Total' />
                  </Text>
                </div>
                <div>
                  <CoinDisplay coin={coin} size='16px' weight={600} color='black'>
                    {new BigNumber(tx.summary.amount).plus(tx.summary.absoluteFeeEstimate)}
                  </CoinDisplay>
                  <FiatDisplay coin={coin} size='14px' weight={600} color='grey500'>
                    {new BigNumber(tx.summary.amount).plus(tx.summary.absoluteFeeEstimate)}
                  </FiatDisplay>
                </div>
              </CustomRow>
              <FlyoutWrapper>
                <Button data-e2e='sendBtn' nature='primary' jumbo fullwidth type='submit'>
                  <FormattedMessage id='buttons.send' defaultMessage='Send' />
                  &nbsp;
                  <CoinDisplay coin={coin} size='16px' weight={600} color='white'>
                    {new BigNumber(tx.summary.amount).plus(tx.summary.absoluteFeeEstimate)}
                  </CoinDisplay>
                </Button>
                <Button
                  style={{ marginTop: '16px' }}
                  data-e2e='cancelBtn'
                  nature='light-red'
                  jumbo
                  fullwidth
                  onClick={() => props.close()}
                >
                  <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
                </Button>
              </FlyoutWrapper>
            </>
          )
        })}
      </div>
    </Wrapper>
  )
}

const mapStateToProps = (state, ownProps: OwnProps) => {
  const { coin } = ownProps.formValues.selectedAccount

  const ratesSelector = getRatesSelector(coin, state)

  return {
    prebuildTxR: selectors.components.sendCrypto.getPrebuildTx(state),
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

export default enhance(Confirm) as React.ComponentType<OwnProps>
