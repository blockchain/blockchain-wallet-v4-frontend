import React from 'react'
import styled from 'styled-components'

import { media } from 'services/styles'

import { DEX_INTRO_VIEWED_KEY } from './Dex.model'
import Intro from './Intro'
import Swap from './Swap'

const PageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`
const ContentWrapper = styled.div`
  box-sizing: border-box;
  width: 550px;
  margin-top: 72px;
  background-color: ${(props) => props.theme.white};
  padding: 24px;
  border-radius: 24px;
  border: 1px solid ${(props) => props.theme.grey100};

  ${media.tablet`
    width: 100%;
  `}
  ${media.mobile`
    padding: 20px;
  `}
`

const Dex = () => {
  const wasIntroViewed = !!localStorage.getItem(DEX_INTRO_VIEWED_KEY)
  return (
    <PageWrapper>
      <ContentWrapper>{wasIntroViewed ? <Swap /> : <Intro />}</ContentWrapper>
    </PageWrapper>
  )
}

export default Dex
