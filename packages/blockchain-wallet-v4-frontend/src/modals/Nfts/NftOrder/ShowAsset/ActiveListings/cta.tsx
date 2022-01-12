import React from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'
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
  Text,
  Tooltip,
  TooltipHost
} from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

import { CTARow } from '../../../components'
import { Props as OwnProps } from '../..'

const CTA: React.FC<Props> = (props) => {
  const { cancelListing, nftActions, orderFlow } = props

  return (
    <>
      <Text size='16px' weight={600} color='grey900'>
        {Remote.Loading.is(cancelListing) ? (
          <SpinningLoader width='11px' height='11px' borderWidth='3px' />
        ) : (
          <FormattedMessage id='copy.active_listings' defaultMessage='Active Listings' />
        )}
      </Text>
      {orderFlow.fees.cata({
        Failure: () => (
          <Text size='14px' weight={600}>
            <FormattedMessage
              id='copy.no_active_sell_listings'
              defaultMessage='Error. You may not have any active listings on this asset.'
            />
          </Text>
        ),
        Loading: () => (
          <CTARow>
            <SpinningLoader width='14px' height='14px' borderWidth='3px' />
          </CTARow>
        ),
        NotAsked: () => null,
        Success: (val) => {
          return props.asset.sell_orders?.length ? (
            <Table>
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
                <TableCell>
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
                      <TableCell>
                        <TooltipHost id='cancel_fees'>
                          <Button
                            small
                            disabled={Remote.Loading.is(cancelListing)}
                            onClick={() => nftActions.cancelListing({ gasData: val, sell_order })}
                            nature='primary'
                            data-e2e='cancelListingNft'
                            onMouseEnter={() => {
                              nftActions.fetchFees({
                                operation: GasCalculationOperations.Cancel,
                                order: sell_order
                              })
                            }}
                          >
                            <FormattedMessage id='button.cancel' defaultMessage='Cancel' />
                          </Button>
                          <Tooltip id='cancel_fees'>
                            <div style={{ display: 'flex' }}>
                              <Text color='white' size='12px'>
                                Fee:
                              </Text>
                              &nbsp;
                              <CoinDisplay size='12px' color='white' coin='ETH'>
                                {new BigNumber(val.totalFees).multipliedBy(val.gasPrice).toString()}
                              </CoinDisplay>
                              &nbsp;-&nbsp;
                              <FiatDisplay size='12px' color='white' coin='ETH'>
                                {new BigNumber(val.totalFees).multipliedBy(val.gasPrice).toString()}
                              </FiatDisplay>
                            </div>
                          </Tooltip>
                        </TooltipHost>
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
          )
        }
      })}
    </>
  )
}

type Props = OwnProps & { asset: NftAsset }

export default CTA
