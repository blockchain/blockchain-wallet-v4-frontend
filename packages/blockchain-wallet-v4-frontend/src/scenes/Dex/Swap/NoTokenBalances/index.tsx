import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Link, Text } from 'blockchain-info-components'
import { getData } from 'components/Banner/selectors'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName } from 'data/types'

import { InfoWidget, PageWrapper, SceneCard } from '../../components'

const NATIVE_TOKEN = 'ETH'

const CustomSceneCard = styled(SceneCard)`
  justify-content: center;
`

export const NoTokenBalances = () => {
  const dispatch = useDispatch()
  const nativeTokenAccount = useSelector((state: RootState) => {
    const accounts = selectors.coins.getCoinAccounts(state, {
      coins: [NATIVE_TOKEN],
      nonCustodialAccounts: true
    })

    return accounts[NATIVE_TOKEN][0]
  })
  const onReceiveCoin = () => {
    dispatch(
      actions.modals.showModal(
        ModalName.REQUEST_CRYPTO_MODAL,
        {
          origin: 'Dex'
        },
        { account: nativeTokenAccount, coin: NATIVE_TOKEN }
      )
    )
  }

  const isUserFromUK = useSelector(getData)?.country === 'GB'

  return (
    <PageWrapper>
      <CustomSceneCard height={356}>
        <InfoWidget
          imageWidth='88px'
          image='dex-no-token-balances'
          title={
            <FormattedMessage
              id='dex.noTokenBalances.title'
              defaultMessage='To get started, transfer ETH 
              to your wallet'
            />
          }
          description={
            <>
              <FormattedMessage
                id='dex.noTokenBalances.description'
                defaultMessage='Transfer from your Blockchain.com Account, send from any exchange, or ask a friend!'
              />
              {isUserFromUK && (
                <Text weight={500} size='14px' italic style={{ marginTop: 8 }}>
                  Find out more about Staking and Rewards
                  <br />
                  as well as the risks here{' '}
                  <Link
                    size='14px'
                    href='https://support.blockchain.com/hc/en-us/articles/10857167024156-Various-Cryptoassets-and-Their-Risks'
                    target='_blank'
                    style={{ textDecoration: 'underline' }}
                  >
                    here
                  </Link>
                  .
                </Text>
              )}
            </>
          }
        />
        <Button
          width='full'
          size='large'
          variant='primary'
          text={
            <FormattedMessage
              id='dex.noTokenBalances.receive-cta'
              defaultMessage='Receive Ethereum'
            />
          }
          onClick={onReceiveCoin}
        />
      </CustomSceneCard>
    </PageWrapper>
  )
}
