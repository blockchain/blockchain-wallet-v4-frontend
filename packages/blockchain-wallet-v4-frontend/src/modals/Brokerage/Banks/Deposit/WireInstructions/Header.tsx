import React from 'react'
import { FormattedMessage } from 'react-intl'

import Currencies, { FiatCurrenciesType } from '@core/exchange/currencies'
import { WalletFiatEnum } from '@core/types'
import { Icon } from 'blockchain-info-components'

import { BackContainer, InfoContainer, TopText } from './Header.styles'

type Props = {
  currency: keyof FiatCurrenciesType
  onClickBack: () => void
}

export const Header = (props: Props) => (
  <>
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
        <FormattedMessage
          id='modals.simplebuy.easybanktransfer'
          defaultMessage='Easy Bank Transfer'
        />
      </div>
    </BackContainer>

    <InfoContainer>
      <TopText color='grey800' size='24px' weight={600}>
        {props.currency === WalletFiatEnum[WalletFiatEnum.USD] ? (
          <FormattedMessage
            id='modals.brokerage.deposit_currency'
            defaultMessage='Deposit {currency}'
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
      </TopText>
      <TopText color='grey600' size='24px' weight={600}>
        {props.currency === WalletFiatEnum[WalletFiatEnum.USD] ? (
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
  </>
)
