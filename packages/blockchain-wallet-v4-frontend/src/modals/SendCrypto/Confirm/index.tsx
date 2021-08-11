import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import BigNumber from 'bignumber.js'
import { compose } from 'redux'
import reduxForm, { InjectedFormProps } from 'redux-form/lib/reduxForm'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { convertCoinToCoin, convertFiatToCoin } from 'blockchain-wallet-v4/src/exchange'
import { getRatesSelector } from 'blockchain-wallet-v4/src/redux/data/misc/selectors'
import CollapseText from 'components/CollapseText'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { FlyoutWrapper, Row } from 'components/Flyout'
import { CoinAccountListOption, Form } from 'components/Form'
import { RatesType } from 'core/types'
import { selectors } from 'data'
import { SendCryptoStepType } from 'data/components/sendCrypto/types'

import { StepHeader } from '../../RequestCrypto/model'
import { Props as OwnProps } from '..'
import { SEND_FORM } from '../model'

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

const Confirm: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const { feesR, formValues, rates, sendCryptoActions, walletCurrency } = props
  const { amount, fix, selectedAccount, to } = formValues
  const { coin } = selectedAccount

  // amt
  const standardCryptoAmt =
    fix === 'FIAT'
      ? convertFiatToCoin({
          coin,
          currency: walletCurrency,
          rates,
          value: amount
        })
      : amount
  const baseCryptoAmt = convertCoinToCoin({ baseToStandard: false, coin, value: standardCryptoAmt })

  // fee
  const standardCryptoFee = feesR.getOrElse(0) || 0
  const baseCryptoFee = convertCoinToCoin({ baseToStandard: false, coin, value: standardCryptoFee })

  // TODO: pull from payment
  // total
  const total = new BigNumber(baseCryptoAmt).plus(baseCryptoFee)

  return (
    <Wrapper
      onSubmit={(e) => {
        e.preventDefault()
        sendCryptoActions.submit()
      }}
    >
      <div>
        <FlyoutWrapper>
          <StepHeader>
            <Icon
              cursor
              onClick={() => sendCryptoActions.setStep({ step: SendCryptoStepType.ENTER_AMOUNT })}
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
        <CoinAccountListOption
          account={selectedAccount}
          walletCurrency={walletCurrency}
          coin={selectedAccount.coin}
          displayOnly
          hideActionIcon
        />
        <FlyoutWrapper>
          <FiatDisplay coin={coin} size='32px' weight={600} color='grey800'>
            {total}
          </FiatDisplay>
          <CoinDisplay coin={coin} size='24px' weight={600} color='grey600'>
            {total}
          </CoinDisplay>
        </FlyoutWrapper>
        <CustomRow>
          <div>
            <Text size='16px' weight={500} color='black'>
              <FormattedMessage id='copy.send_to' defaultMessage='Send To' />
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
              <FormattedMessage id='copy.amount' defaultMessage='Amount' />
            </Text>
          </div>
          <div>
            <FiatDisplay coin={coin} size='16px' weight={500} color='black'>
              {/* TODO, pull from payment */}
              {baseCryptoAmt}
            </FiatDisplay>
            <CoinDisplay coin={coin} size='14px' weight={500} color='grey500'>
              {/* TODO, pull from payment */}
              {baseCryptoAmt}
            </CoinDisplay>
          </div>
        </CustomRow>
        <CustomRow>
          <div>
            <Text size='16px' weight={500} color='black'>
              <FormattedMessage id='copy.fee' defaultMessage='Fee' />
            </Text>
          </div>
          <div>
            <FiatDisplay coin={coin} size='16px' weight={500} color='black'>
              {/* TODO, pull from payment */}
              {baseCryptoFee}
            </FiatDisplay>
            <CoinDisplay coin={coin} size='14px' weight={500} color='grey500'>
              {/* TODO, pull from payment */}
              {baseCryptoFee}
            </CoinDisplay>
          </div>
        </CustomRow>
        <CustomRow>
          <div>
            <Text size='16px' weight={600} color='black'>
              <FormattedMessage id='copy.total' defaultMessage='Total' />
            </Text>
          </div>
          <div>
            <FiatDisplay coin={coin} size='16px' weight={600} color='black'>
              {/* TODO, pull from payment */}
              {total}
            </FiatDisplay>
            <CoinDisplay coin={coin} size='14px' weight={600} color='grey500'>
              {/* TODO, pull from payment */}
              {total}
            </CoinDisplay>
          </div>
        </CustomRow>
      </div>
      <FlyoutWrapper>
        <Button data-e2e='sendBtn' nature='primary' jumbo fullwidth type='submit'>
          <FormattedMessage id='buttons.send' defaultMessage='Send' /> {coin}
        </Button>
      </FlyoutWrapper>
    </Wrapper>
  )
}

const mapStateToProps = (state, ownProps: OwnProps) => {
  const { coin } = ownProps.formValues.selectedAccount

  const ratesSelector = getRatesSelector(coin, state)
  return {
    feesR: selectors.components.sendCrypto.getWithdrawalFees(state, coin),
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
