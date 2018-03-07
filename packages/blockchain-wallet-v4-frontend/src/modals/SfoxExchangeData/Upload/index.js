import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import Upload from './template'
import { actions } from 'data'
import { getData } from './selectors'
import ui from 'redux-ui'

class UploadContainer extends Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.onClickUpload = this.onClickUpload.bind(this)
    this.toggleCamera = this.toggleCamera.bind(this)
    this.setPhoto = this.setPhoto.bind(this)
    this.submitForUpload = this.submitForUpload.bind(this)
    this.resetUpload = this.resetUpload.bind(this)
    this.handleStartClick = this.handleStartClick.bind(this)

    this.state = { file: null,
      camera: false,
      photo: '',
      requiredDocs: '',
      uploadStepNumber: ''
    }
  }

  componentWillMount () {
    const requiredDocs = this.props.data.data.verificationStatus.required_docs.length
    this.setState({ requiredDocs })
    this.setState({ uploadStepNumber: 1 })
  }

  componentWillReceiveProps (nextProps) {
    const nextVerificiationStatus = nextProps.data.data.verificationStatus
    if (nextVerificiationStatus.required_docs.length < this.state.requiredDocs) {
      this.setState({ uploadStepNumber: 2 })
    }
  }

  handleSubmit (e) {
    e.preventDefault()
  }

  setPhoto (data) {
    this.setState({ photo: data })
  }

  onDrop (file) {
    this.setState({ file: file[0] })
  }

  onClickUpload (e) {
    e.preventDefault()
  }

  toggleCamera () {
    this.setState({ camera: true })
  }

  resetUpload () {
    this.setState({ file: null, camera: false, photo: '' })
  }

  handleStartClick (e) {
    e.preventDefault()
    this.takePicture()
  }

  submitForUpload () {
    const file = this.state.file || this.state.photo
    const idType = this.props.data.data.verificationStatus.required_docs[0]
    this.props.sfoxFrontendActions.upload({file, idType})
    this.resetUpload() // TODO replace with setting to busy and show loader
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: (value) => <Upload
        data={value}
        handleSubmit={this.handleSubmit}
        onDrop={this.onDrop}
        onClickUpload={this.onClickUpload}
        toggleCamera={this.toggleCamera}
        file={this.state.file}
        showCamera={this.state.camera}
        photo={this.state.photo}
        setPhoto={this.setPhoto}
        resetUpload={this.resetUpload}
        submitForUpload={this.submitForUpload}
        handleStartClick={this.handleStartClick}
        requiredDocs={this.state.requiredDocs}
        uploadStepNumber={this.state.uploadStepNumber}
      />,
      Failure: (msg) => <div>{msg.error}</div>,
      Loading: () => <div>Loading...</div>,
      NotAsked: () => <div />
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  sfoxFrontendActions: bindActionCreators(actions.modules.sfox, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { busy: false } })
)

export default enhance(UploadContainer)
