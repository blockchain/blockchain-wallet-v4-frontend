import React from 'react'
import { FormattedMessage } from 'react-intl'
import { AlertCard } from '@blockchain-com/constellation'
import styled from 'styled-components'

import Currencies from '@core/exchange/currencies'
import { Icon, Text } from 'blockchain-info-components'
import { DisplayIcon, DisplaySubTitle, DisplayTitle } from 'components/BuySell'
import CopyClipboardButton from 'components/Clipboard/CopyClipboardButton'
import { FlyoutWrapper } from 'components/Flyout'

import { Props as OwnProps, SuccessStateType } from '.'

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

const InfoContainer = styled.div`
  margin-top: 16px;
`

const RowCopy = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid white;
  padding: 16px;

  &:last-child {
    border-bottom: none;
  }
`

const BottomInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
`

const BottomRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;

  > div.constellation {
    width: 100%;
    background: ${(props) => props.theme.grey100} !important;
  }
`

const BottomMultiRowContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.grey800};
  margin-left: 16px;
`

const Entries = styled.div`
  background-color: ${(props) => props.theme.grey000};
  border-radius: 16px;
`
const SectionTitle = styled.div`
  color: ${(props) => props.theme.grey700};
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 8px;
`
const EntryTitle = styled.div`
  font-size: 14px;
  color: ${(props) => props.theme.grey700};
  font-weight: 500;
  line-height: 1.5;
`
const EntryValue = styled.div`
  font-size: 16px;
  color: ${(props) => props.theme.grey900};
  font-weight: 600;
  line-height: 1.5;
`

const Success: React.FC<Props> = (props) => {
  return (
    <Wrapper>
      <FlyoutWrapper>
        {props.displayBack && (
          <BackContainer>
            <Icon
              cursor
              name='arrow-left'
              size='20px'
              color='grey600'
              style={{ marginRight: '28px' }}
              role='button'
              onClick={() =>
                props.buySellActions.setStep({
                  cryptoCurrency: props.cryptoCurrency || 'BTC',
                  fiatCurrency: props.account.currency || 'USD',
                  pair: props.pair,
                  step: 'PAYMENT_METHODS'
                })
              }
            />
            <div>
              <FormattedMessage id='modals.simplebuy.transferdetails.back' defaultMessage='Back' />
            </div>
          </BackContainer>
        )}

        <Icon size='32px' color='USD' name={props.account.currency} />
        <InfoContainer>
          <TopText color='grey800' size='24px' weight={600}>
            {props.account.currency === 'USD' || props.addBank ? (
              <FormattedMessage
                id='modals.simplebuy.deposit.title_add'
                defaultMessage='Add a {currency} Bank'
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
            {!props.displayBack && (
              <Icon
                cursor
                name='close'
                size='20px'
                color='grey600'
                onClick={() => props.handleClose()}
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

          {props.addBank && (
            <Text size='16px' weight={500} color='grey600'>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.bank_link_info1'
                defaultMessage='To link your bank, send {symbol}1 or more to your {currency} Account.'
                values={{
                  currency: props.account.currency,
                  symbol: Currencies[props.account.currency].units[props.account.currency].symbol
                }}
              />
            </Text>
          )}
        </InfoContainer>

        {props.account.content.sections.map((section) => (
          <div key={section.name}>
            <SectionTitle>{section.name}</SectionTitle>

            <Entries>
              {section.entries.map((entry) => (
                <RowCopy key={entry.id}>
                  <div>
                    <EntryTitle>{entry.title}</EntryTitle>
                    <EntryValue>{entry.message}</EntryValue>
                  </div>
                  <CopyClipboardButton textToCopy={entry.message} />
                </RowCopy>
              ))}
            </Entries>
          </div>
        ))}

        <BottomInfoContainer>
          {props.account.content.footers.map((footer) =>
            footer.isImportant ? (
              <BottomRow key={footer.id}>
                <AlertCard variant='warning' content={footer.message} title={footer.title} />
              </BottomRow>
            ) : (
              <BottomRow key={footer.id}>
                <DisplayIcon>
                  <Icon size='18px' color='grey800' name='pending' />
                </DisplayIcon>
                <BottomMultiRowContainer>
                  <DisplayTitle>{footer.title}</DisplayTitle>
                  <DisplaySubTitle>{footer.message}</DisplaySubTitle>
                </BottomMultiRowContainer>
              </BottomRow>
            )
          )}
        </BottomInfoContainer>
      </FlyoutWrapper>
    </Wrapper>
  )
}

type Props = OwnProps & SuccessStateType

export default Success
