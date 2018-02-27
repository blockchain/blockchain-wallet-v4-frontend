import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import ui from 'redux-ui'
import Upload from './template'
import { actions } from 'data'
import { getData } from './selectors'

class UploadContainer extends Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.onClickUpload = this.onClickUpload.bind(this)
    this.toggleCamera = this.toggleCamera.bind(this)
    this.setPhoto = this.setPhoto.bind(this)

    this.state = { file: null, camera: false, photo: '' }
  }

  handleSubmit (e) {
    e.preventDefault()
  }

  setPhoto (data) {
    console.log('setPhoto')
    this.setState({ photo: data })
  }

  onDrop (file) {
    this.setState({ file: file[0] })
    console.log('ondrop ', file, this.state)
  }

  onClickUpload (e) {
    e.preventDefault()
  }

  toggleCamera () {
    this.setState({ camera: true })
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
  sfoxDataActions: bindActionCreators(actions.core.data.sfox, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: {} })
)

export default enhance(UploadContainer)
