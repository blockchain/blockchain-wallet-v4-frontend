import styled from 'styled-components'

const grayLighter = '#eceeef'

const DropdownSearch = styled.input.attrs({ type: 'text', autoFocus: true })`
  border: 1px solid ${grayLighter};
  font-size: 0.9rem;
  font-weight: normal;
  box-shadow: none;

  &:focus {
    border-radius: none;
    border: 1px solid ${grayLighter};
    outline: none;
  }
`

export default DropdownSearch
