import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, selectors } from 'data'
import UploadDocument from './template'

class UploadDocumentContainer extends Component {
  static propTypes = {
    displayError: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    uploadDocument: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      files: []
    }
  }

  onSubmit = () => {
    const token = this.props.pathname.split('/')[2]
    this.state.files.forEach(file => {
      const fileReader = new FileReader()
      // TODO: One single upload for the array of all byte arrays
      fileReader.onload = event => {
        const fileArray = new Int8Array(event.target.result)
        this.props.uploadDocument(token, fileArray)
      }
      fileReader.readAsArrayBuffer(file)
    })
  }

  onDropAccepted = files => {
    const fileSizeLimit = 5000000
    files.forEach(file => {
      if (file.size >= fileSizeLimit) {
        this.props.displayError('File over size limit')
      } else {
        this.setState(previousState => ({
          files: [...previousState.files, file]
        }))
      }
    })
  }

  render () {
    const documentType = this.props.pathname.split('/')[3]
    return (
      <UploadDocument
        documentType={documentType}
        files={this.state.files}
        onDropAccepted={this.onDropAccepted}
        onSubmit={this.onSubmit}
      />
    )
  }
}

const mapStateToProps = state => ({
  pathname: selectors.router.getPathname(state)
})

const mapDispatchToProps = dispatch => ({
  displayError: bindActionCreators(actions.alerts.displayError, dispatch),
  uploadDocument: bindActionCreators(
    actions.components.uploadDocument.upload,
    dispatch
  )
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadDocumentContainer)
