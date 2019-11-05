import { actions, selectors } from 'data'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { propOr } from 'ramda'
import { SelectBoxCoinPriceChart } from 'components/Form'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  z-index: 2;
  margin-top: 16px;
`

class CoinSelectBox extends React.PureComponent {
  componentDidMount () {
    const { priceChart } = this.props
    this.props.initialize({ coin: propOr('BTC', 'coin', priceChart) })
  }

  onChange = (e, val) => {
    this.props.actions.coinClicked(val)
  }

  render () {
    return (
      <Wrapper>
        <Field
          name='coin'
          searchEnabled={false}
          onChange={this.onChange}
          component={SelectBoxCoinPriceChart}
        />
      </Wrapper>
    )
  }
}

const mapStateToProps = state => {
  return {
    priceChart: selectors.preferences.getPriceChart(state)
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.priceChart, dispatch)
})

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  reduxForm({ form: 'priceChartCoin' })
)

export default enhance(CoinSelectBox)
