import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { colors } from '@blockchain-com/constellation'
import { bindActionCreators } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import * as lz from 'lz-string'

import {
  Button,
  CheckBoxInput,
  HeartbeatLoader,
  Image,
  Link,
  Text
} from 'blockchain-info-components'
import { getEthBalances } from 'components/Balances/selectors'
import CoinDisplay from 'components/Display/CoinDisplay'
import { actions } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { RootState } from 'data/rootReducer'
import { DeepLinkGoal } from 'data/types'

import GetMoreEthComponent from '../../components/GetMoreEth'
import PendingTxMessage from '../../components/PendingTxMessage'
import { Props as OwnProps } from '..'
import { getData } from './selectors'

const CTA: React.FC<Props> = (props) => {
  const {
    amount,
    amtToBuy,
    ethBalancesR,
    isAuthenticated,
    isInvited,
    maxBuyPossible,
    nftActions,
    openSeaAssetR,
    orderFlow
  } = props
  const { orderToMatch, userHasPendingTxR } = orderFlow
  const [selfCustodyBalance, custodialBalance] = ethBalancesR.getOrElse([
    new BigNumber(0),
    new BigNumber(0)
  ])
  const [termsAccepted, setTermsAccepted] = useState(false)
  const toggleTermsAccepted = () => {
    setTermsAccepted(!termsAccepted)
  }
  const userHasPendingTx = userHasPendingTxR.getOrElse(false)

  const acceptTerms = () => {
    setTermsAccepted(true)
  }

  if (!orderToMatch) return null

  const disabled = props.orderFlow.isSubmitting || !termsAccepted || userHasPendingTx

  if (!isAuthenticated) {
    return (
      <>
        {openSeaAssetR.cata({
          Failure: () => null,
          Loading: () => null,
          NotAsked: () => null,
          Success: (val) => (
            <LinkContainer
              to={`/open/${DeepLinkGoal.BUY_NFT}?contract_address=${
                val.asset_contract.address
              }&token_id=${val.token_id}&order=${lz.compressToEncodedURIComponent(
                JSON.stringify(orderToMatch)
              )}`}
            >
              <Button jumbo nature='primary' fullwidth data-e2e='buyNftLogin'>
                <FormattedMessage id='copy.login_buy_now' defaultMessage='Login to Buy Now' />
              </Button>
            </LinkContainer>
          )
        })}
      </>
    )
  }

  if (!isInvited) {
    return (
      <>
        <Link href='https://www.blockchain.com/waitlist/nft' target='_blank'>
          <Button jumbo nature='primary' fullwidth data-e2e='joinWaitlist'>
            <FormattedMessage id='copy.join_waitlist' defaultMessage='Join the Waitlist' />
          </Button>
        </Link>
      </>
    )
  }

  if (userHasPendingTx) {
    return (
      <>
        <PendingTxMessage />
        <br />
        <Button disabled jumbo nature='primary' fullwidth data-e2e='buyNftPendingTx'>
          <FormattedMessage id='copy.buy_now' defaultMessage='Buy Now' />
        </Button>
      </>
    )
  }

  return (
    <>
      {props.data.cata({
        Failure: (e) => (
          <div>
            <Text weight={600} color='grey800' style={{ marginTop: '8px', textAlign: 'center' }}>
              {e === 'INSUFFICIENT_FUNDS' ? (
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
        Success: (val) => (
          <div>
            <div style={{ display: 'flex' }}>
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
                  color={colors.grey200}
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
                  >
                    <FormattedMessage
                      id='copy.terms_of_service'
                      defaultMessage='Terms of Service'
                    />
                  </Link>
                </Text>
              </label>
            </div>
            <Button
              onClick={() =>
                nftActions.createOrder({
                  asset: val.asset,
                  gasData: val.fees,
                  ...val.matchingOrder
                })
              }
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
  data: getData(state),
  ethBalancesR: getEthBalances(state)
})
const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = OwnProps &
  ConnectedProps<typeof connector> & {
    amount: string
    amtToBuy: BigNumber
    maxBuyPossible: BigNumber
  }

export default connector(CTA)
