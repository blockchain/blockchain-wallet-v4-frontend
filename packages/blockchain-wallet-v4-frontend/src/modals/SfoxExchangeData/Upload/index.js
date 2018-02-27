import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import ui from 'redux-ui'
import Verify from './template'
import { actions } from 'data'

class UploadContainer extends Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.onClickUpload = this.onClickUpload.bind(this)

    this.state = { file: null }
  }

  handleSubmit (e) {
    e.preventDefault()
    // this.props.sfoxDataActions.setProfile(this.props.user)
  }

  onDrop (file) {
    this.setState({ file: file[0] })
    console.log('ondrop ', file, this.state)
  }

  onClickUpload (e) {
    e.preventDefault()
    console.log('onclick')
  }

  render () {
    return <Verify
      handleSubmit={this.handleSubmit}
      onDrop={this.onDrop}
      onClickUpload={this.onClickUpload}
      file={this.state.file}
    />
  }
}

const mapStateToProps = (state) => ({
  initial: {
    hello: 'world'
  }
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  sfoxDataActions: bindActionCreators(actions.core.data.sfox, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: {} })
)

export default enhance(UploadContainer)
