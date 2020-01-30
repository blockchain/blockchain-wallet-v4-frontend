import { actions } from 'data'
import { BlockchainLoader } from 'blockchain-info-components'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { path } from 'ramda'
import DataError from 'components/DataError'
import EmailRequired from 'components/EmailRequired'
import Exchange from './ExchangeContainer'
import GetStarted from './GetStarted'
import media from 'services/ResponsiveService'
import Menu from './Menu'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 600px;
`

const Container = styled.section`
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: start;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
  @media (min-width: 992px) {
    flex-direction: row;
  }

  ${media.mobile`
    align-items: center;
    padding: 10px;
  `};
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`

export const ExchangeScene = ({
  userCreated,
  hasEmail,
  location,
  fetchUser
}) => {
  if (!hasEmail) return <EmailRequired />

  return userCreated.cata({
    Success: userCreated => (
      <Wrapper>
        {userCreated ? (
          <>
            <Menu />
            <Container>
              <Column>
                <Exchange
                  from={path(['state', 'from'], location)}
                  to={path(['state', 'to'], location)}
                  fix={path(['state', 'fix'], location)}
                  amount={path(['state', 'amount'], location)}
                />
              </Column>
            </Container>
          </>
        ) : (
          <GetStarted />
        )}
      </Wrapper>
    ),
    Loading: () => (
      <Wrapper>
        <BlockchainLoader width='200px' height='200px' />
      </Wrapper>
    ),
    NotAsked: () => (
      <Wrapper>
        <BlockchainLoader width='200px' height='200px' />
      </Wrapper>
    ),
    Failure: () => <DataError onClick={fetchUser} />
  })
}

const mapDispatchToProps = dispatch => ({
  fetchUser: () => dispatch(actions.modules.profile.fetchUser())
})

export default connect(
  getData,
  mapDispatchToProps
)(ExchangeScene)
