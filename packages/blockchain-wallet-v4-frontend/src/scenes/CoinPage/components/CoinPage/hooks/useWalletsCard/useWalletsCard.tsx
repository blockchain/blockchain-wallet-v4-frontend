import React, { ReactNode, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { CoinType } from '@core/types'
import { Icon } from 'blockchain-info-components'
import { IconCircularBackground } from 'components/IconCircularBackground'
import { StandardRow } from 'components/Rows'

import { WalletsCard } from '../../../WalletsCard'
import { formatValues } from './model'
import { getData } from './selectors'

export const useWalletsCard = (coin: CoinType): [ReactNode] => {
  const data = useSelector((state) => getData(state, coin))
  const walletsCard = useMemo(() => {
    return (
      <WalletsCard>
        {data.cata({
          Failure: () => <span>Failure</span>,
          Loading: () => {
            return (
              <>
                <StandardRow loading />
                <StandardRow loading />
                <StandardRow loading />
              </>
            )
          },
          NotAsked: () => (
            <>
              <StandardRow loading />
              <StandardRow loading />
              <StandardRow loading />
            </>
          ),
          Success: ({ addressData, currency, rates }) => {
            return addressData.map(({ value: { available, balance, label } }) => {
              const [totalCryptoFormatted, totalFiatFormatted] = formatValues(
                coin,
                available,
                balance,
                rates,
                currency
              )

              return (
                <StandardRow
                  key={label}
                  bottomLeftText={label}
                  bottomRightText={totalCryptoFormatted}
                  onClick={() => {}}
                  topLeftText={label}
                  topRightText={totalFiatFormatted}
                  icon={
                    <IconCircularBackground color='grey200'>
                      <Icon name='key' size='8px' color='grey600' />
                    </IconCircularBackground>
                  }
                />
              )
            })
          }
        })}
      </WalletsCard>
    )
  }, [coin, data])

  return [walletsCard]
}
