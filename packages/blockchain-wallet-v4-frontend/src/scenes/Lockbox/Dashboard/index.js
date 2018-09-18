import React from 'react'
import { compose } from 'redux'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

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
    const deviceIndex = this.props.match.params.deviceIndex

    return (
      <Wrapper>
        <ContentWrapper>
          {onDashboard ? (
            <Transactions deviceIndex={deviceIndex} />
          ) : (
            <Settings deviceIndex={deviceIndex} />
          )}
        </ContentWrapper>
      </Wrapper>
    )
  }
}

export default compose(withRouter)(LockboxDashboardContainer)
