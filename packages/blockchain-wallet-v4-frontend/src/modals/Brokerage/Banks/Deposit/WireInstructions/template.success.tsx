import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import Currencies from '@core/exchange/currencies'
import { Icon, Link, TabMenu, TabMenuItem, Text, TextGroup } from 'blockchain-info-components'
import { DisplayIcon, DisplaySubTitle, DisplayTitle } from 'components/BuySell'
import { FlyoutWrapper } from 'components/Flyout'
import { BankDWStepType } from 'data/types'

import { Props as OwnProps, SuccessStateType } from '.'
import LayoutArs from './Currency/ARS'
import LayoutDefault from './Currency/default'
import { TransferType } from './types'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`
const TopText = styled(Text)`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
`
const BackContainer = styled(Text)`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 40px;
  font-weight: 600;
  font-size: 20px;
`
const Bottom = styled(FlyoutWrapper)`
  display: flex;
  padding-top: 24px;
  flex-direction: column;
  height: 100%;
`
const InfoContainer = styled.div`
  margin-top: 16px;
`
const LegalWrapper = styled(TextGroup)`
  margin-top: 20px;
`
const BottomInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 41px;
`
const BottomRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
`
const BottomMultiRowContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.grey800};
  margin-left: 16px;
`
const TabsContainer = styled.div`
  margin-top: 40px;
  display: inline-block;
`

const Success: React.FC<Props> = (props) => {
  const [transferType, setTransferType] = useState(TransferType.DOMESTIC)
  const currencyLayouts = {
    ARS: <LayoutArs {...props} />,
    default: <LayoutDefault {...props} />
  }

  return (
    <Wrapper>
      <div>
        <FlyoutWrapper>
          <BackContainer>
            <Icon
              cursor
              name='arrow-left'
              size='20px'
              color='grey600'
              style={{ marginRight: '28px' }}
              role='button'
              onClick={() => {
                props.brokerageActions.setDWStep({
                  dwStep: BankDWStepType.DEPOSIT_METHODS
                })
              }}
            />
            <div>
              <FormattedMessage
                id='modals.simplebuy.easybanktransfer'
                defaultMessage='Easy Bank Transfer'
              />
            </div>
          </BackContainer>

          <InfoContainer>
            <TopText color='grey800' size='24px' weight={600}>
              {props.account.currency === 'USD' ? (
                <FormattedMessage
                  id='modals.brokerage.deposit_currency'
                  defaultMessage='Deposit {currency}'
                  values={{
                    currency: props.account.currency
                  }}
                />
              ) : (
                <FormattedMessage
                  id='modals.simplebuy.deposit.title'
                  defaultMessage='Deposit {currency}'
                  values={{
                    currency: Currencies[props.account.currency].displayName
                  }}
                />
              )}
            </TopText>
            <TopText color='grey600' size='24px' weight={600}>
              {props.account.currency === 'USD' ? (
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.wire_transfer'
                  defaultMessage='Wire Transfer'
                />
              ) : (
                <FormattedMessage
                  id='modals.simplebuy.deposit.regular_bank_transfer'
                  defaultMessage='Regular Bank Transfer'
                />
              )}
            </TopText>
          </InfoContainer>

          {props.account.currency === 'USD' && (
            <TabsContainer>
              <TabMenu>
                <TabMenuItem
                  role='button'
                  selected={transferType === TransferType.DOMESTIC}
                  onClick={() => setTransferType(TransferType.DOMESTIC)}
                  data-e2e='sbDomesticButton'
                >
                  <FormattedMessage
                    id='modals.simplebuy.transferdetails.domestic'
                    defaultMessage='Domestic'
                  />
                </TabMenuItem>

                <TabMenuItem
                  role='button'
                  selected={transferType === TransferType.INTERNATIONAL}
                  onClick={() => setTransferType(TransferType.INTERNATIONAL)}
                  data-e2e='sbInternationalButton'
                >
                  <FormattedMessage
                    id='modals.simplebuy.transferdetails.international'
                    defaultMessage='International'
                  />
                </TabMenuItem>
              </TabMenu>
            </TabsContainer>
          )}
        </FlyoutWrapper>
        {currencyLayouts[props.account.currency]
          ? currencyLayouts[props.account.currency]
          : currencyLayouts.default}
      </div>
      <Bottom>
        <BottomInfoContainer>
          <BottomRow>
            <DisplayIcon>
              <Icon size='18px' color='grey800' name='bank-filled' />
            </DisplayIcon>
            <BottomMultiRowContainer>
              <DisplayTitle>
                {props.account.currency === 'USD' ? (
                  <FormattedMessage
                    id='modals.simplebuy.deposit.important_transfer_only'
                    defaultMessage='Important Transfer Information'
                  />
                ) : (
                  <FormattedMessage
                    id='modals.simplebuy.deposit.bank_transfer_only'
                    defaultMessage='Bank Transfers Only'
                  />
                )}
              </DisplayTitle>
              <DisplaySubTitle>
                {props.account.currency === 'USD' ? (
                  <FormattedMessage
                    id='modals.simplebuy.deposit.important_transfer_only_description'
                    defaultMessage='Only send funds from a bank account in your name. If not, your deposit could be delayed or rejected. <b>Be sure to include your Reference ID.</b>'
                  />
                ) : props.account.currency === 'ARS' ? (
                  <FormattedMessage
                    id='modals.simplebuy.deposit.bank_transfer_only_description_ars'
                    defaultMessage='Only send funds from a bank account in your name. If not, your deposit could be rejected.'
                  />
                ) : (
                  <FormattedMessage
                    id='modals.simplebuy.deposit.bank_transfer_only_description'
                    defaultMessage='Only send funds from a bank account in your name. If not, your deposit could be delayed or rejected.'
                  />
                )}
              </DisplaySubTitle>
            </BottomMultiRowContainer>
          </BottomRow>
          <BottomRow>
            <DisplayIcon>
              <Icon size='18px' color='grey800' name='pending' />
            </DisplayIcon>
            <BottomMultiRowContainer>
              <DisplayTitle>
                <FormattedMessage
                  id='modals.simplebuy.deposit.processing_time'
                  defaultMessage='Processing Time'
                />
              </DisplayTitle>
              <DisplaySubTitle>
                {props.account.currency === 'GBP' && (
                  <FormattedMessage
                    id='modals.simplebuy.deposit.processing_time.info.gbp1'
                    defaultMessage='Funds will be credited to your GBP Account as soon as we receive them. In the UK Faster Payments Network, this can take a couple of hours.'
                  />
                )}
                {props.account.currency === 'EUR' && (
                  <FormattedMessage
                    id='modals.simplebuy.deposit.processing_time.info.eur1'
                    defaultMessage='Funds will be credited to your EUR Account as soon as we receive them. SEPA transfers usually take around 1 business day to reach us.'
                  />
                )}
                {props.account.currency === 'USD' && (
                  <FormattedMessage
                    id='modals.simplebuy.deposit.processing_time.info.usd1'
                    defaultMessage='Funds will be credited to your USD Account as soon as we receive them. Funds are generally available within one business day.'
                  />
                )}
                {props.account.currency === 'ARS' && (
                  <FormattedMessage
                    id='modals.simplebuy.deposit.processing_time.info.usd1'
                    defaultMessage='Funds will be credited to your ARS wallet as soon as we receive them. Funds are generally available within 3 business days. We will send you a mail with the confirmation.'
                  />
                )}
              </DisplaySubTitle>
            </BottomMultiRowContainer>
          </BottomRow>

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
        </BottomInfoContainer>
      </Bottom>
    </Wrapper>
  )
}

type Props = OwnProps & SuccessStateType

export default Success
