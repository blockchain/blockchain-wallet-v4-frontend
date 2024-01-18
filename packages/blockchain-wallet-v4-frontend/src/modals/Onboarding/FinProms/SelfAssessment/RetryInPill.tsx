import React from 'react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

import { useCountdownTo } from '../../CompleteProfile/countdownTo'

const PillWrapper = styled.div`
  border: 1px solid ${(props) => props.theme.blue600};
  border-radius: 32px;
  padding: 6px 12px;
`

const RetryInPill = ({ date }) => {
  const timer = useCountdownTo(date)

  return (
    <PillWrapper>
      <Text color='blue600' size='14px' lineHeight='21px' weight={600}>
        Retake in {timer}
      </Text>
    </PillWrapper>
  )
}

export default RetryInPill
