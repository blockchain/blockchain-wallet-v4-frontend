import React from 'react'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Field } from 'redux-form'
import { compose } from 'ramda'

import { actions } from 'data'
import { getData, shouldUpdate } from './selectors'
import SelectBox from './SelectBox'
import { Icon, TooltipHost } from 'blockchain-info-components'
import { Cell, Row } from '../Layout'

const CoinSwapIcon = styled(Icon)`
  font-size: 18px;
  margin: 0 15px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  color: ${props =>
    props.disabled ? props.theme['gray-1'] : props.theme['gray-6']};
  &:hover {
    color: ${props =>
      props.disabled ? props.theme['gray-1'] : props.theme['brand-secondary']};
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
    const { swapDisabled, fromElements, toElements, actions } = this.props
    return (
      <CurrencyRow height='50px' spaced>
        <Cell>
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
        <Cell>
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
