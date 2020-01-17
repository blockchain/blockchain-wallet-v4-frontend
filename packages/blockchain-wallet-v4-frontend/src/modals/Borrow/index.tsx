import Flyout, { duration } from 'components/Flyout'
import modalEnhancer from 'providers/ModalEnhancer'
import React, { PureComponent } from 'react'

interface Props {
  close: () => void,
  position: number,
  userClickedOutside: boolean,
  total: number
}

class Borrow extends PureComponent<Props> {
  state = { show: false }

  componentDidMount () {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(this.props.close, duration)
  }

  render () {
    const { position, total } = this.props

    return (
      <Flyout position={position} in={this.state.show} userClickedOutside={this.props.userClickedOutside} onClose={this.handleClose} data-e2e='borrowModal' total={total}>
        Here
      </Flyout>
    )
  }
}

export default modalEnhancer('BORROW_MODAL', { transition: duration })(Borrow)
