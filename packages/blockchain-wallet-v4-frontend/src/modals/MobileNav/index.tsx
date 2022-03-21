import React from 'react'
import { compose } from 'redux'

import Flyout, { duration } from 'components/Flyout'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

class MobileNavContainer extends React.PureComponent<Props> {
  state = { show: false }

  componentDidMount() {
    this.setState({ show: true }) //eslint-disable-line
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  render() {
    const { show } = this.state
    const { ...rest } = this.props
    return (
      <Flyout {...rest} onClose={this.props.close} isOpen={show} data-e2e='tradeModal'>
        {/* <MobileNav handleClose={this.handleClose} /> */}
      </Flyout>
    )
  }
}

type OwnPropsType = {
  close: () => void
  position: number
  total: number
  userClickedOutside: boolean
}

type Props = OwnPropsType

const enhance = compose<any>(modalEnhancer(ModalName.MOBILE_NAV))

export default enhance(MobileNavContainer)
