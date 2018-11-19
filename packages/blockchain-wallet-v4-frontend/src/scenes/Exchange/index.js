import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { path } from 'ramda'

import { actions, model } from 'data'
import { BlockchainLoader } from 'blockchain-info-components'
import { getData } from './selectors'
import media from 'services/ResponsiveService'
import GetStarted from './GetStarted'
import Exchange from './ExchangeContainer'
import DataError from 'components/DataError'

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

const { ENTERED } = model.analytics.EXCHANGE

class ExchangeScene extends React.PureComponent {
  componentDidMount () {
    this.props.logEnterExchange()
  }

  render () {
    const { verified, location } = this.props
    return verified.cata({
      Success: verified => (
        <Wrapper>
          {verified ? (
            <Container>
              <Column>
                <Exchange />
              </Column>
            </Container>
          ) : (
            <GetStarted
              from={path(['state', 'from'], location)}
              to={path(['state', 'to'], location)}
            />
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
      Failure: () => <DataError onClick={this.props.fetchUser} />
    })
  }
}

const mapDispatchToProps = dispatch => ({
  fetchUser: () => dispatch(actions.modules.profile.fetchUser()),
  logEnterExchange: () => dispatch(actions.analytics.logExchangeEvent(ENTERED))
})

export default connect(
  getData,
  mapDispatchToProps
)(ExchangeScene)
