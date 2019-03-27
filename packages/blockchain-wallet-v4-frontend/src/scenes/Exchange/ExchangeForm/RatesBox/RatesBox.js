import React from 'react'
import styled from 'styled-components'
import { path } from 'ramda'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { getData } from './selectors'
import { SkeletonRectangle, Text } from 'blockchain-info-components'
import StringDisplay from 'components/Display/StringDisplay'
import { LargeTableRow, Wrapper } from 'components/Exchange'

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
  sourceCoin,
  targetCoin,
  sourceToTargetRate
}) => (
  <RatesWrapper>
    <LargeTableRow>
      <TotalBalanceWrapper>
        <RateText>
          <FormattedMessage
            id='scenes.exchange.exchangeform.summary.totalbalance'
            defaultMessage='Your {sourceCoin} Balance'
            values={{ sourceCoin }}
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
        <RateText color='brand-primary'>1 ${sourceCoin} =</RateText>
        <RateText>
          <StringDisplay>
            {sourceToTargetRate.map(rate => `${rate} ${targetCoin}`)}
          </StringDisplay>
        </RateText>
      </RateWrapper>
    </LargeTableRow>
  </RatesWrapper>
)

export default connect(getData)(RatesBox)
