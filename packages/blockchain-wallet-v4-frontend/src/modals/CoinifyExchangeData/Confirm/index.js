import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions, selectors } from 'data'
import ui from 'redux-ui'

class ConfirmContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <div>
        <h3>Confirm Step</h3>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  quote: selectors.core.data.coinify.getQuote(state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { editing: false } })
)

export default enhance(ConfirmContainer)
