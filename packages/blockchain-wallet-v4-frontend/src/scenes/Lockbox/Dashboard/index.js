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

    return (
      <Wrapper>
        <ContentWrapper>
          {location.pathname.includes('settings') && (
            <Settings deviceIndex={this.props.match.params.deviceIndex} />
          )}
          {location.pathname.includes('dashboard') && (
            <Transactions deviceIndex={this.props.match.params.deviceIndex} />
          )}
        </ContentWrapper>
      </Wrapper>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

const enhance = compose(
  withRouter,
  connect(
    null,
    mapDispatchToProps
  )
)

export default enhance(LockboxDashboardContainer)
