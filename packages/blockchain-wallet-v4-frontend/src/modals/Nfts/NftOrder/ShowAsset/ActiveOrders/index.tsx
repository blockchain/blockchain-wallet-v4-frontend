import React from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'
import { formatDistanceToNow } from 'date-fns'

import { displayCoinToCoin } from '@core/exchange'
import { NftAsset, RawOrder } from '@core/network/api/nfts/types'
import { Button, Table, TableCell, TableRow, Text } from 'blockchain-info-components'
import { NftOrderStepEnum } from 'data/components/nfts/types'

import { StickyTableHeader } from '../../../components'
import { Props as OwnProps } from '../..'

const ActiveOrders: React.FC<Props> = (props) => {
  const { asset, defaultEthAddr, nftActions, orderFlow, orders } = props

  const isOwner =
    asset.owner.address.toLowerCase() === defaultEthAddr.toLowerCase() ||
    orderFlow.walletUserIsAssetOwnerHack

  const getType = (order) => {
    return order.sale_kind === 1 ? 'Desc' : order.v === 0 ? 'Asc' : 'Fixed'
  }

  return (
    <>
      {orders.length ? (
        <>
          <Text size='16px' weight={600} color='grey900'>
            <FormattedMessage id='copy.active_listings' defaultMessage='Active Listings:' />
          </Text>
          <Table style={{ maxHeight: '150px', overflow: 'auto' }}>
            <StickyTableHeader>
              <TableCell width='40%'>
                <Text size='12px' weight={600}>
                  Price
                </Text>
              </TableCell>
              <TableCell width='20%'>
                <Text size='12px' weight={600}>
                  Expires
                </Text>
              </TableCell>
              <TableCell width='20%'>
                <Text size='12px' weight={600}>
                  Type
                </Text>
              </TableCell>
              <TableCell width='20%' style={{ justifyContent: 'flex-end' }}>
                <Text size='12px' weight={600}>
                  Actions
                </Text>
              </TableCell>
            </StickyTableHeader>
            {orders
              .sort((a, b) =>
                new BigNumber(a.current_price).isGreaterThan(b.current_price) ? 1 : -1
              )
              .map((order) => {
                return (
                  <>
                    <TableRow key={order.order_hash}>
                      <TableCell width='40%'>
                        <Text size='14px' weight={600}>
                          {displayCoinToCoin({
                            coin: order.payment_token_contract?.symbol || 'ETH',
                            value: order.current_price
                          })}
                        </Text>
                      </TableCell>
                      <TableCell width='20%'>
                        <Text size='14px' weight={600}>
                          {order.closing_date
                            ? formatDistanceToNow(new Date(order.closing_date))
                            : '-'}
                        </Text>
                      </TableCell>
                      <TableCell width='20%'>
                        <Text size='14px' weight={600}>
                          {getType(order)}
                        </Text>
                      </TableCell>
                      <TableCell width='20%' style={{ justifyContent: 'flex-end' }}>
                        {isOwner ? (
                          <Button
                            small
                            onClick={() => {
                              nftActions.setListingToCancel({ order })
                              nftActions.setOrderFlowStep({
                                step: NftOrderStepEnum.CANCEL_LISTING
                              })
                            }}
                            nature='primary'
                            data-e2e='cancelListingNft'
                          >
                            <FormattedMessage id='button.cancel' defaultMessage='Cancel' />
                          </Button>
                        ) : (
                          <Button
                            small
                            onClick={() => {
                              nftActions.setOrderToMatch({ order })
                              nftActions.setOrderFlowStep({
                                step: NftOrderStepEnum.BUY
                              })
                            }}
                            nature='primary'
                            data-e2e='buyNft'
                          >
                            <FormattedMessage id='copy.buy' defaultMessage='Buy' />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  </>
                )
              })}
          </Table>
          <br />
        </>
      ) : null}
    </>
  )
}

type Props = OwnProps & { asset: NftAsset; orders: RawOrder[] }

export default ActiveOrders
