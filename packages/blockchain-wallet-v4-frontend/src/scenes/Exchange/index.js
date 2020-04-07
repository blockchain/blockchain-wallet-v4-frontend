import { actions } from 'data'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { path } from 'ramda'
import { SceneWrapper } from 'components/Layout'
import DataError from 'components/DataError'
import EmailRequired from 'components/EmailRequired'
import Exchange from './ExchangeContainer'
import ExchangeHeader from './template.header'
import GetStarted from './GetStarted'
import Loading from './template.loading'
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

export const ExchangeScene = ({ data, location, fetchUser, showHelpModal }) => {
  return data.cata({
    Success: val => {
      if (!val.hasEmail) return <EmailRequired />
      return (
        <SceneWrapper>
          <ExchangeHeader showHelpModal={showHelpModal} />
          {val.userCreated ? (
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
      )
    },
    Loading: () => <Loading />,
    NotAsked: () => <Loading />,
    Failure: () => <DataError onClick={fetchUser} />
  })
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  fetchUser: () => dispatch(actions.modules.profile.fetchUser()),
  showHelpModal: () => dispatch(actions.modals.showModal('Support'))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExchangeScene)
