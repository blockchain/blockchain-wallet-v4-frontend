import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

import { actions, selectors } from 'data'
import UploadDocument from './template'

class UploadDocumentContainer extends Component {
  static propTypes = {
    pathname: PropTypes.string.isRequired,
    uploadDocument: PropTypes.func.isRequired
  }

  onSubmit = () => {
    const token = this.props.pathname.split('/')[2]
    this.props.uploadDocument(token, this.props.file)
  }

  render () {
    const documentType = this.props.pathname.split('/')[3]
    return (
      <UploadDocument documentType={documentType} onSubmit={this.onSubmit} />
    )
  }
}

const mapStateToProps = state => ({
  pathname: selectors.router.getPathname(state),
  file: formValueSelector('uploadDocument')(state, 'document')
})

const mapDispatchToProps = dispatch => ({
  uploadDocument: bindActionCreators(
    actions.components.uploadDocument.upload,
    dispatch
  )
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadDocumentContainer)
