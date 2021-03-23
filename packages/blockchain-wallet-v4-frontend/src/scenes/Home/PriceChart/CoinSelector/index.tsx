import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { SelectBoxCoinPriceChart } from 'components/Form'
import { actions, selectors } from 'data'
import { media } from 'services/styles'

const Wrapper = styled.div`
  padding-top: 16px;
  padding-left: 16px;
  width: fit-content;
  display: flex;
  justify-content: center;

  ${media.atLeastTabletL`
    justify-content: flex-start;
  `}
`

const CoinSelector = ({
  actions: { coinClicked },
  initialize,
  priceChart: { coin = 'BTC' }
}: InjectedFormProps<{}, Props> & Props) => {
  useEffect(() => {
    initialize({ coin })
  }, [coin])

  const onChange = (_, val) => {
    coinClicked(val)
  }

  return (
    <Wrapper>
      <Field
        name='coin'
        searchEnabled={false}
        onChange={onChange}
        component={SelectBoxCoinPriceChart}
      />
    </Wrapper>
  )
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

export default enhance(CoinSelector)
