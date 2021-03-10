import React, { Component } from 'react'
import { connect } from 'react-redux'
import Base64 from 'base-64'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'

import UploadDocuments from './template'

class UploadDocumentsContainer extends Component {
  static propTypes = {
    data: PropTypes.object,
    displayError: PropTypes.func.isRequired,
    uploaded: PropTypes.object,
    uploadDocuments: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.dropzone = null
    const search = new URLSearchParams(props.location.search)

    this.state = {
      files: [],
      token: props.match.params.token,
      redirectUrl: search.get('redirect_url')
    }
  }

  componentDidMount() {
    this.props.fetchUploadData(this.state.token)
  }

  onSubmit = () => {
    let filesLoaded = []
    const { redirectUrl, token } = this.state
    this.state.files.forEach(file => {
      const fileReader = new FileReader()
      // One single upload for the array of all byte arrays
      fileReader.onload = event => {
        const fileArray = new Uint8Array(event.target.result).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
        filesLoaded.push(Base64.encode(fileArray))
        if (filesLoaded.length >= this.state.files.length) {
          this.props.uploadDocuments(token, filesLoaded, redirectUrl)
        }
      }
      fileReader.readAsArrayBuffer(file)
    })
  }

  deleteFileAt = index => {
    this.setState(previousState => {
      previousState.files.splice(index, 1)
      return {
        files: previousState.files
      }
    })
  }

  onDropAccepted = files => {
    const fileSizeLimit = 3 * 1024 * 1024
    files.forEach(file => {
      if (file.size >= fileSizeLimit) {
        this.props.displayError('File over size limit')
      } else if (this.state.files.length >= 3) {
        this.props.displayError('Maximum number of files reached')
      } else {
        this.setState(previousState => ({
          files: [...previousState.files, file]
        }))
      }
    })
  }

  openDropzone = () => {
    if (this.dropzone) this.dropzone.open()
  }

  setDropzoneRef = element => {
    this.dropzone = element
  }

  render() {
    const { loading } = this.props.uploaded.cata({
      Success: val => ({ loading: false }),
      Failure: val => ({ loading: false }),
      NotAsked: val => ({ loading: false }),
      Loading: () => ({ loading: true })
    })

    return (
      <UploadDocuments
        data={this.props.data}
        files={this.state.files}
        dropzoneRef={this.dropzoneRef}
        deleteFileAt={this.deleteFileAt}
        onDropAccepted={this.onDropAccepted}
        setDropzoneRef={this.setDropzoneRef}
        openDropzone={this.openDropzone}
        onSubmit={this.onSubmit}
        loading={loading}
      />
    )
  }
}

const mapStateToProps = state => ({
  data: selectors.components.uploadDocuments.getData(state),
  uploaded: selectors.components.uploadDocuments.getUploaded(state)
})

const mapDispatchToProps = dispatch => ({
  displayError: bindActionCreators(actions.alerts.displayError, dispatch),
  fetchUploadData: bindActionCreators(
    actions.components.uploadDocuments.fetchData,
    dispatch
  ),
  uploadDocuments: bindActionCreators(
    actions.components.uploadDocuments.upload,
    dispatch
  )
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadDocumentsContainer)
