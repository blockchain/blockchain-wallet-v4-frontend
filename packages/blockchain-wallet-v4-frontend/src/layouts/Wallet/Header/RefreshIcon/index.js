import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Refresh from './template.js'

const ANIMATE_TIME = 0.5

class RefreshContainer extends React.PureComponent {
  state = {
    rotate: false
  }

  handleRotate = () => {
    this.setState({ rotate: true })
    setTimeout(() => {
      this.setState({ rotate: false })
    }, ANIMATE_TIME * 1000)
  }

  render () {
    return <Refresh
      handleRefresh={() => {
        this.handleRotate()
        this.props.actions.refreshClicked()
      }}
      rotate={this.state.rotate}
      animateTime={ANIMATE_TIME}
    />
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.refresh, dispatch)
})

export default connect(
  undefined,
  mapDispatchToProps
)(RefreshContainer)
