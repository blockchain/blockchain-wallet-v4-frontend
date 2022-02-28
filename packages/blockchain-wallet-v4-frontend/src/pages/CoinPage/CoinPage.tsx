import React from 'react'

import { IconButton } from 'blockchain-info-components'

import { CoinHeader, PageScaffold } from './components'
import { CoinPageComponent } from './types'

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
      about={<span>about</span>}
      activity={<span>activity</span>}
      alertCard={<span>alertCard</span>}
      holdings={<span>holding</span>}
      promoCard={<span>promoCard</span>}
      recurringBuys={<span>recurringBuys</span>}
    />
  )
}

export default CoinPage
