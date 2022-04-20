import React from 'react'
import { FormattedMessage } from 'react-intl'
import { formatDistanceToNow } from 'date-fns'

import { displayCoinToCoin } from '@core/exchange'
import { NftAsset } from '@core/network/api/nfts/types'
import { Button, Table, TableCell, TableHeader, TableRow, Text } from 'blockchain-info-components'
import { NftOrderStepEnum } from 'data/components/nfts/types'

import { Props as OwnProps } from '../..'

const CTA: React.FC<Props> = (props) => {
  const { defaultEthAddr, nftActions } = props

  const listings = props.asset.orders.filter(
    (order) => order.maker.address.toLowerCase() === defaultEthAddr.toLowerCase()
  )

  return (
    <>
      {listings.length ? (
        <>
          <Text size='16px' weight={600} color='grey900'>
            <FormattedMessage id='copy.active_listings' defaultMessage='Active Listings:' />
          </Text>
          <Table style={{ maxHeight: '150px', overflow: 'scroll' }}>
            <TableHeader>
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
            </TableHeader>
            {listings.map((order) => {
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
                        {order.closing_date
                          ? formatDistanceToNow(new Date(order.closing_date), { addSuffix: true })
                          : '-'}
                      </Text>
                    </TableCell>
                    <TableCell style={{ justifyContent: 'center' }}>
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

type Props = OwnProps & { asset: NftAsset }

export default CTA
