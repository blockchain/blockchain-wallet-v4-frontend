import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { propOr } from 'ramda'
import { bindActionCreators, compose } from 'redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { SelectBoxCoinPriceChart } from 'components/Form'
import { actions, selectors } from 'data'

const Wrapper = styled.div`
  z-index: 3;
  margin-top: 16px;
`

class CoinSelectBox extends React.PureComponent<
  InjectedFormProps<{}, Props> & Props
> {
  componentDidMount() {
    const { priceChart } = this.props
    this.props.initialize({ coin: propOr('BTC', 'coin', priceChart) })
  }

  onChange = (e, val) => {
    this.props.actions.coinClicked(val)
  }

  render() {
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

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose<any>(reduxForm({ form: 'priceChartCoin' }), connector)

type Props = ConnectedProps<typeof connector>

export default enhance(CoinSelectBox)
