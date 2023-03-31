import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, Padding, SemanticColors, Text } from '@blockchain-com/constellation'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'

import { fiatToString } from '@core/exchange/utils'
import {
  Button,
  Icon,
  Link,
  SpinningLoader,
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

import { EDDMessageContainer } from '../ActiveRewards.model'
import { FORM_NAME } from './DepositForm.constants'
import {
  AgreementContainer,
  AmountFieldContainer,
  ButtonContainer,
  CheckboxContainer,
  CustomField,
  CustomForm,
  ErrorText,
  FiatMaxContainer,
  GreyBlueCartridge,
  InfoText,
  NetworkFeeContainer,
  PrincipalCcyAbsolute,
  SendingWrapper,
  TermsContainer,
  ToggleCoinFiat,
  ToggleCoinText,
  ToggleFiatText,
  TopText
} from './DepositForm.styles'
import { SuccessPropsType } from './DepositForm.types'
import { maxDepositAmount, minDepositAmount } from './DepositForm.validation'

const DepositForm: React.FC<
  InjectedFormProps<{ form: string }, SuccessPropsType> & SuccessPropsType
> = ({
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
  isActiveRewardsWithdrawalEnabled,
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
        <Text color={SemanticColors.title} variant='title3'>
          <FormattedMessage
            id='modals.interest.deposit.sendingtitle'
            defaultMessage='In Progress...'
          />
        </Text>
        <Text color={SemanticColors.body} variant='body2'>
          <FormattedMessage
            id='modals.active-rewards.deposit.sendingsubtitle'
            defaultMessage='Sending {displayName} to your Active Rewards Account'
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
            id='modals.active-rewards.warning.title'
            defaultMessage='{coin} Active Rewards'
            values={{ coin }}
          />
        </TopText>
        <Padding bottom={0.5}>
          <InfoText>
            <Text color={SemanticColors.body} variant='paragraph1'>
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
                      <Text color={SemanticColors.primary} variant='paragraph1'>
                        {earnDepositLimits.maxCoin}
                      </Text>
                    ) : (
                      <Text color={SemanticColors.primary} variant='paragraph1'>
                        {maxDepositFiat}
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
        </Padding>
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
          forceCustodialFirst
          includeCustodial
          name='earnDepositAccount'
          rates={rates}
        />
        <Padding top={1.5} bottom={0.625}>
          <Flex justifyContent='space-between'>
            <Text color={SemanticColors.body} variant='paragraph1'>
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
          </Flex>
        </Padding>
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
              <Text color={SemanticColors.title} variant='paragraph2'>
                {displaySymbol}
              </Text>
            ) : (
              <Text color={SemanticColors.title} variant='paragraph2'>
                {currencySymbol}
              </Text>
            )}
          </PrincipalCcyAbsolute>
        </AmountFieldContainer>
        {depositAmountError && (
          <Padding top={0.125} right={0.3125}>
            <Flex alignItems='center' justifyContent='space-between'>
              {depositAmountError === 'ABOVE_MAX' ? (
                <>
                  <Text color={SemanticColors.error} variant='paragraph1'>
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
                  <Text color={SemanticColors.error} variant='paragraph1'>
                    <FormattedMessage
                      id='modals.active-rewards.deposit.mintransfer'
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
            </Flex>
          </Padding>
        )}
        {isEDDRequired && (
          <EDDMessageContainer>
            <Text color={SemanticColors.warning} variant='paragraph2'>
              <FormattedMessage
                id='modals.active-rewards.deposit.edd_need.title'
                defaultMessage='More information needed'
              />
            </Text>
            <Text color={SemanticColors.title} variant='caption1'>
              <FormattedMessage
                id='modals.active-rewards.deposit.edd_need'
                defaultMessage="Transferring requires further verification. We'll ask you for those details in the next step."
              />
            </Text>
          </EDDMessageContainer>
        )}
        {!isCustodial && (
          <NetworkFeeContainer>
            <Text color={SemanticColors.title} variant='paragraph1'>
              <FormattedMessage
                defaultMessage='Est network fee'
                id='modals.active-rewards.deposit.networkfee'
              />
            </Text>
            <Flex alignItems='flex-end' flexDirection='column' gap={2}>
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
            </Flex>
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
        <Flex flexDirection='column' gap={8} justifyContent='center'>
          <CheckboxContainer>
            <Field component={CheckBox} hideErrors name='terms' validate={[required]}>
              <TermsContainer>
                <Text color={SemanticColors.title} variant='paragraph1'>
                  <FormattedMessage
                    id='modals.interest.deposit.termsread'
                    defaultMessage='I have read and agreed to the'
                  />
                </Text>{' '}
                <Link
                  href='https://www.blockchain.com/legal'
                  target='_blank'
                  size='14px'
                  weight={500}
                >
                  <FormattedMessage
                    id='modals.interest.deposit.termsservice'
                    defaultMessage='Terms of Service'
                  />
                </Link>{' '}
                <Text color={SemanticColors.title} variant='paragraph1'>
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
          </CheckboxContainer>
          <CheckboxContainer>
            <Field component={CheckBox} hideErrors name='agreement1' validate={[required]}>
              <AgreementContainer>
                <Text color={SemanticColors.title} variant='paragraph1'>
                  <FormattedMessage
                    id='modals.active-rewards.deposit.agreement2'
                    defaultMessage='I agree to transfer {coin} to my Active Rewards Account {privateKeyMessage}. I understand that price movements may result in a reduction of my {coin} balance, and that my transfer will be placed in next week’s strategy.'
                    values={{
                      coin,
                      privateKeyMessage: !isCustodial ? (
                        <FormattedMessage
                          defaultMessage='and pay a network fee'
                          id='modals.active-rewards.deposit.agreement2.privatekey'
                        />
                      ) : (
                        ''
                      )
                    }}
                  />
                </Text>
              </AgreementContainer>
            </Field>
          </CheckboxContainer>
          {!isActiveRewardsWithdrawalEnabled && (
            <CheckboxContainer>
              <Field component={CheckBox} hideErrors name='agreement2' validate={[required]}>
                <AgreementContainer>
                  <Text color={SemanticColors.title} variant='paragraph1'>
                    <FormattedMessage
                      id='modals.active-rewards.deposit.agreement3'
                      defaultMessage="I understand that withdrawals for Active Rewards are not yet enabled. Weekly withdrawal functionality is being finalized and will be enabled approximately end of January 2023. Until then, {coin} assets in Active Rewards Accounts will be re-subscribed to each week's strategy."
                      values={{
                        coin
                      }}
                    />
                  </Text>
                </AgreementContainer>
              </Field>
            </CheckboxContainer>
          )}
        </Flex>
        <ButtonContainer>
          <Button
            data-e2e='interestDepositSubmit'
            disabled={invalid || insufficientEth}
            fullwidth
            height='48px'
            nature='primary'
            type='submit'
          >
            <Text color={SemanticColors.background} variant='body2'>
              <FormattedMessage
                id='modals.active-rewards.deposit.addbalance'
                defaultMessage='Add Balance'
              />
            </Text>
          </Button>
        </ButtonContainer>
      </FlyoutWrapper>
    </CustomForm>
  )
}

export default reduxForm<{ form: string }, SuccessPropsType>({
  form: FORM_NAME
})(DepositForm)
