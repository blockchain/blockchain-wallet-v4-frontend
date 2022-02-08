import React from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'

import { displayCoinToCoin } from '@core/exchange'
import { NftAsset, RawOrder } from '@core/network/api/nfts/types'
import { Button, Table, TableCell, TableRow, Text } from 'blockchain-info-components'
import { NftOrderStepEnum } from 'data/components/nfts/types'

import { StickyTableHeader } from '../../../components'
import { Props as OwnProps } from '../..'

const ActiveOrders: React.FC<Props> = (props) => {
  const { asset, defaultEthAddr, nftActions, orders } = props
  return (
    <>
      {orders.length ? (
        <>
          <Text size='16px' weight={600} color='grey900'>
            <FormattedMessage id='copy.active_listings' defaultMessage='Active Listings:' />
          </Text>
          <Table style={{ maxHeight: '150px', overflow: 'auto' }}>
            <StickyTableHeader>
              <TableCell>
                <Text size='12px' weight={600}>
                  Price
                </Text>
              </TableCell>
              <TableCell>
                <Text size='12px' weight={600}>
                  Expires
                </Text>
              </TableCell>
              <TableCell style={{ justifyContent: 'center' }}>
                <Text size='12px' weight={600}>
                  Actions
                </Text>
              </TableCell>
            </StickyTableHeader>
            {orders.map((order) => {
              return (
                <>
                  <TableRow key={order.order_hash}>
                    <TableCell>
                      <Text size='14px' weight={600}>
                        {displayCoinToCoin({
                          coin: order.payment_token_contract?.symbol || 'ETH',
                          value: order.current_price
                        })}
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Text size='14px' weight={600}>
                        {order.closing_date ? moment(order.closing_date).fromNow() : '-'}
                      </Text>
                    </TableCell>
                    <TableCell style={{ justifyContent: 'center' }}>
                      {asset.owner.address.toLowerCase() === defaultEthAddr.toLowerCase() ? (
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
        </>
      ) : null}
    </>
  )
}

type Props = OwnProps & { asset: NftAsset; orders: RawOrder[] }

export default ActiveOrders
