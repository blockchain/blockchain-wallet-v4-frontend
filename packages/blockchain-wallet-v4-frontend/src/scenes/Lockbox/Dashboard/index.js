import React from 'react'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

import { actions } from 'data'
import { getData } from './selectors'
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
    const onDashboard = location.pathname.includes('/lockbox/dashboard')

    return this.props.data.cata({
      Success: device => {
        return (
          <Wrapper>
            <ContentWrapper>
              {onDashboard ? (
                <Transactions device={device} />
              ) : (
                <Settings device={device} />
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
