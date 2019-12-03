import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { getData } from './selectors'
import { LargeTableRow, Wrapper } from 'components/Exchange'
import { path } from 'ramda'
import { SkeletonRectangle, Text } from 'blockchain-info-components'
import React from 'react'
import StringDisplay from 'components/Display/StringDisplay'
import styled from 'styled-components'

const RatesWrapper = styled(Wrapper)`
  padding: 0;
`
const RateText = styled(Text)`
  font-size: 12px;
`
const TotalBalanceWrapper = styled.div`
  text-align: left;
  > ${RateText} {
    margin-bottom: 2px;
  }
`
const RateWrapper = styled.div`
  text-align: right;
`
const Row = styled.div`
  display: flex;
`

export const RatesBox = ({
  balance,
  sourceToTargetRate,
  sourceCoinTicker,
  targetCoinTicker
}) => (
  <RatesWrapper>
    <LargeTableRow>
      <TotalBalanceWrapper>
        <RateText>
          <FormattedMessage
            id='scenes.exchange.exchangeform.summary.totalbalanceavailable'
            defaultMessage='{sourceCoinTicker} available for Swap'
            values={{ sourceCoinTicker }}
          />
        </RateText>
        <RateText>
          {balance.cata({
            Success: ({ balanceMax, balanceMaxFiat }) => {
              return (
                <Row>
                  <RateText color='success'>{balanceMaxFiat} </RateText>
                  <span>&nbsp;</span>
                  <RateText>
                    {path(['amount'], balanceMax)}{' '}
                    {path(['symbol'], balanceMax)}
                  </RateText>
                </Row>
              )
            },
            Failure: () => null,
            Loading: () => <SkeletonRectangle height='14px' width='60px' />,
            NotAsked: () => <SkeletonRectangle height='14px' width='60px' />
          })}
        </RateText>
      </TotalBalanceWrapper>
      <RateWrapper>
        <RateText color='brand-primary'>1 {sourceCoinTicker} =</RateText>
        <RateText>
          <StringDisplay>
            {sourceToTargetRate.map(rate => `${rate} ${targetCoinTicker}`)}
          </StringDisplay>
        </RateText>
      </RateWrapper>
    </LargeTableRow>
  </RatesWrapper>
)

export default connect(getData)(RatesBox)
