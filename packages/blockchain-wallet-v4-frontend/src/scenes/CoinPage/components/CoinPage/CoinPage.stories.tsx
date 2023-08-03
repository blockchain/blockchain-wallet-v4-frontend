import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { format } from 'date-fns'

import { Icon } from 'blockchain-info-components'
import { IconCircularBackground } from 'components/IconCircularBackground'
import { StandardRow } from 'components/Rows'
import { Tab, Tabs } from 'components/Tabs'

import { defaultHoldingsCardActions } from '../../mocks/defaultHoldingsCardActions'
import * as AboutSection from '../AboutSection/AboutSection.stories'
import * as AlertCard from '../AlertCard/AlertCard.stories'
import * as ChartBalancePanel from '../ChartBalancePanel/ChartBalancePanel.stories'
import { liveDataCopy, serie_ascending_1, serie_descending_1 } from '../CoinChart/mocks'
import { createCoinChartTooltipBuilder } from '../CoinChartTooltip'
import * as CoinHeader from '../CoinHeader/CoinHeader.stories'
import { CoinWhitepaperButton } from '../CoinWhitepaperButton'
import * as HoldingsCard from '../HoldingsCard/HoldingsCard.stories'
import { LearnAboutRecurringBuyPanel } from '../LearnAboutRecurringBuyPanel'
import { OfficialCoinWebsiteButton } from '../OfficialCoinWebsiteButton'
import { ResponsiveCoinChart } from '../ResponsiveCoinChart'
import { WalletsCard } from '../WalletsCard'
import { CoinPage } from './CoinPage'
import { CoinPageComponent } from './types'

const actions = [
  <OfficialCoinWebsiteButton key={0} href='https://blockchain.com' />,
  <CoinWhitepaperButton key={1} href='https://blockchain.com' />
]

const coinPageStoriesMeta: ComponentMeta<CoinPageComponent> = {
  argTypes: {
    about: {
      defaultValue: 'bitcoin',
      mapping: {
        bitcoin: (
          // @ts-ignore
          <AboutSection.Bitcoin {...AboutSection.Bitcoin.args} actions={actions} />
        ),
        solana: (
          // @ts-ignore
          <AboutSection.Solana {...AboutSection.Solana.args} actions={actions} />
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
            xFormatter={(date) => format(new Date(date), 'hh:mm')}
            tooltip={createCoinChartTooltipBuilder()}
          />
        ),
        'Descending chart': (
          <ResponsiveCoinChart
            y='value'
            backgroundColor='white'
            data={serie_descending_1}
            primaryColor='#0C6CF2'
            textColor='#98A1B2'
            x='date'
            xFormatter={(date) => format(new Date(date), 'hh:mm')}
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
            xFormatter={(date) => format(new Date(date), 'hh:mm')}
            tooltip={createCoinChartTooltipBuilder()}
          />
        )
      },
      options: ['Ascending_chart', 'Descending chart', 'Live copy']
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
      defaultValue: <LearnAboutRecurringBuyPanel />
    },
    wallets: {
      defaultValue: (
        <WalletsCard>
          <StandardRow
            key={0}
            icon={
              <IconCircularBackground color='orange400'>
                <Icon name='key' size='8px' color='white' />
              </IconCircularBackground>
            }
            topLeftText='DeFi Wallet'
            topRightText='$7,926.43'
            bottomLeftText='Non-custodial'
            bottomRightText='0.00039387 BTC'
            onClick={() => null}
          />

          <StandardRow
            key={1}
            icon={<Icon name='arrow-top-right-bottom-left-circle' size='24px' color='orange400' />}
            topLeftText='Trading Account'
            topRightText='$201.20'
            bottomLeftText='Custodial'
            bottomRightText='0.00000093 BTC'
            onClick={() => null}
          />
        </WalletsCard>
      )
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
  promoCard: null
}

export const NotTradable = Template.bind({})
NotTradable.args = {
  about: 'solana',
  activity: null,
  alertCard: 'not_tradable',
  favoriteButton: null,
  header: 'Solana',
  promoCard: null
}
export default coinPageStoriesMeta
