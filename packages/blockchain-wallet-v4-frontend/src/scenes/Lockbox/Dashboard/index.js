import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { actions } from 'data'
import { getData } from './selectors'
import Content from './Content'
import Header from './Header'

const Wrapper = styled.div`
  width: 100%;
`
class LockboxDashboardContainer extends React.PureComponent {
  render () {
    const { device } = this.props

    return (
      <Wrapper>
        <Header deviceName={device.name} />
        <Content device={device} />
      </Wrapper>
    )
  }
}
const mapStateToProps = state => ({
  device: getData(state)
})
const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LockboxDashboardContainer)
