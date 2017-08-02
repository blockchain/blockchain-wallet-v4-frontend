import React from 'react'
import { connect } from 'react-redux'
import { selectors } from 'data'

class Modals extends React.Component {
  render () {
    let { modals, children } = this.props
    return modals.length ? <div>{children}</div> : null
  }
}

const mapStateToProps = (state, ownProps) => ({
  modals: selectors.modals.getModals(state)
})

export default connect(mapStateToProps)(Modals)
