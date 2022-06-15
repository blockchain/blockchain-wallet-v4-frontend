import React from 'react'
import { FormattedMessage } from 'react-intl'
import { props } from 'ramda'

import { NftAsset } from '@core/network/api/nfts/types'
import { Button, HeartbeatLoader } from 'blockchain-info-components'
import { Analytics } from 'data/types'

import NftNotInvited from '../../components/NftNotInvited'
import PendingEthTxMessage from '../../components/PendingEthTxMessage'
import { Props as OwnProps } from '.'

const CTA: React.FC<Props> = ({
  amount,
  analyticsActions,
  asset,
  formValues,
  isInvited,
  nftActions,
  orderFlow,
  saleType
}) => {
  const { userHasPendingTxR } = orderFlow
  const userHasPendingTx = userHasPendingTxR.getOrElse(false)

  if (!isInvited) return <NftNotInvited />

  if (userHasPendingTx)
    return (
      <>
        <PendingEthTxMessage />
        <br />
        <Button jumbo nature='primary' fullwidth data-e2e='sellNft' disabled>
          <FormattedMessage id='copy.sell_item' defaultMessage='Sell Item' />
        </Button>
      </>
    )

  const disabled = (
    saleType === 'fixed-price'
      ? // Fixed Price
        !formValues?.fixAmount
      : // Dutch (Declining)
        formValues?.timedAuctionType === 'decliningPrice'
  )
    ? !formValues?.starting || !formValues?.ending || formValues?.ending >= formValues?.starting
    : // English (Ascending)
      !formValues.starting ||
      (formValues.reserve &&
        formValues.reserve >= formValues.starting &&
        formValues?.timedAuctionType === 'highestBidder') ||
      orderFlow.isSubmitting

  return (
    <div>
      {orderFlow.fees.cata({
        Failure: () => (
          <Button jumbo nature='sent' fullwidth data-e2e='sellNft' disabled>
            <FormattedMessage id='copy.sell_item' defaultMessage='Sell Item' />
          </Button>
        ),
        Loading: () => (
          <Button jumbo nature='primary' fullwidth data-e2e='sellNft' disabled>
            <FormattedMessage id='copy.sell_item' defaultMessage='Sell Item' />
          </Button>
        ),
        NotAsked: () => null,
        Success: (fees) => (
          <Button
            jumbo
            nature='primary'
            fullwidth
            data-e2e='sellNft'
            disabled={disabled}
            onClick={() => {
              if (saleType === 'fixed-price') {
                nftActions.createSellOrder({
                  asset,
                  endPrice: null,
                  expirationMinutes: formValues.expirationMinutes,
                  gasData: fees,
                  paymentTokenAddress: undefined,
                  reservePrice: undefined,
                  startPrice: Number(amount),
                  waitForHighestBid: false
                })
                // English Auction
              } else if (
                saleType === 'timed-auction' &&
                formValues?.timedAuctionType === 'highestBidder'
              ) {
                nftActions.createSellOrder({
                  asset,
                  endPrice: null,
                  expirationMinutes: formValues.expirationMinutes,
                  gasData: fees,
                  paymentTokenAddress: window.coins.WETH.coinfig.type.erc20Address,
                  reservePrice: Number(formValues.reserve),
                  startPrice: Number(formValues.starting),
                  waitForHighestBid: true
                })
              }
              // Dutch Auction
              else {
                nftActions.createSellOrder({
                  asset,
                  endPrice: Number(formValues.ending),
                  expirationMinutes: formValues.expirationMinutes,
                  gasData: fees,
                  paymentTokenAddress: undefined,
                  reservePrice: undefined,
                  startPrice: Number(formValues.starting),
                  waitForHighestBid: false
                })
              }

              analyticsActions.trackEvent({
                key: Analytics.NFT_SELL_ITEM_CLICKED,
                properties: {
                  amount: Number(amount),
                  collection: asset.collection.name,
                  collection_id: asset.token_id,
                  selling_fees: Number(fees.totalFees),
                  type: saleType === 'fixed-price' ? 'FIXED_PRICE' : 'TIME_AUCTION'
                }
              })
            }}
          >
            {orderFlow.isSubmitting ? (
              <HeartbeatLoader color='blue100' height='20px' width='20px' />
            ) : (
              <FormattedMessage id='copy.sell_item' defaultMessage='Sell Item' />
            )}
          </Button>
        )
      })}
    </div>
  )
}

type Props = OwnProps & {
  amount: string
  asset: NftAsset
  saleType: 'fixed-price' | 'timed-auction'
}

export default CTA
