import React from 'react'
import CaptchaBox from './template.js'

class CaptchaBoxContainer extends React.Component {
  constructor () {
    super()
  }

  componentWillMount () {
    console.log('mounted')
  }

  render () {
    return <CaptchaBox {...this.props} />
  }
}

export default CaptchaBoxContainer
