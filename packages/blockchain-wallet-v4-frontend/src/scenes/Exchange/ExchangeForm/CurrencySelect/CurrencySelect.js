import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { Cell, Row } from '../Layout'
import { compose } from 'ramda'
import { connect } from 'react-redux'
import { Field } from 'redux-form'
import { getData, shouldUpdate } from './selectors'
import { Icon, TooltipHost } from 'blockchain-info-components'
import React from 'react'
import SelectBox from './SelectBox'
import styled from 'styled-components'

const CoinSwapIcon = styled(Icon)`
  font-size: 18px;
  margin: 0 15px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  color: ${props =>
    props.disabled ? props.theme.grey000 : props.theme['grey800']};
  &:hover {
    color: ${props =>
      props.disabled ? props.theme.grey000 : props.theme.blue600};
  }
`

const CurrencyRow = styled(Row)`
  padding-top: 8px;
`

const extractFieldValue = (e, value) => value

export class CurrencySelect extends React.Component {
  shouldComponentUpdate (nextProps) {
    return shouldUpdate(this.props, nextProps)
  }

  render () {
    const { actions, fromElements, swapDisabled, toElements } = this.props
    return (
      <CurrencyRow height='32px' spaced>
        <Cell data-e2e='exchangeSourceCurrency'>
          <Field
            name='source'
            onChange={compose(
              actions.changeSource,
              extractFieldValue
            )}
            component={SelectBox}
            elements={fromElements}
          />
        </Cell>
        <TooltipHost id='exchange.changeinput'>
          <Cell size='small'>
            <CoinSwapIcon
              data-e2e='exchangeSwitchTargets'
              name='arrow-switch'
              size='24px'
              weight={500}
              cursor
              disabled={swapDisabled}
              onClick={() => {
                if (!swapDisabled) actions.swapBaseAndCounter()
              }}
            />
          </Cell>
        </TooltipHost>
        <Cell data-e2e='exchangeTargetCurrency'>
          <Field
            name='target'
            onChange={compose(
              actions.changeTarget,
              extractFieldValue
            )}
            component={SelectBox}
            elements={toElements}
          />
        </Cell>
      </CurrencyRow>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchange, dispatch)
})

export default connect(
  getData,
  mapDispatchToProps
)(CurrencySelect)
