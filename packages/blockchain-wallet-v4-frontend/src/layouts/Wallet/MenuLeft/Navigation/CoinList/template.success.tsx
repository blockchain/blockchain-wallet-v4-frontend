import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { DefaultTheme } from 'styled-components'

import { CoinfigType } from '@core/types'
import { CoinIcon, Destination, MenuItem } from 'layouts/Wallet/components'

const Success = ({ coinList }: Props) => {
  return (
    <>
      {coinList.map((coinfig) => (
        <LinkContainer
          to={`/coins/${coinfig.symbol}`}
          activeClassName='active'
          key={coinfig.symbol}
        >
          <MenuItem
            data-e2e={`${coinfig.symbol.toLocaleLowerCase()}Link`}
            colorCode={coinfig.symbol as keyof DefaultTheme}
            className='coin'
          >
            <CoinIcon className='coin-icon' name={coinfig.symbol} size='24px' />
            <Destination>{coinfig.name}</Destination>
          </MenuItem>
        </LinkContainer>
      ))}
    </>
  )
}

type Props = {
  coinList: CoinfigType[]
}

export default Success
