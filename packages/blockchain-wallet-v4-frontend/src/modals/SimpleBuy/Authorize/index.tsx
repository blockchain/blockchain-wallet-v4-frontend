import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { defaultTo, filter, path, prop } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Image, Text } from 'blockchain-info-components'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/utils'
import { FiatType, SBOrderType } from 'blockchain-wallet-v4/src/types'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import { actions, selectors } from 'data'
import { getCounterAmount, getCounterCurrency } from 'data/components/simpleBuy/model'
import { RootState } from 'data/rootReducer'
import { BankTransferAccountType } from 'data/types'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
const BackContainer = styled(Text)`
  display: flex;
  align-items: center;
  width: 100%;
  font-weight: 600;
  font-size: 20px;
`
const DropdownTitleRow = styled.div<{ isPaymentInformation?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: ${(props) => (props.isPaymentInformation ? '0 40px' : 'auto')};
  /* chevorn icon rotation */
  > span:last-child {
    size: 10px;
    transition: transform 0.2s;
    color: ${(props) => props.theme.grey600};
    &.active {
      transform: rotate(180deg);
    }
  }
`
const InfoTitle = styled(Title)`
  font-weight: 600;
  line-height: 1.5;
  color: ${(props) => props.theme.grey900};
`

const InfoDropdown = styled.div`
  max-height: 0;
  margin-top: 0;
  overflow: hidden;
  transition: max-height, margin-top 0.3s;
  &.isToggled {
    max-height: 100%;
    margin-top: 12px;
  }
`
const InfoText = styled(Title)`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.grey600};
  line-height: 1.5;
`
const Bottom = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
`
const DropdownRow = styled(Row)<{ isPaymentInformation?: boolean }>`
  padding: ${(props) => (props.isPaymentInformation ? '16px 0' : 'auto')};
`

const DropdownItem = ({ bodyText, isPaymentInformation, titleText }) => {
  const [isToggled, handleToggle] = useState(false)
  return (
    <DropdownRow isPaymentInformation={isPaymentInformation}>
      <DropdownTitleRow
        isPaymentInformation={isPaymentInformation}
        onClick={() => handleToggle(!isToggled)}
      >
        <InfoTitle>{titleText}</InfoTitle>
        <Icon name='chevron-down' className={isToggled ? 'active' : ''} />
      </DropdownTitleRow>
      <InfoDropdown className={isToggled ? 'isToggled' : ''}>
        <InfoText>{bodyText}</InfoText>
      </InfoDropdown>
    </DropdownRow>
  )
}

const Authorize = (props: Props) => {
  const { bankAccounts, order, simpleBuyActions } = props
  const counterAmount = getCounterAmount(props.order)
  const counterCurrency = getCounterCurrency(props.order)
  const [bankAccount] = filter(
    (b: BankTransferAccountType) => b.state === 'ACTIVE' && b.id === prop('paymentMethodId', order),
    defaultTo([])(bankAccounts)
  )
  const entity = path(['attributes', 'entity'], bankAccount)
  const entityName = entity === 'Safeconnect(UK)' ? 'SafeConnect' : 'SafeConnect (UAB)'

  return (
    <Wrapper>
      <FlyoutWrapper style={{ paddingBottom: '10px' }}>
        <BackContainer>
          <Image name='safe-connect' size='20px' style={{ marginRight: '28px' }} />
          <FormattedMessage
            id='modals.brokerage.authorize.title'
            defaultMessage='{entityName}'
            values={{ entityName }}
          />
        </BackContainer>
      </FlyoutWrapper>
      <FlyoutWrapper style={{ paddingBottom: '16px' }}>
        <Text size='20px' weight={600} color='grey900'>
          <FormattedMessage
            id='modals.brokerage.authrorize.approve'
            defaultMessage='Approve Your Payment'
          />
        </Text>
      </FlyoutWrapper>
      <Row>
        <Title>
          <FormattedMessage
            id='modals.brokerage.authorize.payment_total'
            defaultMessage='Payment Total'
          />
        </Title>
        <Value>
          {fiatToString({
            unit: counterCurrency as FiatType,
            value: counterAmount
          })}
        </Value>
      </Row>
      <DropdownItem
        isPaymentInformation
        titleText='Payment Information'
        bodyText={
          <>
            <Row>
              <InfoText>
                <FormattedMessage
                  id='modals.brokerage.authorize.payer'
                  defaultMessage='Payer Name'
                />
              </InfoText>
              <InfoTitle>{path(['details', 'accountName'], bankAccount)}</InfoTitle>
            </Row>
            <Row>
              <InfoText>
                <FormattedMessage
                  id='modals.brokerage.authorize.sort_code'
                  defaultMessage='Sort Code'
                />
              </InfoText>
              <InfoTitle>{path(['details', 'sortCode'], bankAccount)}</InfoTitle>
            </Row>
            <Row>
              <InfoText>
                <FormattedMessage
                  id='modals.brokerage.account_number'
                  defaultMessage='Account Number'
                />
              </InfoText>
              <InfoTitle>{path(['details', 'accountNumber'], bankAccount)}</InfoTitle>
            </Row>
            <Row>
              <InfoText>
                <FormattedMessage
                  id='modals.brokerage.authorize.payment_reference'
                  defaultMessage='Payment Reference'
                />
              </InfoText>
              <InfoTitle>BLOCKCHAIN</InfoTitle>
            </Row>
            <Row>
              <InfoText>
                <FormattedMessage
                  id='modals.brokerage.authorize.bank_name'
                  defaultMessage='Bank Name'
                />
              </InfoText>
              <InfoTitle>{path(['details', 'bankName'], bankAccount)}</InfoTitle>
            </Row>
          </>
        }
      />
      <DropdownItem
        isPaymentInformation={false}
        bodyText={
          <FormattedMessage
            id='modals.brokertitleage.authorize.data_sharing'
            defaultMessage='{entityName} will retrieve your bank data based on your request and provide this information to Blockchain.com.'
            values={{ entityName }}
          />
        }
        titleText={
          <FormattedMessage
            id='modals.brokerage.authorize.data_sharing'
            defaultMessage='Data Sharing'
          />
        }
      />
      <DropdownItem
        isPaymentInformation={false}
        bodyText={
          <FormattedMessage
            id='modals.brokerage.authorize.secure_connection'
            defaultMessage='Data is securely retrieved in read-only format and only for the duration agreed with you. You have the right to withdraw your consent at any time.'
          />
        }
        titleText={
          <FormattedMessage
            id='modals.brokerage.authorize.secure_connection.title'
            defaultMessage='Secure Connection'
          />
        }
      />
      <DropdownItem
        isPaymentInformation={false}
        bodyText={
          entityName === 'SafeConnect' ? (
            <FormattedMessage
              id='modals.brokerage.authorize.fca'
              defaultMessage='Blockchain.com is an agent of {entityName} Ltd. {entityName} Ltd is authorised and regulated by the Financial Conduct Authority under the Payment Service Regulations 2017 [827001] for the provision of Account Information and Payment Initiation services.'
              values={{ entityName }}
            />
          ) : (
            <FormattedMessage
              id='modals.brokerage.authorize.bol'
              defaultMessage='SafeConnect UAB is authorised and regulated by the Bank of Lithuania under Payments Law (LB002045) for the provision of Account Information and Payment Initiation services.'
            />
          )
        }
        titleText={
          entityName === 'SafeConnect' ? (
            <FormattedMessage
              id='modals.brokerage.authorize.fca.title'
              defaultMessage='FCA Authorisation'
            />
          ) : (
            <FormattedMessage
              id='modals.brokerage.authorize.bol.title'
              defaultMessage='Bank of Lithuania Authorisation'
            />
          )
        }
      />
      <Row>
        <InfoText>
          <FormattedMessage
            id='modals.brokerage.authorize.deposit_data.first'
            defaultMessage='To easily set up payments from your bank to Blockchain.com, we are about to securely re-direct you to your bank where you will be asked to confirm the payment via {entityName}, an FCA regulated payment initiation provider for Blockchain.com.'
            values={{ entityName }}
          />
        </InfoText>
        <InfoText style={{ margin: '15px 0' }}>
          <FormattedMessage
            id='modals.brokerage.authorize.deposit_data.second'
            defaultMessage='{entityName} will share these details with your bank, where you will then be asked to confirm the following payment setup.'
            values={{ entityName }}
          />
        </InfoText>
      </Row>
      <DropdownItem
        isPaymentInformation={false}
        bodyText={
          <>
            <FormattedMessage
              id='modals.brokerage.authorize.about_access'
              defaultMessage='{entityName} will then use these details with Blockchain.com solely for the purposes of buying cryptocurrencies. This consent request is a one-off, you will not receive additional requests once completed.'
              values={{ entityName }}
            />
            {entityName !== 'SafeConnect' && (
              <FormattedMessage
                id='modals.brokerage.authorize.bol.terms'
                defaultMessage='View SafeConnect UAB <a>Terms and Conditions</a> for more information.'
                values={{
                  a: (msg) => (
                    <a href='https://yapi.ly/GDNT' rel='noopener noreferrer' target='_blank'>
                      {msg}
                    </a>
                  )
                }}
              />
            )}
          </>
        }
        titleText={
          <FormattedMessage
            id='modals.brokerage.authorize.about_access.title'
            defaultMessage='About the Access'
          />
        }
      />
      <Row />
      <Bottom>
        <Button
          nature='primary'
          data-e2e='obApprove'
          type='submit'
          fullwidth
          height='48px'
          onClick={() => {
            simpleBuyActions.confirmSBOrder(order.paymentMethodId as string, order)
          }}
        >
          <FormattedMessage id='copy.approve' defaultMessage='Approve' />
        </Button>
        <Button
          nature='light-red'
          data-e2e='obDeny'
          type='button'
          fullwidth
          height='48px'
          color='red400'
          style={{ marginTop: '16px' }}
          onClick={() => props.handleClose()}
        >
          <FormattedMessage id='copy.deny' defaultMessage='Deny' />
        </Button>
      </Bottom>
    </Wrapper>
  )
}

const mapStateToProps = (state: RootState) => ({
  bankAccounts: selectors.components.brokerage
    .getBankTransferAccounts(state)
    .getOrElse([] as Array<BankTransferAccountType>)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  handleClose: () => void
  order: SBOrderType
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Authorize)
