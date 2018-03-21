import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions, selectors } from 'data'
import ui from 'redux-ui'
import { path } from 'ramda'
import Template from './template'

class ConfirmContainer extends Component {
  constructor (props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()
    this.props.coinifyDataActions.initiateBuy({ quote: this.props.userQuote, medium: this.props.medium })
  }

  render () {
    const { ui, userQuote, ...rest } = this.props
    return <Template
      {...rest}
      ui={ui}
      quote={userQuote}
      onSubmit={this.onSubmit}
    />
  }
}

const mapStateToProps = (state) => ({
  userQuote: path(['coinify', 'quote'], state),
  medium: path(['coinify', 'medium'], state)
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
