import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { actions, selectors } from 'data'

const StatusIcon = styled.div`
  margin-right: 5px;
  height: 15px;
  width: 15px;
  background-color: ${props => (props.color ? props.color : 'grey')};
  border-radius: 50%;
`

class LockboxStatus extends React.PureComponent {
  componentDidMount () {
    this.props.lockboxActions.pollForConnectionStatus('DASHBOARD')
  }

  render () {
    return this.props.data.cata({
      Success: value => (
        <StatusIcon color={'green'}>{JSON.stringify(value.status)}</StatusIcon>
      ),
      Failure: () => <StatusIcon />,
      Loading: () => <StatusIcon />,
      NotAsked: () => <StatusIcon />
    })
  }
}

const mapStateToProps = state => ({
  data: selectors.components.lockbox.getConnectionStatus(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LockboxStatus)
