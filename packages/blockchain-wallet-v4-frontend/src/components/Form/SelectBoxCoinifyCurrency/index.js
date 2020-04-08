import { connect } from 'react-redux'
import React from 'react'
import styled from 'styled-components'

import { getData } from './selectors'
import SelectBox from '../SelectBox'

const CustomSelectBox = styled(SelectBox)`
  * button {
    border-left: none;
  }
  * {
    border-left: none;
  }
  .bc__control {
    background-color: ${props => props.theme.white};
    cursor: ${props => props.disabled && 'not-allowed'};
    border: 1px solid ${props => props.theme[props.borderColor]};
    border-left: none;
    min-height: 72px;
    > .bc__value-container {
      > .bc__single-value,
      > .bc__placeholder {
        right: 0px;
        font-size: 18px;
        font-weight: 400;
        color: ${props =>
          props.disabled ? props.theme.grey200 : props.theme.grey700};
      }
    }
    > .bc__indicators {
      > .bc__dropdown-indicator {
        color: ${props =>
          props.disabled ? props.theme.grey200 : props.theme.blue600};
      }
      > .bc__indicator-separator {
        display: none;
      }
    }
    &:hover {
      border: 1px solid ${props => props.theme.grey000};
      border-left: none;
    }
    &:active {
      border: 1px solid ${props => props.theme.grey000};
      border-left: none;
    }
  }
  .bc__option {
    color: ${props => props.theme['grey500']};
  }
`

class SelectBoxCoinifyCurrency extends React.PureComponent {
  render () {
    const { currencies, ...rest } = this.props
    const elements = [{ group: '', items: currencies }]

    return (
      <CustomSelectBox
        arrowSize='12px'
        textAlign='center'
        fontSize='small'
        label=''
        elements={elements}
        borderLeft='none'
        searchEnabled={false}
        {...rest}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => getData(state, ownProps)

export default connect(mapStateToProps)(SelectBoxCoinifyCurrency)
