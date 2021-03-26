import React, { ReactChild } from 'react'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { isEmpty } from 'ramda'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { displayFiatToFiat } from 'blockchain-wallet-v4/src/exchange'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import {
  BankTransferAccountType,
  BeneficiaryType,
  NabuMoneyFloatType
} from 'blockchain-wallet-v4/src/types'
import { BlueCartridge, ErrorCartridge } from 'components/Cartridge'
import CoinDisplay from 'components/Display/CoinDisplay'
import { AmountTextBox } from 'components/Exchange'
import { FlyoutWrapper } from 'components/Flyout'
import { Form } from 'components/Form'
import { UserDataType, WithdrawCheckoutFormValuesType } from 'data/types'

import { Row } from '../../components'
import { DepositOrWithdrawal, normalizeAmount } from '../../model'
import { Props as OwnProps, SuccessStateType } from '.'
import Beneficiary from './Beneficiary'
import LockTimeTooltip from './LockTimeTooltip'
import { maximumAmount, minimumAmount } from './validation'

const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
`
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
  justify-content: center;
`
const CoinContainer = styled.div`
  display: flex;
  flex-direction: row;
`
const PendingText = styled(Text)`
  a {
    color: ${props => props.theme.blue600};
    text-decoration: none;
  }
`
const CustomBlueCartridge = styled(BlueCartridge)`
  cursor: pointer;
`
const CustomErrorCartridge = styled(ErrorCartridge)`
  cursor: pointer;
`
const Limits = styled.div`
  display: flex;
  flex-direction: row;
  padding: 15px 40px;
  border-top: 1px solid ${props => props.theme.grey000};
  border-bottom: 1px solid ${props => props.theme.grey000};
`

const LimitWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`
const FiatIconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`
const AmountRow = styled(Row)`
  position: relative;
  padding: 24px;
  justify-content: center;
  border: 0;
`
const SubIconWrapper = styled.div`
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme['fiat-light']};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  position: absolute;
  right: -20px;
`

const BlueRedCartridge = ({
  children,
  error
}: {
  children: ReactChild
  error: boolean
}) => {
  if (error)
    return <CustomErrorCartridge role='button'>{children}</CustomErrorCartridge>
  return <CustomBlueCartridge role='button'>{children}</CustomBlueCartridge>
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
  const showFee = Number(props.fees.value) > 0 && !transferAccount

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
    <CustomForm onSubmit={props.handleSubmit}>
      <FlyoutWrapper>
        <Top>
          <Text color='grey800' size='20px' weight={600}>
            <DepositOrWithdrawal
              fiatCurrency={props.fiatCurrency}
              orderType={'WITHDRAWAL'}
            />
          </Text>
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
      </FlyoutWrapper>
      <Limits>
        <LimitWrapper>
          <Text color='grey600' size='14px' lineHeight={'25px'} weight={500}>
            <FormattedMessage
              id='modals.brokerage.fiat_account'
              defaultMessage='{currency} Account'
              values={{ currency: props.fiatCurrency }}
            />
          </Text>
          <CoinDisplay
            size='14px'
            color='grey900'
            weight={600}
            coin={props.fiatCurrency}
          >
            {props.withdrawableBalance}
          </CoinDisplay>
          {showInfoTooltip && <LockTimeTooltip />}
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
        </LimitWrapper>
        <FiatIconWrapper>
          <Icon
            color={props.supportedCoins[props.fiatCurrency].coinCode}
            name={props.supportedCoins[props.fiatCurrency].coinCode}
            size='32px'
          />
          <SubIconWrapper>
            <Icon size='24px' color='USD' name='arrow-up' />
          </SubIconWrapper>
        </FiatIconWrapper>
      </Limits>

      <FlyoutWrapper>
        <CoinContainer style={{ marginTop: '4px' }} />
        {showPendingTransactions && (
          <CoinContainer style={{ marginTop: '4px' }}>
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
        <AmountRow id='amount-row'>
          <Text size='56px' color='textBlack' weight={500}>
            {Currencies[props.fiatCurrency].units[props.fiatCurrency].symbol}
          </Text>
          <Field
            data-e2e='withdrawAmountInput'
            name='amount'
            component={AmountTextBox}
            normalize={normalizeAmount}
            validate={[minimumAmount, maximumAmount]}
            placeholder='0'
            {...{
              autoFocus: true,
              hideError: true
            }}
          />
        </AmountRow>
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
          <Beneficiary
            {...props}
            transferAccount={transferAccount || undefined}
            beneficiary={
              !transferAccount && beneficiary ? beneficiary : undefined
            }
          />
        </ToContainer>

        <ActionContainer>
          <Button
            disabled={
              props.invalid ||
              !userCanWithdraw ||
              (!beneficiary && !transferAccount)
            }
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
      </FlyoutWrapper>
    </CustomForm>
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
