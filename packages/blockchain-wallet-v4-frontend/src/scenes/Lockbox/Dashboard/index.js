import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { actions } from 'data'
import Content from './Content'
import Header from './Header'

const Wrapper = styled.div`
  width: 100%;
`
class LockboxDashboardContainer extends React.PureComponent {
  render () {
    const { devices, balances } = this.props

    return (
      <Wrapper>
        <Header deviceName={'Andrews Lockbox'} />
        <Content devices={devices} />
      </Wrapper>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(LockboxDashboardContainer)
