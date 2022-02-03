import React from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'

import { Remote } from '@core'
import { displayCoinToCoin } from '@core/exchange'
import { GasCalculationOperations, NftAsset } from '@core/network/api/nfts/types'
import { Button, Table, TableCell, TableHeader, TableRow, Text } from 'blockchain-info-components'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { orderFromJSON } from 'data/components/nfts/utils'

import { Props as OwnProps } from '../..'

const CTA: React.FC<Props> = (props) => {
  const { defaultEthAddr, nftActions } = props

  const offers = props.asset.orders.filter(
    (order) => order.maker.address.toLowerCase() !== defaultEthAddr.toLowerCase()
  )

  return offers.length ? (
    <>
      <Text size='16px' weight={600} color='grey900'>
        <FormattedMessage id='copy.active_offers' defaultMessage='Active Offers:' />
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
        {[...offers].map((offer) => {
          return (
            <>
              <TableRow key={offer.created_date.toString()}>
                <TableCell>
                  <Text size='14px' weight={600}>
                    {displayCoinToCoin({
                      coin: 'WETH',
                      value: offer.current_price.toString() || 0
                    })}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text size='14px' weight={600}>
                    {offer.closing_date ? moment(offer.closing_date).fromNow() : '-'}
                  </Text>
                </TableCell>
                <TableCell style={{ justifyContent: 'center' }}>
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
                    nature='empty'
                    data-e2e='acceptNftOffer'
                  >
                    <FormattedMessage id='button.accept' defaultMessage='Accept' />
                  </Button>
                </TableCell>
              </TableRow>
            </>
          )
        })}
      </Table>
    </>
  ) : null
}

type Props = OwnProps & { asset: NftAsset }

export default CTA
