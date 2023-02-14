import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'

import { fiatToString } from '@core/exchange/utils'
import {
  Button,
  Icon,
  Link,
  SpinningLoader,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { FlyoutWrapper } from 'components/Flyout'
import CheckBox from 'components/Form/CheckBox'
import CoinBalanceDropdown from 'components/Form/CoinBalanceDropdown'
import NumberBox from 'components/Form/NumberBox'
import { required } from 'services/forms'
import { debounce } from 'utils/helpers'

import { EDDMessageContainer } from '../Staking.model'
import {
  AgreementContainer,
  AmountError,
  AmountFieldContainer,
  ButtonContainer,
  CustomField,
  CustomForm,
  CustomFormLabel,
  ErrorText,
  FiatMaxContainer,
  FORM_NAME,
  GreyBlueCartridge,
  InfoText,
  NetworkAmountContainer,
  NetworkFeeContainer,
  PrincipalCcyAbsolute,
  SendingWrapper,
  TermsContainer,
  ToggleCoinFiat,
  ToggleCoinText,
  ToggleFiatText,
  TopText
} from './DepositForm.model'
import { SuccessPropsType } from './DepositForm.types'
import { maxDepositAmount, minDepositAmount } from './DepositForm.validation'

const DepositForm: React.FC<
  InjectedFormProps<{ form: string }, SuccessPropsType> & SuccessPropsType
> = ({
  bondingDays,
  coin,
  currencySymbol,
  depositAmountError,
  depositFee,
  displayCoin,
  displaySymbol,
  earnDepositLimits,
  handleAmountChanged,
  handleChangeDepositAmount,
  handleDisplayToggle,
  handleFormSubmit,
  handleMaxAmountClicked,
  handleMinAmountClicked,
  insufficientEth,
  invalid,
  isCustodial,
  isEDDRequired,
  isErc20,
  maxDepositFiat,
  rates,
  submitting,
  walletCurrency
}: SuccessPropsType) => {
  if (submitting) {
    return (
      <SendingWrapper>
        <SpinningLoader />
        <Text weight={600} color='grey800' size='20px' style={{ marginTop: '24px' }}>
          <FormattedMessage
            id='modals.interest.deposit.sendingtitle'
            defaultMessage='In Progress...'
          />
        </Text>
        <Text weight={600} color='grey600' size='16px' style={{ marginTop: '24px' }}>
          <FormattedMessage
            id='modals.staking.deposit.sendingsubtitle'
            defaultMessage='Sending {displayName} to your Staking Account'
            values={{ displayName: displaySymbol }}
          />
        </Text>
      </SendingWrapper>
    )
  }

  return (
    <CustomForm onSubmit={handleFormSubmit}>
      <FlyoutWrapper style={{ paddingBottom: '0' }}>
        <TopText color='grey800' size='20px' weight={600}>
          <FormattedMessage
            id='modals.staking.title'
            defaultMessage='Stake {coin}'
            values={{ coin }}
          />
        </TopText>
        <InfoText>
          <Text
            color='grey600'
            weight={500}
            size='14px'
            style={{ lineHeight: '1.5', margin: '18px 0 8px 0' }}
          >
            {!insufficientEth && (
              <>
                <FormattedMessage
                  id='modals.interest.deposit.youcantransfer'
                  defaultMessage='You can transfer up to'
                  values={{
                    coin
                  }}
                />{' '}
                <FiatMaxContainer onClick={handleChangeDepositAmount}>
                  {displayCoin ? (
                    <Text color='blue600' size='14px' weight={500}>
                      {earnDepositLimits.maxCoin}{' '}
                    </Text>
                  ) : (
                    <Text color='blue600' size='14px' weight={500}>
                      {maxDepositFiat}{' '}
                    </Text>
                  )}
                </FiatMaxContainer>{' '}
                <FormattedMessage
                  id='modals.interest.deposit.uptoamount2'
                  defaultMessage='of {coin} from this wallet.'
                  values={{
                    coin: displaySymbol
                  }}
                />
                <TooltipHost id='modals.interest.depositmax.tooltip'>
                  <TooltipIcon name='info' size='12px' />
                </TooltipHost>
              </>
            )}
          </Text>
        </InfoText>
        {isErc20 && insufficientEth && (
          <ErrorText>
            <Icon name='alert-filled' color='red600' style={{ marginRight: '4px' }} />
            <FormattedMessage
              id='modals.interest.deposit.notenougheth'
              defaultMessage='ETH is required to send {coinTicker}. You do not have enough ETH to perform a transaction.'
              values={{ coinTicker: coin }}
            />
          </ErrorText>
        )}
        <CoinBalanceDropdown
          coin={coin}
          fiatCurrency={walletCurrency}
          includeCustodial
          name='earnDepositAccount'
          rates={rates}
        />
        <CustomFormLabel>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.interest.deposit.transferamount'
              defaultMessage='Enter transfer amount'
            />{' '}
          </Text>
          <ToggleCoinFiat>
            <ToggleFiatText
              displayCoin={displayCoin}
              onClick={() => handleDisplayToggle(false)}
              data-e2e='toggleFiat'
            >
              {walletCurrency}
            </ToggleFiatText>
            |{' '}
            <ToggleCoinText
              displayCoin={displayCoin}
              onClick={() => handleDisplayToggle(true)}
              data-e2e='toggleCoin'
            >
              {displaySymbol}
            </ToggleCoinText>
          </ToggleCoinFiat>
        </CustomFormLabel>
        <AmountFieldContainer>
          <CustomField
            coin={coin}
            component={NumberBox}
            data-e2e='depositAmount'
            // @ts-ignore
            disabled={insufficientEth}
            displayCoin={displayCoin}
            name='depositAmount'
            validate={[required, minDepositAmount, maxDepositAmount]}
            {...{
              errorBottom: true,
              errorLeft: true
            }}
            onChange={debounce((event) => {
              handleAmountChanged(event)
            }, 500)}
          />
          <PrincipalCcyAbsolute>
            {displayCoin ? (
              <Text color='grey800' size='14px' weight={600}>
                {displaySymbol}
              </Text>
            ) : (
              <Text color='grey800' size='14px' weight={600}>
                {currencySymbol}
              </Text>
            )}
          </PrincipalCcyAbsolute>
        </AmountFieldContainer>
        {depositAmountError && (
          <AmountError>
            {depositAmountError === 'ABOVE_MAX' ? (
              <>
                <Text size='14px' weight={500} color='red600'>
                  <FormattedMessage
                    id='modals.interest.deposit.maxtransfer'
                    defaultMessage='Maximum transfer: {maxFiat}'
                    values={{
                      maxFiat: displayCoin
                        ? `${earnDepositLimits.maxCoin} ${displaySymbol}`
                        : fiatToString({
                            unit: walletCurrency,
                            value: earnDepositLimits.maxFiat
                          })
                    }}
                  />
                </Text>
                <GreyBlueCartridge
                  data-e2e='interestMax'
                  role='button'
                  onClick={handleMaxAmountClicked}
                >
                  <FormattedMessage
                    id='modals.interest.deposit.maxtransfer.button'
                    defaultMessage='Transfer Max'
                  />
                </GreyBlueCartridge>
              </>
            ) : (
              <>
                <Text size='14px' weight={500} color='red600'>
                  <FormattedMessage
                    id='modals.staking.deposit.mintransfer'
                    defaultMessage='Minimum required: {minFiat} {walletCurrency} ({minCoin} {coin})'
                    values={{
                      coin,
                      minCoin: earnDepositLimits.minCoin,
                      minFiat: earnDepositLimits.minFiat,
                      walletCurrency
                    }}
                  />
                </Text>
                <GreyBlueCartridge
                  data-e2e='interestMin'
                  role='button'
                  onClick={handleMinAmountClicked}
                >
                  <FormattedMessage
                    id='modals.interest.deposit.mintransfer.button'
                    defaultMessage='Transfer Min'
                  />
                </GreyBlueCartridge>
              </>
            )}
          </AmountError>
        )}
        {isEDDRequired && (
          <EDDMessageContainer>
            <Text color='orange700' size='14px' weight={600}>
              <FormattedMessage
                id='modals.staking.deposit.edd_need.title'
                defaultMessage='More information needed'
              />
            </Text>
            <Text color='grey900' size='12px' weight={500}>
              <FormattedMessage
                id='modals.interest.deposit.edd_need'
                defaultMessage="Transferring this amount requires further verification. We'll ask you for those details in the next step."
              />
            </Text>
          </EDDMessageContainer>
        )}
        {!isCustodial && (
          <NetworkFeeContainer>
            <Text color='grey900' size='14px' weight={500}>
              <FormattedMessage
                defaultMessage='Est network fee'
                id='modals.staking.deposit.networkfee'
              />
            </Text>
            <NetworkAmountContainer>
              <CoinDisplay
                coin={coin}
                color='grey900'
                cursor='inherit'
                data-e2e={`${coin}-network-fee`}
                size='14px'
                weight={600}
              >
                {depositFee}
              </CoinDisplay>
              <FiatDisplay
                coin={coin}
                color='grey700'
                currency={walletCurrency}
                data-e2e={`${walletCurrency}-network-fee`}
                size='14px'
                weight={500}
              >
                {depositFee}
              </FiatDisplay>
            </NetworkAmountContainer>
          </NetworkFeeContainer>
        )}
      </FlyoutWrapper>
      <FlyoutWrapper
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'flex-end'
        }}
      >
        <Field component={CheckBox} hideErrors name='terms' validate={[required]}>
          <TermsContainer>
            <Text lineHeight='1.4' size='14px' weight={500}>
              <FormattedMessage
                id='modals.interest.deposit.termsread'
                defaultMessage='I have read and agreed to the'
              />
            </Text>{' '}
            <Link href='https://www.blockchain.com/legal' target='_blank' size='14px' weight={500}>
              <FormattedMessage
                id='modals.interest.deposit.termsservice'
                defaultMessage='Terms of Service'
              />
            </Link>{' '}
            <Text lineHeight='1.4' size='14px' weight={500}>
              &
            </Text>{' '}
            <Link
              href='https://www.blockchain.com/legal/privacy'
              target='_blank'
              size='14px'
              weight={500}
            >
              <FormattedMessage id='modals.interest.deposit.privacy' defaultMessage='Privacy' />
            </Link>
            .
          </TermsContainer>
        </Field>
        <Field component={CheckBox} hideErrors name='agreement' validate={[required]}>
          <AgreementContainer>
            <Text lineHeight='1.4' size='14px' weight={500}>
              <FormattedMessage
                id='modals.staking.deposit.agreement2_1'
                defaultMessage='I agree to transfer {coin} to my Staking Account{privateKeyMessage}. I understand that I can’t unstake until withdrawals are enabled on Ethereum{bondingMessage}.'
                values={{
                  bondingMessage:
                    bondingDays > 0 ? (
                      <FormattedMessage
                        defaultMessage=' and funds are subject to a bonding period of {bondingDays} {days} before generating rewards'
                        id='modals.staking.deposit.agreement2.bondingday'
                        values={{
                          bondingDays,
                          days:
                            bondingDays > 1 ? (
                              <FormattedMessage
                                defaultMessage='days'
                                id='modals.staking.warning.content.subtitle.days'
                              />
                            ) : (
                              <FormattedMessage
                                defaultMessage='day'
                                id='modals.staking.warning.content.subtitle.day'
                              />
                            )
                        }}
                      />
                    ) : (
                      ''
                    ),
                  coin,
                  privateKeyMessage: !isCustodial ? (
                    <FormattedMessage
                      defaultMessage=' and pay a network fee'
                      id='modals.staking.deposit.agreement2.privatekey'
                    />
                  ) : (
                    ''
                  )
                }}
              />
            </Text>
          </AgreementContainer>
        </Field>
        <ButtonContainer>
          <Button
            data-e2e='interestDepositSubmit'
            disabled={invalid || insufficientEth}
            fullwidth
            height='48px'
            nature='primary'
            type='submit'
          >
            <Text size='16px' weight={600} color='white'>
              <FormattedMessage
                id='modals.interest.deposit.confirmtransfer'
                defaultMessage='Confirm Transfer'
              />
            </Text>
          </Button>
        </ButtonContainer>
      </FlyoutWrapper>
    </CustomForm>
  )
}

export default reduxForm<{ form: string }, SuccessPropsType>({
  destroyOnUnmount: false,
  form: FORM_NAME
})(DepositForm)
