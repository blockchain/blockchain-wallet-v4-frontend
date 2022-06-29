import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { actions } from 'data'
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

const Dex = ({ dexActions }: Props) => {
  useEffect(() => {
    dexActions.fetchChains()
  }, [dexActions])

  const wasIntroViewed = !!localStorage.getItem(DEX_INTRO_VIEWED_KEY)
  return (
    <PageWrapper>
      <ContentWrapper>{wasIntroViewed ? <Swap /> : <Intro />}</ContentWrapper>
    </PageWrapper>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dexActions: bindActionCreators(actions.dex, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(Dex)
