import React from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'

import { Remote } from '@core'
import { displayCoinToCoin } from '@core/exchange'
import { GasCalculationOperations, NftAsset } from '@core/network/api/nfts/types'
import {
  Button,
  SpinningLoader,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text
} from 'blockchain-info-components'
import { NftOrderStepEnum } from 'data/components/nfts/types'

import { Props as OwnProps } from '../..'

const CTA: React.FC<Props> = (props) => {
  const { cancelListing, nftActions } = props

  return (
    <>
      <Text size='16px' weight={600} color='grey900'>
        {Remote.Loading.is(cancelListing) ? (
          <SpinningLoader width='11px' height='11px' borderWidth='3px' />
        ) : (
          <FormattedMessage id='copy.active_listings' defaultMessage='Active Listings' />
        )}
      </Text>
      {props.asset.sell_orders?.length ? (
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
          {props.asset.sell_orders?.map((sell_order) => {
            return (
              <>
                <TableRow key={sell_order.order_hash}>
                  <TableCell>
                    <Text size='14px' weight={600}>
                      {displayCoinToCoin({
                        coin: sell_order.payment_token_contract?.symbol || 'ETH',
                        value: sell_order.current_price
                      })}
                    </Text>
                  </TableCell>
                  <TableCell>
                    {sell_order.expiration_time
                      ? moment(sell_order.expiration_time).fromNow()
                      : '-'}
                  </TableCell>
                  <TableCell style={{ justifyContent: 'center' }}>
                    <Button
                      small
                      onClick={() => {
                        nftActions.fetchFees({
                          operation: GasCalculationOperations.Cancel,
                          order: sell_order
                        })
                        nftActions.setActiveOffer({ offer: sell_order })
                        nftActions.setOrderFlowStep({
                          step: NftOrderStepEnum.CANCEL_OFFER
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
      ) : (
        <Text size='14px' weight={600}>
          <FormattedMessage
            id='copy.no_active_sell_listings'
            defaultMessage='There are no active listings to cancel.'
          />
        </Text>
      )}
    </>
  )
}

type Props = OwnProps & { asset: NftAsset }

export default CTA
