import React, { PureComponent } from 'react'

import throttle from '../throttle.js'

class DropdownLink extends PureComponent {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }

  componentDidMount() {
    if (window) {
      window.addEventListener('resize', this.resized)
    }
    this.resized()
  }

  componentWillUnmount() {
    if (window) {
      window.removeEventListener('resize', this.resized)
    }
  }

  resized = throttle(() => {
    let rect = this.ref.current.getBoundingClientRect()
    if (this.props.callback) {
      this.props.callback(rect)
    }
  }, 200)

  mouseOver = throttle(e => {
    this.resized()
    this.props.onMouseOver(e)
  }, 200)

  render() {
    const { onClick } = this.props
    return (
      <a ref={this.ref} onClick={onClick} onMouseOver={this.mouseOver}>
        {this.props.children}
      </a>
    )
  }
}

export default DropdownLink
