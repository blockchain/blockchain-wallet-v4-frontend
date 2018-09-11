import React from 'react'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

import { actions, selectors } from 'data'
import Transactions from './Transactions'
import Settings from './Settings'

const Wrapper = styled.div`
  width: 100%;
`
const ContentWrapper = styled.div`
  padding: 0 15px;
`
class LockboxDashboardContainer extends React.PureComponent {
  render () {
    const { location } = this.props

    return this.props.data.cata({
      Success: device => {
        return (
          <Wrapper>
            <ContentWrapper>
              {location.pathname.includes('settings') && (
                <Settings device={device} />
              )}
              {location.pathname.includes('dashboard') && (
                <Transactions device={device} />
              )}
            </ContentWrapper>
          </Wrapper>
        )
      },
      Failure: () => null,
      Loading: () => null,
      NotAsked: () => null
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: selectors.core.kvStore.lockbox.getDevice(
    state,
    ownProps.match.params.deviceId
  )
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
