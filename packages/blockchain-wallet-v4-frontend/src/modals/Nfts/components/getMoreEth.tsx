import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'

import { OrderType } from '@core/types'
import { Button, Icon, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'

const MoreEth = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1em;
  border: 1px solid ${(props) => props.theme.blue500};
  border-radius: 12px;
  font-family: Inter, sans-serif;
`

const GetMoreEthComponent: React.FC<Props> = (props: any) => {
  const { formValues, orderFlow } = props
  return (
    <>
      <MoreEth>
        <div style={{ display: 'flex' }}>
          <Icon size='32px' name='ETH' />{' '}
          <div style={{ display: 'block', padding: '0em 1em' }}>
            {props[1] !== 0 ? (
              <>
                <Text size='12px' weight={400}>
                  Send ETH from Trading Wallet
                </Text>
                <Text weight={600}>Send 0.00 ETH</Text>
              </>
            ) : (
              <>
                <Text size='12px' weight={400}>
                  Get More ETH
                </Text>
                <Text weight={600}>
                  {orderFlow?.wrapEthFees?.data?.totalFees && (
                    <CoinDisplay size='14px' color='black' weight={600} coin='ETH'>
                      {Number(formValues.amount) > 0 &&
                        new BigNumber(1000000000000000000 * Number(formValues.amount))
                          .minus(
                            new BigNumber(
                              10000 * orderFlow.wrapEthFees.data.totalFees
                            ).multipliedBy(orderFlow.wrapEthFees.data.gasPrice)
                          )
                          .toString()}
                    </CoinDisplay>
                  )}
                </Text>
              </>
            )}
          </div>
        </div>
        {props[1] !== 0 ? (
          <Button
            size='xsmall'
            small
            rounded
            nature='primary'
            data-e2e='buyMoreEth'
            width='40px'
            onClick={() => {}}
          >
            <FormattedMessage id='modal.nfts.buy_more_eth' defaultMessage='Send' />
          </Button>
        ) : (
          <Button
            size='xsmall'
            small
            rounded
            nature='primary'
            data-e2e='buyMoreEth'
            width='40px'
            onClick={() => {
              props.buySellActions.showModal({
                orderType: OrderType.BUY,
                origin: 'NftsMakeOffer'
              })
            }}
          >
            <FormattedMessage id='modal.nfts.buy_more_eth' defaultMessage='Buy' />
          </Button>
        )}
      </MoreEth>
    </>
  )
}

const connector = connect()

type Props = ConnectedProps<typeof connector>

export default connector(GetMoreEthComponent)
