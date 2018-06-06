import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Link } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  box-sizing: border-box;
  justify-content: flex-end;
  padding-right: 25px;
`
const ErrorLink = styled(Link)`
  text-decoration: underline;
`

export default (props) => (
  <Wrapper>
    <ErrorLink size='12px' weight={300} onClick={() => props.onRefresh()}>
      <FormattedMessage id='wallet.menutop.balance.refresh' defaultMessage='Refresh {curr} data' values={{curr: 'Watch Only Bitcoin'}} />
    </ErrorLink>
  </Wrapper>
)
