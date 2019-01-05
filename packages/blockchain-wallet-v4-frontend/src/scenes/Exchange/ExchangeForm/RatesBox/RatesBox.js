import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'

import { getData } from './selectors'
import StringDisplay from 'components/Display/StringDisplay'
import { ExchangeText } from 'components/Exchange'

const RatesWrapper = styled.div`
  padding-top: 17px;
  padding-bottom: 4px;
  background-color: ${props => props.theme['white-blue']};
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`
const RatesRow = styled(ExchangeText)`
  text-align: center;
  margin-bottom: 16px;
`
const RatesTitle = styled(RatesRow)`
  font-weight: 400;
  margin-bottom: 12px;
`

export const RatesBox = ({
  sourceCoin,
  targetCoin,
  currency,
  sourceToTargetRate,
  sourceToFiatRate,
  targetToFiatRate
}) => (
  <RatesWrapper>
    <RatesTitle>
      <FormattedMessage
        id='scenes.exchange.exchangeform.summary.rates'
        defaultMessage='Rates'
      />
    </RatesTitle>
    <RatesRow>
      <StringDisplay>
        {sourceToTargetRate.map(
          rate => `1 ${sourceCoin} = ${rate} ${targetCoin}`
        )}
      </StringDisplay>
    </RatesRow>
    <RatesRow>
      <StringDisplay>
        {sourceToFiatRate.map(rate => `1 ${sourceCoin} = ${rate} ${currency}`)}
      </StringDisplay>
    </RatesRow>
    <RatesRow>
      <StringDisplay>
        {targetToFiatRate.map(rate => `1 ${targetCoin} = ${rate} ${currency}`)}
      </StringDisplay>
    </RatesRow>
  </RatesWrapper>
)

export default connect(getData)(RatesBox)
