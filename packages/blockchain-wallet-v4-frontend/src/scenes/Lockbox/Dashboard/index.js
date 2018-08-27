import React from 'react'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

import { actions } from 'data'
import { getData } from './selectors'
import Transactions from './Transactions'
import Settings from './Settings'
import Header from './Header'

const Wrapper = styled.div`
  width: 100%;
`
class LockboxDashboardContainer extends React.PureComponent {
  render () {
    const { location } = this.props

    return this.props.data.cata({
      Success: device => {
        return (
          <Wrapper>
            <Header deviceName={device.name} />
            {location.pathname === '/lockbox/settings' && <Settings />}
            {location.pathname === '/lockbox/transactions' && <Transactions />}
          </Wrapper>
        )
      },
      Failure: () => null,
      Loading: () => null,
      NotAsked: () => null
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})
const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

const enhance = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(LockboxDashboardContainer)
