import styled from 'styled-components'

const TextArea = styled.textarea`
  width: ${props => props.fullwidth ? '100%' : 'auto'};
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme.grayLighter};
  resize: none;

  &::-webkit-input-placeholder { color: ${props => props.theme.grayLighter} }
`

export default TextArea
