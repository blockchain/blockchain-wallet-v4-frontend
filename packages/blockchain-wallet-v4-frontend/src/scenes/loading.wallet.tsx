import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { SpinningLoader, Text } from 'blockchain-info-components'
import Header from 'layouts/Wallet/MenuTop'
import { media } from 'services/styles'

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.white};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;

  ${media.tablet`
    display: block;
    height: auto;
    min-height: 100%;
    width: 100%;
    overflow: auto;
  `}
`

const LoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  margin-top: -90px;
`

const WalletLoading = () => {
  return (
    <Wrapper>
      <Header />
      <LoaderContainer>
        <SpinningLoader width='36px' height='36px' />
        <Text size='18px' weight={600} color='grey900' style={{ marginTop: '16px' }}>
          <FormattedMessage id='copy.loading' defaultMessage='Loading...' />
        </Text>
      </LoaderContainer>
    </Wrapper>
  )
}

export default WalletLoading
