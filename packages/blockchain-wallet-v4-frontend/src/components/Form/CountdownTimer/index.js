import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import CountdownTimer from './template'

class CountdownTimerContainer extends React.Component {
  constructor (props) {
    super(props)
    this.interval = undefined
    const { expiryDate } = this.props
    this.state = { expiration: moment(expiryDate), elapsed: moment.duration(moment(expiryDate).diff(moment())) }
    this.tick = this.tick.bind(this)
  }

  componentDidMount () {
    this.interval = setInterval(this.tick, 1000)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  tick () {
    const { handleExpiry } = this.props
    const elapsed = moment.duration(moment(this.state.expiration).diff(moment()))
    this.setState({ elapsed })
    // If we reach the end of the timer, we execute the expiry callback
    if (this.state.elapsed.as('milliseconds') <= 0) {
      clearInterval(this.interval)
      if (handleExpiry) { handleExpiry() }
    }
  }

  render () {
    const timeLeft = moment.utc(this.state.elapsed.as('milliseconds')).format('mm:ss')

    return <CountdownTimer timeLeft={timeLeft} />
  }
}
CountdownTimerContainer.propTypes = {
  expiryDate: PropTypes.number,
  handleExpiry: PropTypes.func
}

CountdownTimerContainer.defaultProps = {
  expiryDate: moment().add('minutes', 10)
}

export default CountdownTimerContainer
