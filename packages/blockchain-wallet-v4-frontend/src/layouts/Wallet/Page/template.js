import React from 'react'
import styled from 'styled-components'

import { BlockchainLoader } from 'blockchain-info-components'

const PageContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  height: calc(100% - 115px);
  width: 100%;
  overflow-y: auto;
`
const SplashScreen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme['white']};
`

const Page = (props) => {
  const { handleScroll, isFetching, children } = props

  return (
    <PageContainer onScroll={handleScroll}>
      { isFetching &&
        <SplashScreen>
          <BlockchainLoader width='300px' height='300px' />
        </SplashScreen>
      }
      {children}
    </PageContainer>
  )
}

export default Page
