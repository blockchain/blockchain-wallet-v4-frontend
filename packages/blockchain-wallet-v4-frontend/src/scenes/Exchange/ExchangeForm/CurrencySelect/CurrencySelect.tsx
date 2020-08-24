import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React from 'react'
import styled from 'styled-components'

import { actions } from 'data'
import { Cell, Row } from '../Layout'
import { compose } from 'ramda'
import { Field } from 'redux-form'
import { getData, shouldUpdate } from './selectors'
import { Icon, TooltipHost } from 'blockchain-info-components'
import SelectBox from './SelectBox'

import media from 'services/ResponsiveService'

const CoinSwapIcon = styled(Icon)<{ disabled?: boolean }>`
  font-size: 18px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  color: ${props =>
    props.disabled ? props.theme.grey000 : props.theme['grey800']};
  &:hover {
    color: ${props =>
      props.disabled ? props.theme.grey000 : props.theme.blue600};
  }

  ${media.atLeastMobile`
    margin: 0 15px;
  `}
`

const CurrencyRow = styled(Row)`
  padding-top: 8px;
  ${media.mobile`
    padding-left: 0px;
    padding-right: 0px;
  `}
`

const extractFieldValue = (e, value) => value

export class CurrencySelect extends React.Component<Props> {
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
            onChange={compose(actions.changeSource, extractFieldValue)}
            // @ts-ignore
            component={SelectBox}
            // @ts-ignore
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
            onChange={compose(actions.changeTarget, extractFieldValue)}
            // @ts-ignore
            component={SelectBox}
            // @ts-ignore
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

const connector = connect(getData, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(CurrencySelect)
