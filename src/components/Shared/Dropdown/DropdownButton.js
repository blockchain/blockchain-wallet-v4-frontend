import styled from 'styled-components'

const DropdownButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  user-select: none;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease-in-out;
  background: white;
  border: 1px solid ${props => props.theme.grayLighter};
  font-family: 'Montserrat', 'Helvetica', sans-serif !important;
  font-size: 0.9rem;
  font-weight: 300;
  color: ${props => props.theme.text};
  text-transform: capitalize;
  cursor: pointer;

  &:after {
    width: 0;
    height: 0;
    margin-left: 0.3em;
    vertical-align: middle;
    content: "";
    border-top: 0.3em solid;
    border-right: 0.3em solid transparent;
    border-left: 0.3em solid transparent;
  }
`

export default DropdownButton
