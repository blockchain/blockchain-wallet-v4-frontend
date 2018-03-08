import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import CountdownTimer from './template'

class CountdownTimerContainer extends React.Component {
  constructor (props) {
    super(props)
    this.interval = undefined
    const now = moment()
    const expiryDate = this.props.expiryDate ? moment(this.props.expiryDate) : now.add('minute', 10)
    this.state = { expiration: expiryDate, elapsed: moment.duration(expiryDate.diff(moment())) }
    this.tick = this.tick.bind(this)
  }

  componentDidMount () {
    this.interval = setInterval(this.tick, 1000)
  }

  tick () {
    const { handleExpiry } = this.props
    const elapsed = moment.duration(this.state.expiration.diff(moment()))
    this.setState({ elapsed })
    // If we reach the end of the timer, we execute the expiry callback
    if (this.state.elapsed.minutes() <= 0) {
      clearInterval(this.interval)
      if (handleExpiry) { handleExpiry() }
    }
  }

  componentWillUnmount () {
    clearInterval(this.interval)
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
