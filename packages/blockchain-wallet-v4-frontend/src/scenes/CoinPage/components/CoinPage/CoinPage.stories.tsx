import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import moment from 'moment'

import { Tab, Tabs } from 'components/Tabs'

import { defaultAboutSectionActions } from '../../mocks/defaultAboutSectionActions'
import { defaultHoldingsCardActions } from '../../mocks/defaultHoldingsCardActions'
import * as AboutSection from '../AboutSection/AboutSection.stories'
import * as AlertCard from '../AlertCard/AlertCard.stories'
import * as ChartBalancePanel from '../ChartBalancePanel/ChartBalancePanel.stories'
import { liveDataCopy, serie_ascending_1, serie_descending_1 } from '../CoinChart/mocks'
import { createCoinChartTooltipBuilder } from '../CoinChartTooltip'
import * as CoinHeader from '../CoinHeader/CoinHeader.stories'
import * as HoldingsCard from '../HoldingsCard/HoldingsCard.stories'
import { ResponsiveCoinChart } from '../ResponsiveCoinChart'
import { CoinPage } from './CoinPage'
import { CoinPageComponent } from './types'

const coinPageStoriesMeta: ComponentMeta<CoinPageComponent> = {
  argTypes: {
    about: {
      defaultValue: 'bitcoin',
      mapping: {
        bitcoin: (
          // @ts-ignore
          <AboutSection.Bitcoin
            {...AboutSection.Bitcoin.args}
            actions={defaultAboutSectionActions}
          />
        ),
        solana: (
          // @ts-ignore
          <AboutSection.Solana {...AboutSection.Solana.args} actions={defaultAboutSectionActions} />
        )
      },
      options: ['bitcoin', 'solana']
    },
    activity: {
      defaultValue: null
    },
    alertCard: {
      mapping: {
        not_tradable: (
          // @ts-ignore
          <AlertCard.NotTradable {...AlertCard.NotTradable.args} />
        )
      },
      options: ['not_tradable']
    },
    chart: {
      control: { type: 'select' },
      defaultValue: 'Live copy',
      mapping: {
        'Ascending chart': (
          <ResponsiveCoinChart
            y='value'
            backgroundColor='white'
            data={serie_ascending_1}
            primaryColor='#0C6CF2'
            textColor='#98A1B2'
            x='date'
            xFormatter={(date) => moment(date).format('hh:mm')}
            tooltip={createCoinChartTooltipBuilder()}
          />
        ),
        'Decending chart': (
          <ResponsiveCoinChart
            y='value'
            backgroundColor='white'
            data={serie_descending_1}
            primaryColor='#0C6CF2'
            textColor='#98A1B2'
            x='date'
            xFormatter={(date) => moment(date).format('hh:mm')}
            tooltip={createCoinChartTooltipBuilder()}
          />
        ),
        'Live copy': (
          <ResponsiveCoinChart
            y='value'
            backgroundColor='white'
            data={liveDataCopy.map(([date, value]) => ({ date, value }))}
            primaryColor='#0C6CF2'
            textColor='#98A1B2'
            x='date'
            xFormatter={(date) => moment(date).format('MMM D')}
            tooltip={createCoinChartTooltipBuilder()}
          />
        )
      },
      options: ['Ascending_chart', 'Decending chart', 'Live copy']
    },
    chartBalancePanel: {
      defaultValue: 'bitcoin_up',
      mapping: {
        bitcoin_up: (
          // @ts-ignore
          <ChartBalancePanel.BitcoinUp {...ChartBalancePanel.BitcoinUp.args} />
        )
      },
      options: ['bitcoin_up']
    },
    chartTabs: {
      defaultValue: 'live',
      mapping: {
        live: (
          <Tabs>
            <Tab badgeColor='green'>Live</Tab>
            <Tab>1D</Tab>
            <Tab selected>1W</Tab>
            <Tab>1M</Tab>
            <Tab>1Y</Tab>
            <Tab>All</Tab>
          </Tabs>
        )
      },
      options: ['live']
    },
    favoriteButton: {
      defaultValue: null
    },
    header: {
      defaultValue: 'Bitcoin',
      mapping: {
        Bitcoin: (
          <CoinHeader.Bitcoin
            // @ts-ignore
            coinCode={CoinHeader.Bitcoin.args.coinCode}
            // @ts-ignore
            coinDescription={CoinHeader.Bitcoin.args.coinDescription}
            // @ts-ignore
            coinName={CoinHeader.Bitcoin.args.coinName}
          />
        ),
        Ethereum: (
          <CoinHeader.Ethereum
            // @ts-ignore
            coinCode={CoinHeader.Ethereum.args.coinCode}
            // @ts-ignore
            coinDescription={CoinHeader.Ethereum.args.coinDescription}
            // @ts-ignore
            coinName={CoinHeader.Ethereum.args.coinName}
          />
        )
      },
      options: ['Ethereum', 'Bitcoin']
    },
    holdings: {
      mapping: {
        BitcoinEmpty: (
          <HoldingsCard.BitcoinEmpty
            // @ts-ignore
            coinCode={HoldingsCard.BitcoinEmpty.args.coinCode}
            // @ts-ignore
            coinTotal={HoldingsCard.BitcoinEmpty.args.coinTotal}
            // @ts-ignore
            total={HoldingsCard.BitcoinEmpty.args.total}
            actions={defaultHoldingsCardActions}
          />
        ),
        BitcoinWithBalance: (
          <HoldingsCard.Bitcoin
            // @ts-ignore
            coinCode={HoldingsCard.Bitcoin.args.coinCode}
            // @ts-ignore
            coinTotal={HoldingsCard.Bitcoin.args.coinTotal}
            // @ts-ignore
            total={HoldingsCard.Bitcoin.args.total}
            actions={defaultHoldingsCardActions}
          />
        )
      },
      options: ['BitcoinWithBalance', 'BitcoinEmpty']
    },
    promoCard: {
      defaultValue: null
    },
    recurringBuys: {
      defaultValue: null
    },
    wallets: {
      defaultValue: null
    }
  },
  component: CoinPage,
  decorators: [(Story) => <IntlProvider locale='en'>{Story()}</IntlProvider>],
  title: 'Pages/CoinPage'
}

const Template: ComponentStory<CoinPageComponent> = (args) => <CoinPage {...args} />

export const Default = Template.bind({})
Default.args = {
  about: 'bitcoin',
  activity: null,
  favoriteButton: null,
  header: 'Bitcoin',
  holdings: 'BitcoinWithBalance',
  promoCard: null,
  recurringBuys: null,
  wallets: null
}

export const NotTradable = Template.bind({})
NotTradable.args = {
  about: 'solana',
  activity: null,
  alertCard: 'not_tradable',
  favoriteButton: null,
  header: 'Solana',
  promoCard: null,
  recurringBuys: null,
  wallets: null
}
export default coinPageStoriesMeta
