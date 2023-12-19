import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'

import { CoinType } from '@core/types'
import { Button, Modal, Text } from 'blockchain-info-components'
import CoinBalanceDisplay from 'components/CoinWithBalance/CoinBalanceDisplay'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName, SofiUserMigrationStatus } from 'data/types'
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
import NoAssetsMigrated from './template.noassets'

const SofiMigratedBalances = (props: Props) => {
  const dispatch = useDispatch()
  const balances = useSelector(
    selectors.modules.profile.getSofiMigrationTransferedBalances
  ).getOrElse([]) as Array<{ amount: number; currency: string }>
  const sofiMigrationUserStatus = useSelector(
    (state: RootState) => state.profile.sofiUserMigrationStatus
  )

  const statusPending = sofiMigrationUserStatus === SofiUserMigrationStatus.PENDING

  const viewAccountClick = () => {
    dispatch(actions.modals.closeModal(ModalName.SOFI_MIGRATED_BALANCES))
  }
  return (
    <Modal size='medium' position={props.position} total={props.total}>
      <Body>
        {!balances?.length ? (
          <NoAssetsMigrated />
        ) : (
          <>
            <Text
              size='20px'
              weight={600}
              color='grey900'
              lineHeight='1.5'
              style={{ marginTop: '24px' }}
            >
              {statusPending ? (
                <FormattedMessage
                  id='scenes.sofi.modal.migratedbalances.pending.header'
                  defaultMessage='Migration in progress 🕔'
                />
              ) : (
                <FormattedMessage
                  id='scenes.sofi.modal.migratedbalances.header'
                  defaultMessage='You’re all set! 🎉'
                />
              )}
            </Text>
            <Text
              size='16px'
              weight={500}
              color='grey600'
              lineHeight='1.5'
              style={{ marginTop: '16px', textAlign: 'center' }}
            >
              {statusPending ? (
                <FormattedMessage
                  id='scenes.sofi.welcome.modal.body.pending'
                  defaultMessage='Here’s a list of all the assets being migrated from your SoFi account. '
                />
              ) : (
                <FormattedMessage
                  id='scenes.sofi.welcome.modal.body'
                  defaultMessage='Here’s a list of all the assets migrated from your SoFi account. '
                />
              )}
            </Text>
            <BalanceTable>
              {/* @ts-ignore */}
              {balances.map(({ amount, currency }) => {
                const { coinfig } = window.coins[currency]

                return (
                  <BalanceRow key={currency}>
                    <Wrapper>
                      <Coin>
                        <CoinIcon name={currency as CoinType} size='32px' />
                        <CoinNames>
                          <CoinName>{coinfig.name}</CoinName>
                          <CoinSymbol>{currency}</CoinSymbol>
                        </CoinNames>
                      </Coin>
                      <Amount>
                        <CoinBalanceDisplay coin={currency} balance={amount || 0} size='14px' />
                      </Amount>
                    </Wrapper>
                  </BalanceRow>
                )
              })}
            </BalanceTable>
            <Button nature='primary' fullwidth data-e2e='sofiContinue' onClick={viewAccountClick}>
              <FormattedMessage id='buttons.view_my_account' defaultMessage='View my account' />
            </Button>
          </>
        )}
      </Body>
    </Modal>
  )
}

type Props = ModalPropsType

export default modalEnhancer(ModalName.SOFI_MIGRATED_BALANCES)(SofiMigratedBalances)
