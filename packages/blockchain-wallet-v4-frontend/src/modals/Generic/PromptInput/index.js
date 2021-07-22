import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import PromptTemplate from './template.js'

class PromptContainer extends React.PureComponent {
  onSubmit = () => {
    this.props.actions.submitPromptInput(this.props.value)
  }

  render() {
    return (
      <PromptTemplate
        {...this.props}
        maxLength={this.props.maxLength}
        initialValues={{ value: this.props.initial }}
        onSubmit={this.onSubmit}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  value: formValueSelector('promptInputModal')(state, 'value')
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.wallet, dispatch)
})

const enhance = compose(
  modalEnhancer('PROMPT_INPUT_MODAL'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(PromptContainer)
