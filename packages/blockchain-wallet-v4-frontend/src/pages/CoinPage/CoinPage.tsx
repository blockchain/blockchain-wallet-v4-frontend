import React from 'react'
import { Icon } from '@blockchain-com/constellation'

import { IconButton, Link } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

import { CoinHeader, PageScaffold } from './components'
import { AboutSection } from './components/AboutSection'
import { CoinPageComponent } from './types'

const content =
  "The world's first cryptocurrency, Bitcoin is stored and exchanged securely on the internet through a digital ledger known as a blockchain. Bitcoins are divisible into smaller units known as satoshis — each satoshi is worth 0.00000001 bitcoin."
const title = 'About Bitcoin'
const actions = [
  <Link key={1}>
    <Flex gap={8} alignItems='center'>
      <Icon name='link' size='sm' color='blue600' />
      Official Website
    </Flex>
  </Link>,

  <Link key={2}>
    <Flex gap={8} alignItems='center'>
      <Icon name='link' size='sm' color='blue600' />
      Whitepaper
    </Flex>
  </Link>
]

const CoinPage: CoinPageComponent = () => {
  return (
    <PageScaffold
      header={
        <CoinHeader
          coinCode='BTC'
          coinName='Bitcoin'
          coinDescription='The internet’s first and largest crypto currency.'
        />
      }
      favoriteButton={<span>favoriteButton</span>}
      chart={<span>chart</span>}
      about={<AboutSection actions={actions} content={content} title={title} />}
      activity={<span>activity</span>}
      alertCard={<span>alertCard</span>}
      holdings={<span>holding</span>}
      promoCard={<span>promoCard</span>}
      recurringBuys={<span>recurringBuys</span>}
    />
  )
}

export default CoinPage
