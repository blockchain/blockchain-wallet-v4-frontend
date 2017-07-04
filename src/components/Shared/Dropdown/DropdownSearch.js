import styled from 'styled-components'

const DropdownSearch = styled.input.attrs({ type: 'text', autoFocus: true })`
  border: 1px solid ${props => props.theme.grayLighter};
  font-size: 0.9rem;
  font-weight: normal;
  box-shadow: none;

  &:focus {
    border-radius: none;
    border: 1px solid ${props => props.theme.grayLighter};
    outline: none;
  }
`

export default DropdownSearch
