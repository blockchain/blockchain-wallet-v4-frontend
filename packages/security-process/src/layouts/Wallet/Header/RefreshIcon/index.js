import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Refresh from './template.js'

const ANIMATE_TIME = 0.5

class RefreshContainer extends React.PureComponent {
  state = {
    rotating: false
  }

  handleRotate = () => {
    this.setState({ rotating: true })
    setTimeout(() => {
      this.setState({ rotating: false })
    }, ANIMATE_TIME * 1000)
  }

  render () {
    return (
      <Refresh
        handleRefresh={() => {
          if (!this.state.rotating) {
            this.handleRotate()
            this.props.actions.refreshClicked()
          }
        }}
        rotating={this.state.rotating}
        animateTime={ANIMATE_TIME}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.refresh, dispatch)
})

export default connect(
  undefined,
  mapDispatchToProps
)(RefreshContainer)
