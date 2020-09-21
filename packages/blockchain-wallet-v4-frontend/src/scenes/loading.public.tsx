import { FormattedMessage } from 'react-intl'
import { SpinningLoader, Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

import Header from 'layouts/Public/Header'
import media from 'services/ResponsiveService'

interface Props {}

const Wrapper = styled.div`
  background-color: ${props => props.theme.grey900};
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

const PublicLoading: React.FC<Props> = () => {
  return (
    <Wrapper>
      <Header />
      <LoaderContainer>
        <SpinningLoader width='36px' height='36px' />
        <Text
          size='18px'
          weight={600}
          color='white'
          style={{ marginTop: '16px' }}
        >
          <FormattedMessage id='copy.loading' defaultMessage='Loading...' />
        </Text>
      </LoaderContainer>
    </Wrapper>
  )
}

export default PublicLoading
