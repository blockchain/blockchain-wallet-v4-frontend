import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Box, Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/utils'
import { FiatType, SBPaymentTypes } from 'blockchain-wallet-v4/src/types'
import { ErrorCartridge } from 'components/Cartridge'
import { AmountTextBox } from 'components/Exchange'
import { FlyoutWrapper } from 'components/Flyout'
import { Form } from 'components/Form'
import { DisplayPaymentIcon } from 'components/SimpleBuy'
import { model } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { AddBankStepType, BankDWStepType, BrokerageModalOriginType } from 'data/types'

// TODO: move this to somewhere more generic
import {
  getIcon,
  PaymentArrowContainer,
  PaymentText
} from '../../../../SimpleBuy/EnterAmount/Checkout/Payment/model'
import { Row } from '../../components'
import { DepositOrWithdrawal, normalizeAmount, RightArrowIcon } from '../../model'
import { LinkStatePropsType, Props as _P, SuccessStateType } from '.'
import { getDefaultMethod, getText } from './model'
import { maximumAmount, minimumAmount } from './validation'

const { DEPOSIT_CONTINUE, SELECT_DEPOSIT_METHOD } = model.analytics.FIAT_DEPOSIT_EVENTS

const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const Wrapper = styled(FlyoutWrapper)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`
const HeaderWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  margin: 40px 40px 29px 40px;
`
const Limits = styled.div`
  display: flex;
  flex-direction: row;
  padding: 15px 40px;
  border-top: 1px solid ${(props) => props.theme.grey000};
  border-bottom: 1px solid ${(props) => props.theme.grey000};
`
const LimitWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`
const LeftTopCol = styled.div`
  display: flex;
  align-items: center;
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
  background-color: ${(props) => props.theme['fiat-light']};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  position: absolute;
  right: -20px;
`

const Header = ({ brokerageActions, fiatCurrency }) => {
  return (
    <HeaderWrapper>
      <TopText color='grey800' size='20px' weight={600}>
        <LeftTopCol>
          <Icon
            cursor
            data-e2e='depositBackToDepositMethods'
            name='arrow-back'
            size='20px'
            color='grey400'
            role='button'
            style={{ marginRight: '8px' }}
            onClick={() =>
              brokerageActions.setDWStep({
                dwStep: BankDWStepType.DEPOSIT_METHODS
              })
            }
          />
          <DepositOrWithdrawal fiatCurrency={fiatCurrency} orderType='DEPOSIT' />
        </LeftTopCol>
      </TopText>
    </HeaderWrapper>
  )
}

const LimitSection = ({ fiatCurrency, paymentMethods }) => {
  const bankTransfer = paymentMethods.methods.find(
    (method) => method.type === SBPaymentTypes.BANK_TRANSFER
  )

  if (bankTransfer?.limits) {
    return (
      <Limits>
        <LimitWrapper>
          <Text color='grey600' size='14px' lineHeight='25px' weight={500}>
            <FormattedMessage id='modals.brokerage.daily_limit' defaultMessage='Daily Limit' />
          </Text>
          <Text color='grey800' size='14px' lineHeight='25px' weight={600}>
            {fiatToString({
              unit: fiatCurrency as FiatType,
              value: convertBaseToStandard('FIAT', bankTransfer.limits.daily.available)
            })}{' '}
            <FormattedMessage id='copy.available' defaultMessage='Available' />
          </Text>
        </LimitWrapper>
        <FiatIconWrapper>
          <Icon color={fiatCurrency} name={fiatCurrency} size='32px' />
          <SubIconWrapper>
            <Icon size='24px' color='USD' name='arrow-down' />
          </SubIconWrapper>
        </FiatIconWrapper>
      </Limits>
    )
  }
  // TODO: return something if no limits are available
  return <></>
}

const Amount = ({ fiatCurrency }) => {
  return (
    <FlyoutWrapper>
      <AmountRow id='amount-row'>
        <Text size='56px' color='textBlack' weight={500}>
          {Currencies[fiatCurrency]?.units[fiatCurrency].symbol}
        </Text>
        <Field
          data-e2e='depositAmountInput'
          name='amount'
          component={AmountTextBox}
          validate={[maximumAmount, minimumAmount]}
          normalize={normalizeAmount}
          maxFontSize='56px'
          placeholder='0'
          // leave fiatActive always to avoid 50% width in HOC?
          fiatActive
          {...{
            autoFocus: true,
            hideError: true
          }}
        />
      </AmountRow>
    </FlyoutWrapper>
  )
}

const Account = ({
  analyticsActions,
  bankTransferAccounts,
  brokerageActions,
  defaultMethod,
  fiatCurrency,
  invalid
}: OwnProps) => {
  const dMethod = getDefaultMethod(defaultMethod, bankTransferAccounts)

  return (
    <Box
      disabled={invalid}
      role='button'
      data-e2e='paymentMethodSelect'
      onClick={() => {
        // If user has no saved banks take them to add bank flow
        // else take them to enter amount form with default bank
        if (!bankTransferAccounts.length) {
          brokerageActions.showModal({
            origin: BrokerageModalOriginType.ADD_BANK_DEPOSIT,
            modalType: fiatCurrency === 'USD' ? 'ADD_BANK_YODLEE_MODAL' : 'ADD_BANK_YAPILY_MODAL'
          })
          brokerageActions.setAddBankStep({
            addBankStep: AddBankStepType.ADD_BANK
          })
        } else {
          brokerageActions.setDWStep({
            dwStep: BankDWStepType.BANK_LIST
          })
        }
        analyticsActions.logEvent(SELECT_DEPOSIT_METHOD)
      }}
      isMethod={!!dMethod}
    >
      <DisplayPaymentIcon showBackground={!dMethod}>
        {getIcon(dMethod, false, invalid)}
      </DisplayPaymentIcon>
      <PaymentText isMethod={!!dMethod}>{getText(dMethod)}</PaymentText>
      <PaymentArrowContainer>
        <RightArrowIcon cursor disabled={invalid} name='arrow-back' size='20px' color='grey600' />
      </PaymentArrowContainer>
    </Box>
  )
}

const NextButton = ({ analyticsActions, defaultMethod, invalid, pristine, submitting }) => {
  return (
    <Button
      data-e2e='submitDepositAmount'
      height='48px'
      size='16px'
      nature='primary'
      type='submit'
      fullwidth
      disabled={invalid || pristine || submitting || !defaultMethod}
      onClick={() => analyticsActions.logEvent(DEPOSIT_CONTINUE)}
    >
      {submitting ? (
        <HeartbeatLoader height='16px' width='16px' color='white' />
      ) : (
        <FormattedMessage id='buttons.next' defaultMessage='Next' />
      )}
    </Button>
  )
}

const Success = (props: OwnProps) => {
  const amtError = props.formErrors.amount
  const isUserEligible =
    props.paymentMethods.methods.length &&
    props.paymentMethods.methods.find((method) => method.limits.max !== '0')

  return (
    <div>
      {isUserEligible && (
        <CustomForm onSubmit={props.handleSubmit}>
          <Header {...props} />
          <LimitSection {...props} />
          <Wrapper>
            <Amount {...props} />
            <Account {...props} />
            <NextButton {...props} />
            {amtError && (
              <ErrorCartridge style={{ marginTop: '16px' }} data-e2e='checkoutError'>
                <Icon name='alert-filled' color='red600' style={{ marginRight: '4px' }} />
                Error: {amtError}
              </ErrorCartridge>
            )}
          </Wrapper>
        </CustomForm>
      )}
    </div>
  )
}

type Props = _P & SuccessStateType & LinkStatePropsType
type OwnProps = Props & InjectedFormProps<{}, Props>

export default reduxForm<{}, OwnProps>({
  destroyOnUnmount: false,
  form: 'brokerageTx'
})(Success)
