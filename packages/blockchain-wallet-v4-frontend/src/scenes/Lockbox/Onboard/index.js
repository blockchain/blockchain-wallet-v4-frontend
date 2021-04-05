import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import Announcements from 'components/Announcements'
import { actions } from 'data'

import LockboxHeader from '../template.header'
import Setup from './template'

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`

class OnboardContainer extends React.PureComponent {
  launchLockboxSetup = () => {
    this.props.modalActions.showModal('LockboxSetup')
  }

  render() {
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

export default connect(null, mapDispatchToProps)(OnboardContainer)
