import React from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'
import { formatDistanceToNow } from 'date-fns'

import { displayCoinToCoin } from '@core/exchange'
import { GasCalculationOperations, NftAsset, RawOrder } from '@core/network/api/nfts/types'
import { Button, Link, Table, TableCell, TableRow, Text } from 'blockchain-info-components'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { orderFromJSON } from 'data/components/nfts/utils'

import { StickyTableHeader } from '../../../components'
import { Props as OwnProps } from '../..'

const ActiveOffers: React.FC<Props> = (props) => {
  const { asset, defaultEthAddr, nftActions, offers, orderFlow } = props

  const isOwner =
    asset.owner.address.toLowerCase() === defaultEthAddr.toLowerCase() ||
    orderFlow.walletUserIsAssetOwnerHack

  return (
    <>
      {offers.length ? (
        <Text size='16px' weight={600} color='grey900'>
          <FormattedMessage id='copy.active_offers' defaultMessage='Active Offers:' />
        </Text>
      ) : null}
      <Table style={{ maxHeight: '150px', overflow: 'auto' }}>
        {offers.length ? (
          <StickyTableHeader>
            <TableCell width='40%'>
              <Text size='12px' weight={600}>
                Price
              </Text>
            </TableCell>
            <TableCell width='25%'>
              <Text size='12px' weight={600}>
                Expires
              </Text>
            </TableCell>
            <TableCell width='35%' style={{ justifyContent: 'end' }}>
              <Text size='12px' weight={600}>
                Actions
              </Text>
            </TableCell>
          </StickyTableHeader>
        ) : null}
        {offers
          .sort((a, b) => (new BigNumber(a.current_price).isLessThan(b.current_price) ? 1 : -1))
          .map((offer) => {
            return (
              <>
                <TableRow key={offer.order_hash}>
                  <TableCell width='40%'>
                    <Text size='14px' weight={600}>
                      {displayCoinToCoin({
                        coin: offer.payment_token_contract?.symbol || 'ETH',
                        value: offer.current_price
                      })}
                    </Text>
                  </TableCell>
                  <TableCell width='25%'>
                    <Text size='14px' weight={600}>
                      {offer.closing_date ? formatDistanceToNow(new Date(offer.closing_date)) : '-'}
                    </Text>
                  </TableCell>
                  <TableCell width='35%' style={{ justifyContent: 'end' }}>
                    {asset.owner.address.toLowerCase() === defaultEthAddr.toLowerCase() ? (
                      <Button
                        small
                        onClick={() => {
                          nftActions.fetchFees({
                            operation: GasCalculationOperations.AcceptOffer,
                            order: orderFromJSON(offer)
                          })
                          nftActions.setOrderFlowStep({
                            step: NftOrderStepEnum.ACCEPT_OFFER
                          })
                        }}
                        nature='primary'
                        data-e2e='acceptOfferNft'
                      >
                        <FormattedMessage id='button.accept' defaultMessage='Accept' />
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              </>
            )
          })}
      </Table>
      {isOwner ? null : (
        <Link
          weight={600}
          size='14px'
          onClick={() => nftActions.setOrderFlowStep({ step: NftOrderStepEnum.MAKE_OFFER })}
          style={{ display: 'block', paddingTop: '8px', textAlign: 'center', width: '100%' }}
        >
          Make an Offer
        </Link>
      )}
    </>
  )
}

type Props = OwnProps & { asset: NftAsset; offers: RawOrder[] }

export default ActiveOffers
