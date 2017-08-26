import React from 'react'
import styled from 'styled-components'
import { DefaultColor } from '../Colors'

const BaseCheckBoxInput = styled.input.attrs({
  type: 'checkbox'
})`
  opacity: 0;
  width: 0px;
  height: 0px;
  position: absolute;
  & + * {
    label {
      display: flex;
      cursor: pointer;
      align-items: center;
      &:before {
        content: '';
        width: 15px;
        height: 15px;
        margin-right: 5px;
        background: white;
        border-radius: 2px;
        transition: background .2s;
        border: 1px solid ${DefaultColor.iris};
      }
    }
  }
  &:checked {
    & + * {
      label {
        &:before {
          background: ${DefaultColor.iris};
        }
      }
    }
  }
`

const CheckBoxInput = props => {
  const { errorState, ...rest } = props

  return <BaseCheckBoxInput id={props.name} {...rest} />
}

export default CheckBoxInput
