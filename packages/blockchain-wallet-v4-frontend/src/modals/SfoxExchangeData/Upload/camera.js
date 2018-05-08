import React, { Component } from 'react'
import styled from 'styled-components'

// const CamHelp = styled.span`
//   left: 0px;
//   bottom: 0px;
//   width: 100%;
//   color: white;
//   height: 35px;
//   position: absolute;
//   background: rgba(0, 0, 0, 0.44);
// `
const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Camera = (props) => (
  <VideoContainer>
    <video id='video' />
    {/* <CamHelp>Help text here</CamHelp> */}
  </VideoContainer>
)

class CameraContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      constraints: { audio: false, video: { width: 400, height: 200 } },
      stream: false
    }

    this.handleStartClick = this.handleStartClick.bind(this)
    this.takePicture = this.takePicture.bind(this)
    this.clearPhoto = this.clearPhoto.bind(this)
  }

  componentDidMount () {
    const constraints = this.state.constraints
    const getUserMedia = (params) => (
      new Promise((resolve, reject) => {
        navigator.webkitGetUserMedia(params, resolve, reject)
      })
    )

    getUserMedia(constraints)
      .then((stream) => {
        this.setState({ stream })
        const video = document.querySelector('video')
        const vendorURL = window.URL || window.webkitURL

        video.src = vendorURL.createObjectURL(this.state.stream)
        video.play()
      })
  }

  componentWillUnmount () {
    if (this.state.stream.stop) this.state.stream.stop()
    else {
      this.state.stream.getVideoTracks().map(track => track.stop())
    }
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

  handleStartClick () {
    this.takePicture()
  }

  takePicture () {
    const canvas = document.querySelector('canvas')
    const context = canvas.getContext('2d')
    const video = document.querySelector('video')
    const { width, height } = this.state.constraints.video

    canvas.width = width
    canvas.height = height
    context.drawImage(video, 0, 0, width, height)

    const data = canvas.toDataURL('image/png')
    this.props.setPhoto(data)
  }

  render () {
    return (
      <span>
        <Camera handleStartClick={this.handleStartClick} />
        <canvas id='canvas' hidden />
      </span>
    )
  }
}

export default CameraContainer
