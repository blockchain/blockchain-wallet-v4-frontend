import React from 'react'

import { ActivityResponseType } from '@core/network/api/coins/types'

const UnifiedActivityTx: React.FC<Props> = ({ tx }) => {
  return <>{JSON.stringify(tx)}</>
}

type Props = {
  tx: ActivityResponseType['activity'][0]
}

export default UnifiedActivityTx
