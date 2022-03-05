import React from 'react'

import { AboutSection } from '../AboutSection'
import { CoinPage } from './CoinPage'

export type { CoinPageComponent, CoinPageProps } from './types'

const CoinPageContainer = () => {
  return (
    <CoinPage
      about={<AboutSection content='some stuff' title='Bitcoin' actions={[<></>]} />}
      chart={undefined}
      header={undefined}
    />
  )
}

export default CoinPageContainer
