import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'

import { CoinType } from '@core/types'
import { Button, Modal, Text } from 'blockchain-info-components'
import CoinBalanceDisplay from 'components/CoinWithBalance/CoinBalanceDisplay'
import { selectors } from 'data'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'
import {
  Amount,
  BalanceRow,
  BalanceTable,
  Body,
  Coin,
  CoinIcon,
  CoinName,
  CoinNames,
  CoinSymbol,
  Wrapper
} from './styles'

const SofiMigratedBalances = (props: Props) => {
  const sbBalances = useSelector(selectors.components.buySell.getBSBalances).getOrElse({})
  const sbBalancesArray = Object.entries(sbBalances).map(([key, value]) => ({
    symbol: key,
    ...value
  }))

  return (
    <Modal size='medium' position={props.position} total={props.total}>
      <Body>
        <Text
          size='20px'
          weight={600}
          color='grey900'
          lineHeight='1.5'
          style={{ marginTop: '24px' }}
        >
          <FormattedMessage
            id='scenes.sofi.modal.migratedbalances.header'
            defaultMessage='You’re all set! 🎉'
          />
        </Text>
        <Text
          size='16px'
          weight={500}
          color='grey600'
          lineHeight='1.5'
          style={{ marginTop: '16px', textAlign: 'center' }}
        >
          <FormattedMessage
            id='scenes.sofi.welcome.modal.body'
            defaultMessage='Here’s a list of all the assets migrated from your SoFi account. '
          />
        </Text>
        <BalanceTable>
          {sbBalancesArray.map(({ mainBalanceToDisplay, symbol }) => {
            const { coinfig } = window.coins[symbol]

            return (
              <BalanceRow key={symbol}>
                <Wrapper>
                  <Coin>
                    <CoinIcon name={symbol as CoinType} size='32px' />
                    <CoinNames>
                      <CoinName>{coinfig.name}</CoinName>
                      <CoinSymbol>{symbol}</CoinSymbol>
                    </CoinNames>
                  </Coin>
                  <Amount>
                    <CoinBalanceDisplay
                      coin={symbol}
                      balance={mainBalanceToDisplay || 0}
                      size='14px'
                    />
                  </Amount>
                </Wrapper>
              </BalanceRow>
            )
          })}
        </BalanceTable>
        <Button nature='primary' fullwidth data-e2e='sofiContinue'>
          <FormattedMessage id='buttons.view_my_account' defaultMessage='View my account' />
        </Button>
      </Body>
    </Modal>
  )
}

type Props = ModalPropsType

export default modalEnhancer(ModalName.SOFI_MIGRATED_BALANCES)(SofiMigratedBalances)
