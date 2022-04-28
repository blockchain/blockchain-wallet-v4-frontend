import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'

import { GasCalculationOperations } from '@core/network/api/nfts/types'
import { Icon, SpinningLoader, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Title } from 'components/Flyout'
import { Value } from 'components/Flyout/model'
import { orderFromJSON } from 'data/components/nfts/utils'

import { CTARow } from '../../components'
import { Props as OwnProps } from '..'

const Wrapper = styled.div`
  border: 1px solid ${(props) => props.theme.grey000};
  border-radius: 8px;
  font-family: Inter, sans-serif;
  padding: 1em;
`

const Top = styled.div`
  display: flex;
  justify-content: space-between;
`
const ChevronArea = styled.div`
  display: flex;
`
const Fees: React.FC<Props> = (props) => {
  const [moreFees, setMoreFees] = useState(false)
  const toggleDropdown = () => {
    setMoreFees(!moreFees)
  }

  const { nftActions, orderFlow } = props
  const { orderToMatch } = orderFlow

  useEffect(() => {
    if (orderToMatch) {
      nftActions.fetchFees({
        operation: GasCalculationOperations.Buy,
        order: orderFromJSON(orderToMatch)
      })
    }
  }, [])

  if (!orderToMatch)
    return (
      <Text size='12px' weight={600}>
        No order found.
      </Text>
    )

  return (
    <>
      {orderFlow.fees.cata({
        Failure: () => null,
        Loading: () => (
          <CTARow>
            <SpinningLoader width='14px' height='14px' borderWidth='3px' />
          </CTARow>
        ),
        NotAsked: () => null,
        Success: (val) => {
          return (
            <>
              <Wrapper>
                <Top onClick={toggleDropdown}>
                  <Text weight={500} color='#353F52' lineHeight='24px' size='15px'>
                    Network Fees
                  </Text>
                  {!moreFees && (
                    <ChevronArea>
                      <Icon name='chevron-right' size='24px' color='grey400' />
                    </ChevronArea>
                  )}
                  {moreFees && (
                    <ChevronArea>
                      <Icon name='chevron-down' size='24px' color='grey400' />
                    </ChevronArea>
                  )}
                </Top>

                {moreFees && (
                  <>
                    <CTARow
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '1em 0em'
                      }}
                    >
                      <Title>
                        <FormattedMessage id='copy.fees' defaultMessage='Fees' />
                      </Title>
                      <Value>
                        <div style={{ display: 'block' }}>
                          <CoinDisplay size='14px' color='black' weight={600} coin='ETH'>
                            {new BigNumber(val.totalFees).multipliedBy(val.gasPrice).toString()}
                          </CoinDisplay>
                          <FiatDisplay size='12px' color='grey600' weight={600} coin='ETH'>
                            {new BigNumber(val.totalFees).multipliedBy(val.gasPrice).toString()}
                          </FiatDisplay>
                        </div>
                      </Value>
                    </CTARow>
                    <CTARow style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Title>
                        <Text color='black' weight={600} size='18px'>
                          Total
                        </Text>
                      </Title>
                      <Value>
                        <div style={{ display: 'block' }}>
                          <CoinDisplay
                            size='1'
                            color='black'
                            weight={600}
                            coin={orderToMatch.payment_token_contract?.symbol}
                          >
                            {new BigNumber(val.totalFees)
                              .multipliedBy(val.gasPrice)
                              .plus(orderToMatch.base_price)
                              .toString()}
                          </CoinDisplay>
                          <FiatDisplay
                            size='12px'
                            color='grey600'
                            weight={600}
                            coin={orderToMatch.payment_token_contract?.symbol}
                          >
                            {new BigNumber(val.totalFees)
                              .multipliedBy(val.gasPrice)
                              .plus(orderToMatch.base_price)
                              .toString()}
                          </FiatDisplay>
                        </div>
                      </Value>
                    </CTARow>
                  </>
                )}
              </Wrapper>
            </>
          )
        }
      })}
    </>
  )
}

type Props = OwnProps

export default Fees
