import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { EthText } from '.'

const CountdownText = styled(EthText)`
  font-size: 20px;
`

const NftAssetCountdown: React.FC<Props> = ({ countDownDate }) => {
  const [Countdown, setCountdown] = useState('')

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime()
      const duration = countDownDate - now
      const days = Math.floor(duration / (1000 * 60 * 60 * 24))
      const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((duration % (1000 * 60)) / 1000)
      setCountdown(
        () => `${days ? `${days} days` : ''} ${hours} hours ${minutes} minutes ${seconds} seconds`
      )
      return { duration }
    }

    const interval = setInterval(function () {
      const { duration } = updateCountdown()
      // if duration < 0, expired
      if (duration < 0) {
        clearInterval(interval)
      }
    }, 1000)

    updateCountdown()

    return () => clearInterval(interval)
  }, [Countdown])

  return <CountdownText>{Countdown}</CountdownText>
}

type Props = {
  countDownDate: number
}

export default NftAssetCountdown
