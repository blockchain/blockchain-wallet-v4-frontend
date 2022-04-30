import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { OpenSeaOrder } from '@core/network/api/nfts/types'

import { EthText } from '.'

const CountdownText = styled(EthText)`
  font-size: 20px;
`

const NftAssetCountdown: React.FC<Props> = ({ highest_bid, lowest_order }) => {
  const [Countdown, setCountdown] = useState('')

  useEffect(() => {
    if (
      (highest_bid && lowest_order && lowest_order?.expiration_time) ||
      (lowest_order && lowest_order?.expiration_time)
    ) {
      const countDownDate =
        highest_bid && lowest_order && lowest_order?.expiration_time
          ? lowest_order?.expiration_time * 1000 - 604800000 // subtract 7 days for auction
          : lowest_order?.expiration_time * 1000

      const interval = setInterval(function () {
        clearInterval(interval)
        const now = new Date().getTime()
        const duration = countDownDate - now
        const days = Math.floor(duration / (1000 * 60 * 60 * 24))
        const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((duration % (1000 * 60)) / 1000)
        setCountdown(() => `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`)
        // if duration < 0, expired
        if (duration < 0) {
          clearInterval(interval)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [highest_bid, lowest_order, Countdown])
  return <CountdownText>{Countdown}</CountdownText>
}

type Props = {
  highest_bid: OpenSeaOrder
  lowest_order: OpenSeaOrder
}

export default NftAssetCountdown
