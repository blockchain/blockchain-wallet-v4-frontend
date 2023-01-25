import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { map, toLower } from 'ramda'
import { DefaultTheme } from 'styled-components'

import { CoinfigType, CoinType } from '@core/types'
import { CoinIcon, Destination, MenuItem } from 'layouts/Wallet/components'

const Success: React.FC<Props> = ({ coinList }) => {
  return coinList.length ? (
    <>
      {map(
        (coinfig) => (
          <LinkContainer
            to={`/coins/${coinfig.symbol}`}
            activeClassName='active'
            key={coinfig.symbol}
          >
            <MenuItem
              data-e2e={`${toLower(coinfig.symbol)}Link`}
              colorCode={coinfig.symbol as keyof DefaultTheme}
              className='coin'
            >
              <CoinIcon className='coin-icon' name={coinfig.symbol as CoinType} size='24px' />
              <Destination>{coinfig.name}</Destination>
            </MenuItem>
          </LinkContainer>
        ),
        coinList
      )}
    </>
  ) : null
}

type Props = {
  coinList: CoinfigType[]
}

export default Success
