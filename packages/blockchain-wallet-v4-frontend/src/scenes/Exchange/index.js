import { actions } from 'data'
import { BlockchainLoader } from 'blockchain-info-components'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { path } from 'ramda'
import { SceneWrapper } from 'components/Layout'
import DataError from 'components/DataError'
import EmailRequired from 'components/EmailRequired'
import Exchange from './ExchangeContainer'
import ExchangeHeader from './template.header'
import GetStarted from './GetStarted'
import media from 'services/ResponsiveService'
import Menu from './Menu'
import React from 'react'
import styled from 'styled-components'

const Container = styled.section`
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: start;
  width: 100%;
  box-sizing: border-box;
  @media (min-width: 992px) {
    flex-direction: row;
  }

  ${media.mobile`
    align-items: center;
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
  fetchUser,
  showHelpModal
}) => {
  if (!hasEmail) return <EmailRequired />

  return userCreated.cata({
    Success: userCreated => (
      <SceneWrapper>
        <ExchangeHeader showHelpModal={showHelpModal} />
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
      </SceneWrapper>
    ),
    Loading: () => (
      <SceneWrapper>
        <BlockchainLoader width='200px' height='200px' />
      </SceneWrapper>
    ),
    NotAsked: () => (
      <SceneWrapper>
        <BlockchainLoader width='200px' height='200px' />
      </SceneWrapper>
    ),
    Failure: () => <DataError onClick={fetchUser} />
  })
}

const mapDispatchToProps = dispatch => ({
  fetchUser: () => dispatch(actions.modules.profile.fetchUser()),
  showHelpModal: () => dispatch(actions.modals.showModal('Support'))
})

export default connect(
  getData,
  mapDispatchToProps
)(ExchangeScene)
