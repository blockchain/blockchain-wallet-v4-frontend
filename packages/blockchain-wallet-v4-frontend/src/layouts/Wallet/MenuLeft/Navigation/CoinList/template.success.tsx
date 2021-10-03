import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { map, toLower } from 'ramda'
import styled, { DefaultTheme } from 'styled-components'

import { Text } from 'blockchain-info-components'
import { CoinfigType, CoinType } from 'core/types'
import { CoinIcon, Destination, MenuItem } from 'layouts/Wallet/components'

import { Divider } from '../template'

const PortfolioSeparator = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 16px;
  margin-bottom: 4px;
  width: calc(100% - 16px);
  box-sizing: content-box;
`

const Success: React.FC<Props> = ({ coinList }) => {
  return coinList.length ? (
    <>
      <PortfolioSeparator>
        <Text color='grey600' lineHeight='20px' weight={600} size='14px'>
          <FormattedMessage id='copy.portfolio' defaultMessage='Portfolio' />
        </Text>
        <Divider />
      </PortfolioSeparator>
      {map(
        (coinfig) => (
          <LinkContainer
            to={`/${coinfig.symbol}/transactions`}
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
