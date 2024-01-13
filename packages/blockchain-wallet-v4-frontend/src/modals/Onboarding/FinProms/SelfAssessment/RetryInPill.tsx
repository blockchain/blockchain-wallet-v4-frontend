import React from 'react'

import { Text } from 'blockchain-info-components'
import { useCountDown } from 'hooks'

const RetryInPill = ({ date }) => {
  const { timer } = useCountDown(new Date(date), 0, 'hh:mm:ss')

  return (
    <Text color='blue600' size='14px' lineHeight='21px' weight={600}>
      Retake in {timer}
    </Text>
  )
}

export default RetryInPill
