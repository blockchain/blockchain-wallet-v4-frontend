import React from 'react'
import { FormattedMessage } from 'react-intl'
import AutoSizer from 'react-virtualized-auto-sizer'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  position: relative;
  text-align: center;
  & > * {
    margin: 0 auto;
  }
`

const ButtonStyled = styled(Button)`
  background: ${(p) => p.theme.white};
  border-color: ${(p) => p.theme.white};
  color: ${(props) => props.theme.exchangeLogin};
`

const EmptyState = () => (
  <AutoSizer>
    {({ height, width }) => (
      <Wrapper style={{ height, width }}>
        <div>
          <Text color='white' size='14px' weight={500}>
            Receive
          </Text>
        </div>
        <ButtonStyled style={{ marginTop: '2rem' }} data-e2e='coinview-empty-add-crypto-btn'>
          <FormattedMessage id='copy.add_crypto' defaultMessage='Add Crypto' />
        </ButtonStyled>
      </Wrapper>
    )}
  </AutoSizer>
)

export default EmptyState
