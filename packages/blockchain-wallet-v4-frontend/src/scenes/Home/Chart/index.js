import React from 'react'
import { connect } from 'react-redux'
import { selectors } from 'data'
import { api } from 'services/ApiService'

import Chart from './template.js'

class ChartContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { data: [] }
  }

  componentWillMount () {
    api.getPriceIndexSeries('btc', 'gbp', 12307680, 3600 * 24).then(
      data => this.setState({ data: data.map(o => [o.timestamp, o.price]) }),
      message => this.props.alertActions.displayError(message)
    )
  }

  render () {
    return (
      <Chart
        currency={this.props.currency}
        data={this.state.data} />
    )
  }
}

const mapStateToProps = (state) => ({
  currency: selectors.core.settings.getCurrency(state)
})

export default connect(mapStateToProps)(ChartContainer)
