import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Link } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  box-sizing: border-box;
`
const ErrorLink = styled(Link)`
  text-decoration: underline;
`

export default (props) => (
  <Wrapper>
    <ErrorLink size='12px' weight={400} onClick={() => props.onRefresh()}>
      <FormattedMessage
        id='wallet.menutop.balance.error.refresh'
        defaultMessage='Refresh {curr} data'
        values={{ curr: props.coinTicker ? props.coinTicker : props.coin }}
      />
    </ErrorLink>
  </Wrapper>
)
