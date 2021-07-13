import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import Refresh from './template'

class RefreshContainer extends React.PureComponent<Props> {
  state = {
    rotating: false
  }

  handleRotate = () => {
    this.setState({ rotating: true })
    setTimeout(() => {
      this.setState({ rotating: false })
    }, 0.5 * 1000)
  }

  render() {
    return (
      <Refresh
        handleRefresh={() => {
          if (!this.state.rotating) {
            this.handleRotate()
            this.props.actions.refreshClicked()
          }
        }}
        rotating={this.state.rotating}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.refresh, dispatch)
})

const connector = connect(undefined, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(RefreshContainer)
