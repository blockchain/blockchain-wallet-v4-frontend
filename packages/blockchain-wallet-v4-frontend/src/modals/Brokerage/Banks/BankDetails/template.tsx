import React from 'react'
import { FormattedMessage } from 'react-intl'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import {
  Button,
  HeartbeatLoader,
  Icon,
  Image,
  Text
} from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { Form } from 'components/Form'
import { getBankLogoImageName } from 'services/images'

import { LinkDispatchPropsType, LinkStatePropsType, OwnProps } from '.'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
`
const BankFlyoutWrapper = styled(FlyoutWrapper)`
  justify-content: flex-end;
  display: flex;
  flex-direction: column;
  height: 100%;
`
const DisclaimerWrapper = styled(FlyoutWrapper)`
  justify-content: center;
  display: flex;
`
const CloseContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`
const CurrencyContainer = styled.div`
  margin-top: 35px;
  display: flex;
  flex-direction: column;
  padding: 16px 0 16px 40px;
  border-top: 1px solid ${props => props.theme.grey000};
  border-bottom: 1px solid ${props => props.theme.grey000};
`
const BankIconWrapper = styled.div`
  justify-content: left;
  flex-direction: row;
  display: flex;
`

export const BankDetails = styled.div`
  margin-top: 24px;
`

type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

const Template: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  const { account, walletCurrency } = props

  const bankAccountName =
    account && 'details' in account ? (
      `${account.details?.bankName || ''} ${account.details?.accountNumber ||
        ''}`
    ) : (
      <FormattedMessage id='copy.bank_account' defaultMessage='Bank Account' />
    )

  const accountDetails = account && 'details' in account && account.details
  return (
    <Wrapper>
      <FlyoutWrapper>
        <CloseContainer>
          <Icon
            cursor
            data-e2e='bankDetailsCloseIcon'
            name='close'
            size='20px'
            color='grey600'
            role='button'
            onClick={props.handleClose}
          />
        </CloseContainer>

        <BankIconWrapper>
          {accountDetails && (
            <Image name={getBankLogoImageName(accountDetails.bankName)} />
          )}
        </BankIconWrapper>
        <BankDetails>
          <Text size='24px' color='grey900' weight={600}>
            {bankAccountName}
          </Text>
          <Text size='24px' color='grey600' weight={500}>
            {(accountDetails &&
              accountDetails.bankAccountType?.toLowerCase()) ||
              ''}{' '}
            <FormattedMessage
              id='scenes.settings.general.account'
              defaultMessage='account'
            />{' '}
            {(account &&
              'details' in account &&
              account.details.accountNumber) ||
              ''}
          </Text>
        </BankDetails>
      </FlyoutWrapper>
      <CurrencyContainer>
        <Text color='grey600' size='14px' weight={500}>
          <FormattedMessage id='copy.currency' defaultMessage='Currency' />
        </Text>
        <Text color='grey800' size='16px' weight={600}>
          {walletCurrency}
        </Text>
      </CurrencyContainer>
      <DisclaimerWrapper>
        <Text
          color='grey600'
          size='12px'
          weight={500}
          style={{ marginTop: '40px', textAlign: 'center' }}
        >
          <FormattedMessage
            id='modals.brokerage.bank_preview.disclaimer'
            defaultMessage='This account can be used for buys, sells & withdrawals.'
          />
        </Text>
      </DisclaimerWrapper>
      <BankFlyoutWrapper>
        <Form onSubmit={props.handleSubmit}>
          <Button
            fullwidth
            size='16px'
            height='48px'
            nature='light-red'
            data-e2e='removeBankDetials'
            disabled={props.submitting}
            type='submit'
          >
            {props.submitting ? (
              <HeartbeatLoader color='blue100' height='20px' width='20px' />
            ) : (
              <FormattedMessage id='buttons.remove' defaultMessage='Remove' />
            )}
          </Button>
        </Form>
      </BankFlyoutWrapper>
    </Wrapper>
  )
}

export default reduxForm<{}, Props>({ form: 'linkedBanks' })(Template)
