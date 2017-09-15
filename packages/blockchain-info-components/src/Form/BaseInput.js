import styled from 'styled-components'

const BaseInput = styled.input`
  display: block;
  width: 100%;
  height: 40px;
  min-height: 40px;
  padding: 6px 12px;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.42;
  color: ${props => props.theme['gray-5']};
  background-color: ${props => props.theme['white']};
  background-image: none;
  outline-width: 0;
  user-select: text;
  border: 1px solid  ${props => props.theme[props.borderColor]};

  &::-webkit-input-placeholder {
    color: ${props => props.theme['gray-2']};
  }
`

export default BaseInput
