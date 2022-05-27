import React from 'react'
import { addMinutes, differenceInDays, differenceInSeconds, format, getTime } from 'date-fns'
import PropTypes from 'prop-types'

import CountdownTimer from './template'

class CountdownTimerContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.interval = undefined
    const { expiryDate } = props
    this.state = {
      remaining: differenceInDays(new Date(expiryDate), new Date())
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
    const secondsRemaining = differenceInSeconds(new Date(expiryDate), new Date())
    const daysRemaining = differenceInDays(new Date(expiryDate), new Date())

    if (secondsRemaining < 1) {
      // If we reach the end of the timer, we execute the expiry callback
      if (handleExpiry) {
        handleExpiry()
      }
    } else {
      this.setState({ remaining: daysRemaining })
    }
  }

  render() {
    const timeLeft = format(getTime(new Date(this.state.remaining)), 'mm:ss')

    return <CountdownTimer {...this.props} timeLeft={timeLeft} />
  }
}
CountdownTimerContainer.propTypes = {
  expiryDate: PropTypes.number,
  handleExpiry: PropTypes.func
}

CountdownTimerContainer.defaultProps = {
  expiryDate: addMinutes(new Date(), 1)
}

export default CountdownTimerContainer
