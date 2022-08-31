import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { PaletteColors } from '@blockchain-com/constellation'
import { bindActionCreators } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { getIsSharedStorefront } from 'blockchain-wallet-v4-frontend/src/scenes/Nfts/utils/NftUtils'
import * as lz from 'lz-string'
import styled from 'styled-components'

import { Remote } from '@core'
import { NftAsset } from '@core/network/api/nfts/types'
import {
  Button,
  CheckBoxInput,
  Color,
  HeartbeatLoader,
  Image,
  Link,
  Text
} from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import { Flex } from 'components/Flex'
import { actions, selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { RootState } from 'data/rootReducer'
import { DeepLinkGoal } from 'data/types'

import GetMoreEthComponent from '../../components/GetMoreEth'
import NftNotInvited from '../../components/NftNotInvited'
import PendingEthTxMessage from '../../components/PendingEthTxMessage'
import { Props as OwnProps } from '..'
import { InsufficientFundsNftBuyErrors } from './NftOrder.Buy.types'

export const CheckboxWrapper = styled(Flex)<{ termsAccepted: boolean }>`
  background: ${(props) =>
    props.termsAccepted ? PaletteColors['white-900'] : Color('greyFade000')};
  border: 1px solid ${PaletteColors['grey-000']};
  border-radius: 8px;
  margin: 1em 0em;
  justify-content: center;
`

const CTA: React.FC<Props> = (props) => {
  const {
    amount,
    amtToBuy,
    asset,
    ethBalancesR,
    isAuthenticated,
    isInvited,
    maxBuyPossible,
    nftActions,
    orderFlow
  } = props
  const { matchingOrder_LEGACY, seaportOrder, userHasPendingTxR } = orderFlow
  const [selfCustodyBalance, custodialBalance] = ethBalancesR.getOrElse([
    new BigNumber(0),
    new BigNumber(0)
  ])
  const [termsAccepted, setTermsAccepted] = useState(false)
  const toggleTermsAccepted = () => {
    setTermsAccepted(!termsAccepted)
  }
  const userHasPendingTx = userHasPendingTxR.getOrElse(false)
  const IS_SHARED_STOREFRONT = getIsSharedStorefront(asset)

  const acceptTerms = () => {
    setTermsAccepted(true)
  }

  const disabled =
    props.orderFlow.isSubmitting ||
    !termsAccepted ||
    userHasPendingTx ||
    (IS_SHARED_STOREFRONT && !Remote.Success.is(matchingOrder_LEGACY))

  if (!isAuthenticated) {
    return (
      <LinkContainer
        to={`/open/${DeepLinkGoal.BUY_NFT}?contract_address=${
          asset.asset_contract.address
        }&token_id=${asset.token_id}&order=${lz.compressToEncodedURIComponent(
          JSON.stringify(seaportOrder)
        )}`}
      >
        <Button jumbo nature='primary' fullwidth data-e2e='buyNftLogin'>
          <FormattedMessage id='copy.login_buy_now' defaultMessage='Login to Buy Now' />
        </Button>
      </LinkContainer>
    )
  }

  if (!isInvited) {
    return <NftNotInvited />
  }

  if (userHasPendingTx) {
    return (
      <>
        <PendingEthTxMessage />
        <br />
        <Button disabled jumbo nature='primary' fullwidth data-e2e='buyNftPendingTx'>
          <FormattedMessage id='copy.buy_now' defaultMessage='Buy Now' />
        </Button>
      </>
    )
  }

  return (
    <>
      {orderFlow.fees.cata({
        Failure: (e) => (
          <div>
            <Text weight={600} color='grey800' style={{ marginTop: '8px', textAlign: 'center' }}>
              {Object.values<string>(InsufficientFundsNftBuyErrors).includes(e) ? (
                <>
                  <GetMoreEthComponent
                    amount={amount}
                    amtToBuy={amtToBuy}
                    selfCustodyBalance={new BigNumber(selfCustodyBalance)}
                    custodialBalance={new BigNumber(custodialBalance)}
                  />
                  <div style={{ padding: '1em 0em' }}>
                    <Text
                      size='12px'
                      weight={500}
                      style={{ display: 'flex', justifyContent: 'center' }}
                    >
                      The max you can offer from this wallet is&nbsp;
                      <CoinDisplay style={{ fontSize: '12px', fontWeight: 'bold' }} coin='ETH'>
                        {Math.max(maxBuyPossible.toNumber(), 0)}
                      </CoinDisplay>
                    </Text>
                    <Link
                      weight={600}
                      size='14px'
                      onClick={() =>
                        nftActions.setOrderFlowStep({ step: NftOrderStepEnum.MAKE_OFFER })
                      }
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        textAlign: 'center',
                        width: '100%'
                      }}
                    >
                      Make an Offer
                    </Link>
                    <Button disabled rounded nature='dark' fullwidth data-e2e='notEnoughEth'>
                      <Image
                        width='16px'
                        height='16px'
                        name='alert-orange'
                        style={{ marginRight: '0.5em' }}
                      />
                      <FormattedMessage id='copy.not_enough_eth' defaultMessage='Not Enough ETH' />
                    </Button>
                  </div>
                </>
              ) : e === 'Sell order is invalid' ? (
                <FormattedMessage
                  id='copy.may_already_have_completed'
                  defaultMessage='Invalid order. This asset has already been purchased.'
                />
              ) : e.includes('UNPREDICTABLE_GAS_LIMIT') ? (
                <Flex gap={4} flexDirection='column'>
                  <FormattedMessage
                    id='copy.unpredictable_gas_limit'
                    defaultMessage='Cannot estimate gas, transaction may fail. Check console for full error.'
                  />
                  {/* eslint-disable-next-line no-console */}
                  {console.log(e)}
                </Flex>
              ) : (
                e
              )}
            </Text>
          </div>
        ),
        Loading: () => (
          <Button jumbo nature='primary' fullwidth disabled data-e2e='buyNft'>
            <FormattedMessage id='copy.loading' defaultMessage='Loading...' />
          </Button>
        ),
        NotAsked: () => (
          <Button jumbo nature='primary' fullwidth disabled data-e2e='buyNft'>
            <FormattedMessage id='copy.loading' defaultMessage='Loading...' />
          </Button>
        ),
        Success: (gasData) => (
          <div>
            <CheckboxWrapper termsAccepted={termsAccepted}>
              {' '}
              <div style={{ padding: '1.2em 0em' }}>
                <CheckBoxInput
                  name='terms'
                  disabled={false}
                  onChange={toggleTermsAccepted}
                  checked={termsAccepted}
                />
              </div>
              <label htmlFor='terms'>
                <Text
                  color={PaletteColors['grey-200']}
                  weight={500}
                  size='16px'
                  style={{ padding: '1em 0em', textAlign: 'center' }}
                >
                  <FormattedMessage
                    id='copy.agree_to_blockchain'
                    defaultMessage='I agree to Blockchain.com’s'
                  />{' '}
                  <Link
                    onClick={acceptTerms}
                    href='https://www.blockchain.com/legal/terms'
                    target='_blank'
                    size='inherit'
                  >
                    <FormattedMessage
                      id='copy.terms_of_service'
                      defaultMessage='Terms of Service'
                    />
                  </Link>
                </Text>
              </label>
            </CheckboxWrapper>
            <Button
              onClick={() => {
                if (IS_SHARED_STOREFRONT) {
                  // @ts-ignore
                  nftActions.createOrder_LEGACY({
                    asset,
                    gasData,
                    // @ts-ignore
                    ...matchingOrder_LEGACY.getOrElse({})
                  })
                } else {
                  nftActions.createOrder({
                    asset,
                    gasData,
                    seaportOrder: orderFlow.seaportOrder!
                  })
                }
              }}
              jumbo
              nature='primary'
              fullwidth
              disabled={disabled}
              data-e2e='buyNft'
            >
              {props.orderFlow.isSubmitting ? (
                <HeartbeatLoader color='blue100' height='20px' width='20px' />
              ) : (
                <FormattedMessage id='copy.buy_now' defaultMessage='Buy Now' />
              )}
            </Button>
            <Text size='12px' weight={500} style={{ margin: '8px 0', textAlign: 'center' }}>
              Or
            </Text>
            <Link
              weight={600}
              size='14px'
              onClick={() => nftActions.setOrderFlowStep({ step: NftOrderStepEnum.MAKE_OFFER })}
              style={{ display: 'block', textAlign: 'center', width: '100%' }}
            >
              Make an Offer
            </Link>
          </div>
        )
      })}
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  ethBalancesR: selectors.balances.getCoinBalancesTypeSeparated('ETH')(state)
})
const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = OwnProps &
  ConnectedProps<typeof connector> & {
    amount: string
    amtToBuy: BigNumber
    asset: NftAsset
    maxBuyPossible: BigNumber
  }

export default connector(CTA)
