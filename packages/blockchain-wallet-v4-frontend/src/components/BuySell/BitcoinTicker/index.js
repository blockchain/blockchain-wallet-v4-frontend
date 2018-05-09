import React, { Fragment } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Text, Icon } from 'blockchain-info-components'

import { MethodContainer } from 'components/BuySell/styled.js'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`

const BitcoinTicker = (props) => {
  const { rateQuoteR, symbol } = props
  return (
    <MethodContainer>
      <Icon name='bitcoin-in-circle-filled' color='bitcoin-orange' size='30px' />
      <Wrapper>
        <Text size='14px' weight={300} uppercase>Bitcoin</Text>
        <Text size='12px' weight={300}>
          {'@ '}
          {rateQuoteR
            .map((quote) => `${symbol}${quote && quote.quoteAmount.toLocaleString()}`)
            .getOrElse(
              <Fragment>
                <FormattedMessage id='loading' defaultMessage='Loading' />
                {'...'}
              </Fragment>
            )}
        </Text>
      </Wrapper>
    </MethodContainer>
  )
}

export default BitcoinTicker
