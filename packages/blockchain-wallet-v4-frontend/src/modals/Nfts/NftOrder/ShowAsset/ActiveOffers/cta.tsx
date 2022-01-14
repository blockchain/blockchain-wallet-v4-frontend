import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'

import { Remote } from '@core'
import { displayCoinToCoin } from '@core/exchange'
import { GasCalculationOperations, NftAsset } from '@core/network/api/nfts/types'
import {
  Button,
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

import { Props as OwnProps } from '../..'

const CTA: React.FC<Props> = (props) => {
  const { acceptOffer, nftActions, offerToAccept, offersForAsset, orderFlow } = props

  useEffect(() => {
    nftActions.fetchNftOffersForAsset({
      asset_contract_address: props.asset.asset_contract.address,
      token_id: props.asset.token_id
    })
  }, [])

  return offersForAsset.list.length ? (
    <>
      <Text size='16px' weight={600} color='grey900'>
        <FormattedMessage id='copy.active_offers' defaultMessage='Active Offers' />
      </Text>
      {orderFlow.fees.cata({
        Failure: () => null,
        Loading: () => null,
        NotAsked: () => null,
        Success: (val) => {
          return (
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
              {[...offersForAsset.list]
                .sort((a, b) => {
                  return a.created_date < b.created_date ? 1 : -1
                })
                ?.map((offer) => {
                  return (
                    <>
                      <TableRow key={offer.created_date}>
                        <TableCell>
                          <Text size='14px' weight={600}>
                            {displayCoinToCoin({
                              coin: 'WETH',
                              value: offer.bid_amount
                            })}
                          </Text>
                        </TableCell>
                        <TableCell>-</TableCell>
                        <TableCell style={{ justifyContent: 'center' }}>
                          <TooltipHost id='accept_fees'>
                            <Button
                              small
                              disabled={Remote.Loading.is(acceptOffer)}
                              onClick={() => {
                                if (!offerToAccept) return
                                nftActions.acceptOffer({
                                  gasData: val,
                                  ...offerToAccept
                                })
                              }}
                              nature='empty'
                              data-e2e='acceptNftOffer'
                              onMouseEnter={() => {
                                nftActions.fetchFees({
                                  event: offer,
                                  operation: GasCalculationOperations.Accept
                                })
                              }}
                            >
                              <FormattedMessage id='button.accept' defaultMessage='Accept' />
                            </Button>
                            <Tooltip id='accept_fees'>
                              <div style={{ display: 'flex' }}>
                                <Text color='white' size='12px'>
                                  Fee:
                                </Text>
                                &nbsp;
                                <CoinDisplay size='12px' color='white' coin='ETH'>
                                  {new BigNumber(val.totalFees)
                                    .multipliedBy(val.gasPrice)
                                    .toString()}
                                </CoinDisplay>
                                &nbsp;-&nbsp;
                                <FiatDisplay size='12px' color='white' coin='ETH'>
                                  {new BigNumber(val.totalFees)
                                    .multipliedBy(val.gasPrice)
                                    .toString()}
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
          )
        }
      })}
    </>
  ) : null
}

type Props = OwnProps & { asset: NftAsset }

export default CTA
