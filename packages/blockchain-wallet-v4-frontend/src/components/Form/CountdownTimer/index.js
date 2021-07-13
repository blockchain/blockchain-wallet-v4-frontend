import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'

import CountdownTimer from './template'

class CountdownTimerContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.interval = undefined
    const { expiryDate } = props
    this.state = {
      remaining: moment.duration(moment(expiryDate).diff(moment()))
    }
    this.tick = this.tick.bind(this)
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  tick() {
    const { expiryDate, handleExpiry } = this.props
    const remaining = moment.duration(moment(expiryDate).diff(moment()))

    if (remaining.as('seconds') < 1) {
      // If we reach the end of the timer, we execute the expiry callback
      if (handleExpiry) {
        handleExpiry()
      }
    } else {
      this.setState({ remaining })
    }
  }

  render() {
    const timeLeft = moment
      .utc(this.state.remaining.as('milliseconds'))
      .format('mm:ss')

    return <CountdownTimer {...this.props} timeLeft={timeLeft} />
  }
}
CountdownTimerContainer.propTypes = {
  expiryDate: PropTypes.number,
  handleExpiry: PropTypes.func
}

CountdownTimerContainer.defaultProps = {
  expiryDate: moment().add(1, 'minutes')
}

export default CountdownTimerContainer
