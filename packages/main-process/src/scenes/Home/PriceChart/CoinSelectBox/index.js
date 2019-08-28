import React from 'react'
import styled from 'styled-components'
import { bindActionCreators, compose } from 'redux'
import { propOr } from 'ramda'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form'
import { actions, selectors } from 'data'
import { SelectBoxCoinPriceChart } from 'components/Form'

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
