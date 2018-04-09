import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactHighcharts from 'react-highcharts'
import { equals } from 'ramda'
import { getConfig } from './services'

const Wrapper = styled.div`
  width: 100%;
`

class Chart extends React.Component {
  constructor (props) {
    super(props)
    const { start, interval, currency, data } = props
    this.state = { config: getConfig(start, interval, currency, data) }
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(this.props.data, nextProps.data) && !equals(this.props.currency, nextProps.currency)) {
      this.setState({ config: getConfig(nextProps.start, nextProps.interval, nextProps.currency, nextProps.data) })
    }
  }

  render () {
    return (
      <Wrapper>
        <ReactHighcharts config={this.state.config} isPureConfig />
      </Wrapper>
    )
  }
}

Chart.propTypes = {
  currency: PropTypes.string.isRequired,
  coin: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired
}

export default Chart
