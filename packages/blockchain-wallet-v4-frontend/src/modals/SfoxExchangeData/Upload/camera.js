import React from 'react'
import styled from 'styled-components'
import Webcam from 'react-webcam'
import PropTypes from 'prop-types'

import { IconButton } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'

const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`
const SubmitContainer = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

class CameraContainer extends React.Component {
  constructor (props) {
    super(props)
    this.setRef = this.setRef.bind(this)
    this.capture = this.capture.bind(this)
  }

  setRef (webcam) {
    this.webcam = webcam
  }

  capture () {
    const imageSrc = this.webcam.getScreenshot()
    this.props.setPhoto(imageSrc)
  };

  render () {
    return (
      <VideoContainer>
        <Webcam ref={this.setRef} height={this.props.height} width={this.props.width} />
        <SubmitContainer>
          <IconButton name='camera' fullwidth nature='primary' onClick={this.capture}>
            <FormattedMessage id='sfoxexchangedata.upload.capture' defaultMessage='Capture' />
          </IconButton>
        </SubmitContainer>
      </VideoContainer>
    )
  }
}

CameraContainer.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
}

export default CameraContainer
