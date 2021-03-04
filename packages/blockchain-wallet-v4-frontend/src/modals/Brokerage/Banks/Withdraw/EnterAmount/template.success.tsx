import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { isEmpty } from 'ramda'
import React, { ReactChild } from 'react'
import styled from 'styled-components'

import { AmountFieldContainer, FlyoutWrapper } from 'components/Flyout'
import {
  BankTransferAccountType,
  BeneficiaryType,
  NabuMoneyFloatType
} from 'core/types'
import { BlueCartridge, ErrorCartridge } from 'components/Cartridge'
import { Button, Icon, Text } from 'blockchain-info-components'
import { displayFiatToFiat } from 'blockchain-wallet-v4/src/exchange'
import { Form, NumberBox } from 'components/Form'
import { formatTextAmount } from 'services/ValidationHelper'
import { IcoMoonType } from 'blockchain-info-components/src/Icons/Icomoon'
import { UserDataType, WithdrawCheckoutFormValuesType } from 'data/types'
import CoinDisplay from 'components/Display/CoinDisplay'
import Currencies from 'core/exchange/currencies'

import { maximumAmount, minimumAmount } from './validation'
import { Props as OwnProps, SuccessStateType } from '.'
import Beneficiary from './Beneficiary'

import LockTimeTooltip from './LockTimeTooltip'

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`
const ToContainer = styled.div`
  margin-top: 32px;
`
const ActionContainer = styled.div`
  margin-top: 24px;
`
const MinMaxContainer = styled.div`
  margin: 24px 0 40px;
  min-height: 30px;
  display: flex;
`
const CoinContainer = styled.div`
  display: flex;
  flex-direction: row;
`
const CustomBlueCartridge = styled(BlueCartridge)`
  cursor: pointer;
`
const CustomErrorCartridge = styled(ErrorCartridge)`
  cursor: pointer;
`
const PendingText = styled(Text)`
  a {
    color: ${props => props.theme.blue600};
    text-decoration: none;
  }
`
const BlueRedCartridge = ({
  error,
  children
}: {
  children: ReactChild
  error: boolean
}) => {
  if (error)
    return <CustomErrorCartridge role='button'>{children}</CustomErrorCartridge>
  return <CustomBlueCartridge role='button'>{children}</CustomBlueCartridge>
}

const normalizeAmount = (value, prevValue) => {
  if (isNaN(Number(value)) && value !== '.' && value !== '') return prevValue
  return formatTextAmount(value, true)
}

const Success: React.FC<InjectedFormProps<
  WithdrawCheckoutFormValuesType,
  Props
> &
  Props> = props => {
  const beneficiary =
    (!props.defaultMethod && props.beneficiary) || props.defaultBeneficiary
  const transferAccount = props.defaultMethod

  const amtError =
    typeof props.formErrors.amount === 'string' && props.formErrors.amount

  const userCanWithdraw =
    Number(props.withdrawableBalance) > Number(props.fees.value)
  const showFee = Number(props.fees.value) > 0

  const maxAmount = userCanWithdraw
    ? Number(props.withdrawableBalance) - Number(props.fees.value)
    : Number(props.withdrawableBalance)

  const isEnteredAmountGreaterThanWithdrawable =
    props.formValues &&
    props.formValues.amount &&
    Number(props.formValues.amount) > maxAmount

  const showPendingTransactions = !isEmpty(props.locks)

  const showInfoTooltip =
    Number(props.withdrawableBalance) < Number(props.availableBalance)

  return (
    <FlyoutWrapper>
      <Top>
        <Icon
          name={props.fiatCurrency.toLowerCase() as keyof IcoMoonType}
          color='fiat'
          size='32px'
        />
        <Icon
          cursor
          data-e2e='withdrawCloseModal'
          name='close'
          size='20px'
          color='grey600'
          role='button'
          onClick={() => props.handleClose()}
        />
      </Top>
      <Text size='24px' color='black' weight={600}>
        <FormattedMessage id='buttons.withdraw' defaultMessage='Withdraw' />{' '}
        {props.fiatCurrency}
      </Text>

      <CoinContainer style={{ marginTop: '4px', height: '16px' }}>
        <Text size='14px' color='grey900' weight={500}>
          <FormattedMessage
            id='modals.withdraw.available_for_withdrawal'
            defaultMessage='Available to Withdraw'
          />
        </Text>{' '}
        <CoinDisplay
          size='14px'
          color='grey600'
          weight={500}
          coin={props.fiatCurrency}
          style={{ marginLeft: '4px' }}
        >
          {props.withdrawableBalance}
        </CoinDisplay>
        {showInfoTooltip && <LockTimeTooltip />}
      </CoinContainer>
      {showPendingTransactions && (
        <CoinContainer style={{ marginTop: '4px', height: '16px' }}>
          <PendingText size='14px' color='grey900' weight={500}>
            <FormattedHTMLMessage
              id='modals.withdraw.lock_description'
              defaultMessage="You have {locks} pending transactions. We’ll email you when these funds become available for withdrawal. <a href='https://support.blockchain.com/hc/en-us/articles/360048200392-Why-can-t-I-withdraw-my-crypto-' rel='noopener noreferrer' target='_blank'>Learn more.</a>"
              values={{
                locks: props.locks.length
              }}
            />
          </PendingText>
        </CoinContainer>
      )}
      {showFee && (
        <CoinContainer style={{ marginTop: '4px', height: '16px' }}>
          <Text size='14px' color='grey900' weight={500}>
            <FormattedMessage
              id='modals.withdraw.fee'
              defaultMessage='Withdraw Fee'
            />
          </Text>{' '}
          <CoinDisplay
            size='14px'
            color='grey600'
            weight={500}
            coin={props.fees.symbol}
            style={{ marginLeft: '4px' }}
          >
            {props.fees.value}
          </CoinDisplay>
        </CoinContainer>
      )}
      <Form onSubmit={props.handleSubmit}>
        <AmountFieldContainer>
          <Text size='56px' color='grey400' weight={500}>
            {Currencies[props.fiatCurrency].units[props.fiatCurrency].symbol}
          </Text>
          <Field
            data-e2e='sbAmountInput'
            name='amount'
            component={NumberBox}
            normalize={normalizeAmount}
            validate={[minimumAmount, maximumAmount]}
            placeholder='0'
            {...{
              autoFocus: true,
              errorBottom: true,
              errorLeft: true
            }}
          />
        </AmountFieldContainer>
        <MinMaxContainer>
          <div
            style={{ marginRight: '4px' }}
            onClick={() =>
              props.formActions.change(
                'custodyWithdrawForm',
                'amount',
                displayFiatToFiat({ value: props.minAmount.value })
              )
            }
          >
            <BlueRedCartridge error={amtError && amtError === 'BELOW_MIN'}>
              <>
                <CoinDisplay
                  size='14px'
                  weight={600}
                  color='inherit'
                  cursor='pointer'
                  coin={props.fiatCurrency}
                >
                  {props.minAmount.value}
                </CoinDisplay>
                &nbsp;
                <FormattedMessage id='copy.min' defaultMessage='Min' />
              </>
            </BlueRedCartridge>
          </div>
          {Number(props.minAmount.value) <
            Number(props.withdrawableBalance) && (
            <div
              onClick={() =>
                props.formActions.change(
                  'custodyWithdrawForm',
                  'amount',
                  displayFiatToFiat({ value: props.withdrawableBalance })
                )
              }
            >
              <BlueRedCartridge error={amtError && amtError === 'ABOVE_MAX'}>
                <>
                  <CoinDisplay
                    size='14px'
                    weight={600}
                    color='inherit'
                    cursor='pointer'
                    coin={props.fiatCurrency}
                  >
                    {maxAmount}
                  </CoinDisplay>
                  &nbsp;
                  <FormattedMessage id='copy.max' defaultMessage='Max' />
                </>
              </BlueRedCartridge>
            </div>
          )}
        </MinMaxContainer>

        {showFee && isEnteredAmountGreaterThanWithdrawable && (
          <Text
            size='14px'
            weight={500}
            color='grey600'
            style={{ marginBottom: '4px' }}
          >
            <FormattedMessage
              id='modals.withdraw.not_enought_founds'
              defaultMessage='Amount is greater than your max withdrawalable balance ({symbol} {balance}) minus the fee ({symbol} {fee}).'
              values={{
                balance: props.withdrawableBalance,
                symbol: props.fiatCurrency,
                fee: props.fees.value
              }}
            />
          </Text>
        )}

        <ToContainer>
          <Text
            size='14px'
            weight={500}
            color='grey600'
            style={{ marginBottom: '4px' }}
          >
            <FormattedMessage id='buttons.withdraw' defaultMessage='Withdraw' />{' '}
            <FormattedMessage id='copy.to' defaultMessage='To' />
          </Text>
          {!transferAccount && beneficiary && (
            <Beneficiary {...props} beneficiary={beneficiary} />
          )}
          {transferAccount && (
            <Beneficiary {...props} transferAccount={transferAccount} />
          )}
        </ToContainer>
        <ActionContainer>
          <Button
            disabled={props.invalid || !beneficiary || !userCanWithdraw}
            data-e2e='withdrawNext'
            type='submit'
            nature='primary'
            size='16px'
            height='48px'
            fullwidth
          >
            <FormattedMessage id='buttons.next' defaultMessage='Next' />
          </Button>
        </ActionContainer>
      </Form>
    </FlyoutWrapper>
  )
}

export type Props = OwnProps &
  SuccessStateType & {
    handleBankSelection: (
      userData: UserDataType,
      beneficiary?: BeneficiaryType | BankTransferAccountType
    ) => void
    minAmount: NabuMoneyFloatType
  }

export default reduxForm<WithdrawCheckoutFormValuesType, Props>({
  form: 'custodyWithdrawForm',
  destroyOnUnmount: false
})(Success)
