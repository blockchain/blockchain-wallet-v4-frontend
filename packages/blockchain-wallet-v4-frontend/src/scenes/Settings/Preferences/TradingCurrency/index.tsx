import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'

import { FlatLoader, Text } from 'blockchain-info-components'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'

import { getData } from './selectors'
import Settings from './Settings'

const TradingCurrencyContainer = ({ data }: Props) => (
  <SettingContainer data-e2e='prefsTradingCurrency'>
    <SettingSummary>
      <SettingHeader>
        <FormattedMessage
          id='scenes.settings.preferences.trading_currency.success.title'
          defaultMessage='Trading Currency'
        />
      </SettingHeader>
      <SettingDescription>
        <FormattedMessage
          id='scenes.settings.preferences.trading_currency.success.description'
          defaultMessage='Select your trading currency.'
        />
      </SettingDescription>
    </SettingSummary>
    <SettingComponent>
      {data.cata({
        Failure: (message) => (
          <SettingComponent>
            <Text>{message}</Text>
          </SettingComponent>
        ),
        Loading: () => <FlatLoader width='50px' height='14px' />,
        NotAsked: () => <FlatLoader width='50px' height='14px' />,
        Success: (value) => <Settings {...value} />
      })}
    </SettingComponent>
  </SettingContainer>
)

const mapStateToProps = (state) => ({
  data: getData(state)
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector>

export default connect(mapStateToProps)(TradingCurrencyContainer)
