import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { path } from 'ramda'

import { actions, model } from 'data'
import { BlockchainLoader } from 'blockchain-info-components'
import { getData } from './selectors'
import Exchange from './ExchangeContainer'
import DataError from 'components/DataError'
import EmailRequired from 'components/EmailRequired'

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 600px;
`

const { ENTERED } = model.analytics.EXCHANGE

export class ExchangeScene extends React.PureComponent {
  componentDidMount () {
    this.props.logEnterExchange()
  }

  render () {
    const { userCreated, hasEmail, location } = this.props
    if (!hasEmail) return <EmailRequired />

    return userCreated.cata({
      Success: userCreated => (
        <Wrapper>
          <Exchange
            from={path(['state', 'from'], location)}
            to={path(['state', 'to'], location)}
            isDemo={!userCreated}
          />
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
  logEnterExchange: () => dispatch(actions.analytics.logEvent(ENTERED))
})

export default connect(
  getData,
  mapDispatchToProps
)(ExchangeScene)
