import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { actions, selectors } from 'data'

const StatusIcon = styled.div`
  margin-left: 100px;
  height: 16px;
  width: 16px;
  background-color: ${props => (props.color ? props.color : 'grey')};
  border-radius: 50%;
`

// TODO: refactor for device polling or delete this all
class LockboxStatus extends React.PureComponent {
  componentDidMount () {
    // this.props.lockboxActions.pollForConnectionStatus('DASHBOARD')
  }

  render () {
    return this.props.data.cata({
      Success: () => <StatusIcon color={'green'} />,
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
