import React from 'react'
import { FormattedMessage } from 'react-intl'
import { getIsSharedStorefront } from 'blockchain-wallet-v4-frontend/src/scenes/Nfts/utils/NftUtils'

import { Remote } from '@core'
import { GasDataI, NftAsset } from '@core/network/api/nfts/types'
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
  const { fees, userHasPendingTxR } = orderFlow
  const userHasPendingTx = userHasPendingTxR.getOrElse(false)
  const IS_SHARED_STOREFRONT = getIsSharedStorefront(asset)

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

  const disabled =
    (saleType === 'fixed-price'
      ? // Fixed Price
        !formValues?.fixAmount
      : // Dutch (Declining)
      formValues?.timedAuctionType === 'decliningPrice'
      ? !formValues?.starting || !formValues?.ending || formValues?.ending >= formValues?.starting
      : // English (Ascending)
        !formValues.starting ||
        (formValues.reserve &&
          formValues.reserve < formValues.starting &&
          formValues?.timedAuctionType === 'highestBidder')) ||
    orderFlow.isSubmitting ||
    // TODO: SEAPORT
    // opensea v2 api does not currently support english auctions
    formValues.timedAuctionType === 'highestBidder' ||
    !Remote.Success.is(fees)

  return (
    <div>
      <Button
        jumbo
        nature='primary'
        fullwidth
        data-e2e='sellNft'
        disabled={disabled}
        onClick={() => {
          if (IS_SHARED_STOREFRONT) {
            if (saleType === 'fixed-price') {
              nftActions.createListing_LEGACY({
                asset,
                endPrice: null,
                expirationMinutes: formValues.expirationMinutes,
                gasData: fees.getOrElse({ totalFees: 0 } as GasDataI),
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
              nftActions.createListing_LEGACY({
                asset,
                endPrice: null,
                expirationMinutes: formValues.expirationMinutes,
                gasData: fees.getOrElse({ totalFees: 0 } as GasDataI),
                paymentTokenAddress: window.coins.WETH.coinfig.type.erc20Address,
                reservePrice: Number(formValues.reserve),
                startPrice: Number(formValues.starting),
                waitForHighestBid: true
              })
            }
            // Dutch Auction
            else {
              nftActions.createListing_LEGACY({
                asset,
                endPrice: Number(formValues.ending),
                expirationMinutes: formValues.expirationMinutes,
                gasData: fees.getOrElse({ totalFees: 0 } as GasDataI),
                paymentTokenAddress: undefined,
                reservePrice: undefined,
                startPrice: Number(formValues.starting),
                waitForHighestBid: false
              })
            }
          } else if (saleType === 'fixed-price') {
            nftActions.createListing({
              asset,
              endPrice: null,
              expirationMinutes: formValues.expirationMinutes,
              gasData: fees.getOrElse({ totalFees: 0 } as GasDataI),
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
            nftActions.createListing({
              asset,
              endPrice: null,
              expirationMinutes: formValues.expirationMinutes,
              gasData: fees.getOrElse({ totalFees: 0 } as GasDataI),
              paymentTokenAddress: window.coins.WETH.coinfig.type.erc20Address,
              reservePrice: Number(formValues.reserve),
              startPrice: Number(formValues.starting),
              waitForHighestBid: true
            })
          }
          // Dutch Auction
          else {
            nftActions.createListing({
              asset,
              endPrice: Number(formValues.ending),
              expirationMinutes: formValues.expirationMinutes,
              gasData: fees.getOrElse({ totalFees: 0 } as GasDataI),
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
    </div>
  )
}

type Props = OwnProps & {
  amount: string
  asset: NftAsset
  saleType: 'fixed-price' | 'timed-auction'
}

export default CTA
