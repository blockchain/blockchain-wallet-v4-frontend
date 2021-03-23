import React from 'react'
import { FormattedHTMLMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { media } from 'services/styles'

import Table from './Table'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 24px 24px 0 24px;
  border: 1px solid ${props => props.theme.grey000};
  overflow-y: scroll;

  ${media.mobile`
    padding: 12px;
  `}
`

const BalancesTableContainer = props => (
  <Wrapper>
    <Text size='16px' weight={500} color='grey400' capitalize>
      <FormattedHTMLMessage id='copy.holdings' defaultMessage='Holdings' />
    </Text>
    <Table viewType='Total' {...props} />
  </Wrapper>
)

export default BalancesTableContainer
