import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { defaultAboutSectionActions } from '../../mocks/defaultAboutSectionActions'
import { defaultHoldingsCardActions } from '../../mocks/defaultHoldingsCardActions'
import { AboutSection } from '../AboutSection'
import { AlertCard } from '../AlertCard'
import { CoinHeader } from '../CoinHeader'
import { HoldingsCard } from '../HoldingsCard'
import { PageScaffold, PageScaffoldComponent } from '.'

const pageScaffoldStoriesMeta: ComponentMeta<PageScaffoldComponent> = {
  argTypes: {
    about: {
      defaultValue: 'bitcoin',
      mapping: {
        bitcoin: (
          <AboutSection
            content='The world’s first cryptocurrency, Bitcoin is stored and exchanged securely on the internet through a digital ledger known as a blockchain. Bitcoins are divisible into smaller units known as satoshis — each satoshi is worth 0.00000001 bitcoin.'
            title='About Bitcoin'
            actions={defaultAboutSectionActions}
          />
        ),
        solana: (
          <AboutSection
            content='Solana (SOL) is a highly functional open source project that banks on blockchain technology’s permissionless nature to provide decentralized finance (DeFi) solutions. While the idea and initial work on the project began in 2017, Solana was officially launched in March 2020 by the Solana Foundation with headquarters in Geneva, Switzerland.'
            title='About Solana'
            actions={defaultAboutSectionActions}
          />
        )
      },
      options: ['bitcoin', 'solana']
    },
    activity: {
      defaultValue: null
    },
    alertCard: {
      defaultValue: 'not_tradable',
      mapping: {
        not_tradable: (
          <AlertCard
            content='Add to your watchlist to be notified when Solana is available to trade.'
            title='Solana (SOL) is not tradable.'
          />
        )
      },
      options: ['not_tradable']
    },
    chart: {
      defaultValue: null
    },
    favoriteButton: {
      defaultValue: null
    },
    header: {
      defaultValue: 'Bitcoin',
      mapping: {
        Bitcoin: (
          <CoinHeader
            coinCode='BTC'
            coinDescription='The internet’s first and largest crypto currency.'
            coinName='Bitcoin'
          />
        ),
        Ethereum: (
          <CoinHeader
            coinCode='ETH'
            coinDescription='The internet’s first and largest crypto currency.'
            coinName='Ethereum'
          />
        )
      },
      options: ['Ethereum', 'Bitcoin']
    },
    holdings: {
      defaultValue: 'BitcoinWithBalance',

      mapping: {
        BitcoinEmpty: (
          <HoldingsCard
            coinCode='BTC'
            coinTotal='0.0'
            total='$0.0'
            actions={defaultHoldingsCardActions}
          />
        ),
        BitcoinWithBalance: (
          <HoldingsCard
            coinCode='BTC'
            coinTotal='0.00039387'
            total='$7,926.43'
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
  component: PageScaffold,
  decorators: [(Story) => <IntlProvider locale='en'>{Story()}</IntlProvider>],
  title: 'Pages/CoinPage/PageScaffold'
}

export const Template: ComponentStory<PageScaffoldComponent> = (args) => <PageScaffold {...args} />

export default pageScaffoldStoriesMeta
