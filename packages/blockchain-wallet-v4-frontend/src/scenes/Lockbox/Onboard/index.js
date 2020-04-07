import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Announcements from 'components/Announcements'
import LockboxHeader from '../template.header'
import React from 'react'
import Setup from './template'
import styled from 'styled-components'

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`

class OnboardContainer extends React.PureComponent {
  launchLockboxSetup = () => {
    this.props.modalActions.showModal('LockboxSetup')
  }

  render () {
    return (
      <Wrapper>
        <LockboxHeader />
        <Announcements type='service' alertArea='lockbox' />
        <Setup launchLockboxSetup={this.launchLockboxSetup} />
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
)(OnboardContainer)
