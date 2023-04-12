import React from 'react'
import { FormattedMessage } from 'react-intl'

import Currencies, { FiatCurrenciesType } from '@core/exchange/currencies'
import { Icon, Text } from 'blockchain-info-components'

import { BackContainer, InfoContainer, TopText } from './Header.styles'

type Props = {
  addBank?: boolean
  currency: keyof FiatCurrenciesType
  displayBack: boolean
  handleClose: () => void
  onClickBack: () => void
}

export const Header = (props: Props) => (
  <>
    {props.displayBack && (
      <BackContainer>
        <Icon
          cursor
          name='arrow-left'
          size='20px'
          color='grey600'
          style={{ marginRight: '28px' }}
          role='button'
          onClick={props.onClickBack}
        />
        <div>
          <FormattedMessage id='modals.simplebuy.transferdetails.back' defaultMessage='Back' />
        </div>
      </BackContainer>
    )}
    <Icon size='32px' color='USD' name={props.currency} />
    <InfoContainer>
      <TopText color='grey800' size='24px' weight={600}>
        {props.currency === 'USD' || props.addBank ? (
          <FormattedMessage
            id='modals.simplebuy.deposit.title_add'
            defaultMessage='Add a {currency} Bank'
            values={{
              currency: props.currency
            }}
          />
        ) : (
          <FormattedMessage
            id='modals.simplebuy.deposit.title'
            defaultMessage='Deposit {currency}'
            values={{
              currency: Currencies[props.currency].displayName
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
        {props.currency === 'USD' ? (
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
              currency: props.currency,
              symbol: Currencies[props.currency].units[props.currency].symbol
            }}
          />
        </Text>
      )}
    </InfoContainer>
  </>
)
