import { Button, Icon, Link, Text, TextGroup } from 'blockchain-info-components'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { LinkDispatchPropsType, OwnProps, SuccessStateType } from '.'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import React from 'react'
import styled from 'styled-components'

type Props = OwnProps & SuccessStateType & LinkDispatchPropsType

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
`
const Bottom = styled(FlyoutWrapper)`
  display: flex;
  padding-top: 24px;
  flex-direction: column;
  height: 100%;
`

const OkButton = styled(Button)`
  size: 16px;
  height: 48px;
  margin-top: 24px;
`
const InfoContainer = styled.div`
  margin-top: 16px;
`
const LegalWrapper = styled(TextGroup)`
  margin-top: 20px;
`

const Success: React.FC<Props> = props => {
  return (
    <Wrapper>
      <div>
        <FlyoutWrapper>
          <TopText color='grey800' size='20px' weight={600}>
            <Icon
              cursor
              name='arrow-left'
              size='20px'
              color='grey600'
              style={{ marginRight: '24px' }}
              role='button'
              onClick={() =>
                props.simpleBuyActions.setStep({
                  step: 'ORDER_SUMMARY',
                  order: props.order
                })
              }
            />
            <FormattedMessage
              id='modals.simplebuy.transferdetails'
              defaultMessage='Transfer Details'
            />
          </TopText>
          <InfoContainer>
            <Text color='grey600' weight={500} size='14px'>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.info'
                defaultMessage='Securely transfer {fiatCurrency} from your bank account to Blockchain.com. Depending on the transfer method and availability of funds, this may take up to 1 business day.'
                values={{
                  fiatCurrency: props.order.inputCurrency
                }}
              />
            </Text>
          </InfoContainer>
        </FlyoutWrapper>
        {(props.account.currency === 'USD' ||
          props.account.currency === 'EUR') && (
          <Row>
            <Title>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.bankname'
                defaultMessage='Bank Name'
              />
            </Title>
            <Value>{props.account.agent.name}</Value>
          </Row>
        )}
        {props.account.currency === 'EUR' && (
          <Row>
            <Title>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.bankcountry'
                defaultMessage='Bank Country'
              />
            </Title>
            <Value>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.estonia'
                defaultMessage='Estonia'
              />
            </Value>
          </Row>
        )}
        {props.account.currency === 'EUR' && (
          <Row>
            <Title>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.IBAN'
                defaultMessage='IBAN'
              />
            </Title>
            <Value>{props.account.address}</Value>
          </Row>
        )}
        {props.account.currency === 'GBP' && (
          <Row>
            <Title>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.account'
                defaultMessage='Account Number'
              />
            </Title>
            <Value>{props.account.agent.account}</Value>
          </Row>
        )}
        {props.account.currency === 'GBP' && (
          <Row>
            <Title>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.sortcode'
                defaultMessage='Sort Code'
              />
            </Title>
            <Value>{props.account.agent.code}</Value>
          </Row>
        )}
        {props.account.currency === 'EUR' && (
          <Row>
            <Title>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.swift'
                defaultMessage='Bank Code (SWIFT / BIC)'
              />
            </Title>
            <Value>{props.account.agent.code}</Value>
          </Row>
        )}
        {props.account.currency === 'USD' && (
          <Row>
            <Title size='14px' weight={500} color='grey600'>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.address'
                defaultMessage='Address'
              />
            </Title>
            <Value>{props.account.agent.address}</Value>
          </Row>
        )}
        {props.account.currency === 'USD' && (
          <Row>
            <Title size='14px' weight={500} color='grey600'>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.routingnumber'
                defaultMessage='Routing Number'
              />
            </Title>
            <Value>{props.account.agent.routingNumber}</Value>
          </Row>
        )}
        <Row>
          <Title>
            <FormattedMessage
              id='modals.simplebuy.transferdetails.recipient'
              defaultMessage='Recipient'
            />
          </Title>
          <Value>
            {props.userData.firstName} {props.userData.lastName}
          </Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage
              id='modals.simplebuy.transferdetails.amount'
              defaultMessage='Amount to Send'
            />
          </Title>
          <Value>
            {fiatToString({
              unit:
                Currencies[props.order.inputCurrency].units[
                  props.order.inputCurrency
                ],
              value: convertBaseToStandard('FIAT', props.order.inputQuantity)
            })}
          </Value>
        </Row>
      </div>
      <Bottom>
        <Text size='12px' weight={500} color='grey600'>
          <FormattedMessage
            id='modals.simplebuy.transferdetails.sendfundsfrom'
            defaultMessage='Only send funds from a bank account in your name. If not, your deposit could be delayed or rejected.'
          />
        </Text>
        {props.account.currency === 'GBP' && (
          <LegalWrapper inline>
            <Text size='12px' weight={500} color='grey600'>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.depositagreement'
                defaultMessage='By depositing funds to this account, you agree to {ToS}, our banking partner.'
                values={{
                  ToS: (
                    <Link
                      href='https://exchange.blockchain.com/legal'
                      size='12px'
                      weight={500}
                      rel='noreferrer noopener'
                      target='_blank'
                    >
                      <FormattedMessage
                        id='modals.simplebuy.transferdetails.agree'
                        defaultMessage='Terms and Conditions of Modular'
                      />
                    </Link>
                  )
                }}
              />
            </Text>
          </LegalWrapper>
        )}

        <OkButton
          fullwidth
          nature='primary'
          data-e2e='closeSBTransferDetails'
          onClick={() => props.handleClose()}
        >
          <FormattedMessage
            id='modals.simplebuy.transferdetails.sendfundsfromok'
            defaultMessage='OK'
          />
        </OkButton>
      </Bottom>
    </Wrapper>
  )
}

export default Success
