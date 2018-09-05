import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

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
    border: 1px solid ${props => props.theme['gray-2']};
    border-left: none;
    > .bc__value-container {
      > .bc__single-value {
        right: 0px;
        font-size: 14px;
        font-weight: 300;
        color: ${props => props.theme['gray-4']};
      }
    }
    > .bc__indicators {
      > .bc__indicator-separator {
        display: none;
      }
    }
    &:hover {
      border: 1px solid ${props => props.theme['gray-2']};
      border-left: none;
    }
    &:active {
      border: 1px solid ${props => props.theme['gray-2']};
      border-left: none;
    }
  }
  .bc__option {
    color: ${props => props.theme['gray-4']};
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
