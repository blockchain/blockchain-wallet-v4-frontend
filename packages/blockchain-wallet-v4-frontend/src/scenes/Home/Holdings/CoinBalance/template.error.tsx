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

export default (props: { coin: string; onRefresh: (e) => void }) => (
  <Wrapper>
    <ErrorLink size='14px' weight={500} onClick={(e) => props.onRefresh(e)}>
      <FormattedMessage
        id='home.balances.error.refresh'
        defaultMessage='Refresh {curr} Data'
        values={{ curr: props.coin }}
      />
    </ErrorLink>
  </Wrapper>
)
