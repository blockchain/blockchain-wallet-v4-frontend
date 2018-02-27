import React, { Component } from 'react'
import styled from 'styled-components'

const CamHelp = styled.span`
  left: 0px;
  bottom: 0px;
  width: 100%;
  color: white;
  height: 35px;
  position: absolute;
  background: rgba(0, 0, 0, 0.44);
`

const Camera = (props) => (
  <div>
    <video id='video' />
    {/* <CamHelp>Help text here!</CamHelp> */}
    <a id='startButton' onClick={props.handleStartClick}>Take photo</a>
  </div>
)

const Photo = (props) => (
  <div>
    <img id='photo' alt='Your photo' />
    {/* <a id='saveButton' onClick={props.handleSaveClick}>Save Photo</a> */}
  </div>
)

class CameraContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      constraints: { audio: false, video: { width: 400, height: 300 } }
    }

    this.handleStartClick = this.handleStartClick.bind(this)
    this.takePicture = this.takePicture.bind(this)
    this.clearPhoto = this.clearPhoto.bind(this)
  }

  componentDidMount () {
    const constraints = this.state.constraints
    const getUserMedia = (params) => (
      new Promise((resolve, errorCallback) => {
        navigator.webkitGetUserMedia.call(navigator, params, resolve, errorCallback)
      })
    )

    getUserMedia(constraints)
      .then((stream) => {
        const video = document.querySelector('video')
        const vendorURL = window.URL || window.webkitURL

        video.src = vendorURL.createObjectURL(stream)
        video.play()
      })
      .catch((err) => {
        console.log(err)
      })

    this.clearPhoto()
  }

  clearPhoto () {
    const canvas = document.querySelector('canvas')
    const photo = document.getElementById('photo')
    const context = canvas.getContext('2d')
    const { width, height } = this.state.constraints.video
    context.fillStyle = '#FFF'
    context.fillRect(0, 0, width, height)

    const data = canvas.toDataURL('image/png')
    photo.setAttribute('src', data)
  }

  handleStartClick (e) {
    e.preventDefault()
    this.takePicture()
  }

  takePicture () {
    const canvas = document.querySelector('canvas')
    const context = canvas.getContext('2d')
    const video = document.querySelector('video')
    const photo = document.getElementById('photo')
    const { width, height } = this.state.constraints.video

    canvas.width = width
    canvas.height = height
    context.drawImage(video, 0, 0, width, height)

    const data = canvas.toDataURL('image/png')
    console.log('takePicture', this.props)
    this.props.setPhoto(data)
    // photo.setAttribute('src', data)
  }

  render () {
    return (
      <div>
        <Camera
          handleStartClick={this.handleStartClick}
        />
        <canvas id="canvas" hidden />
        <Photo />
      </div>
    )
  }
}

export default CameraContainer
