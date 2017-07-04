import PropTypes from 'prop-types'
import styled from 'styled-components'

const DropdownItem = styled.a`
  width: 100%;
  padding: 0.5rem 1rem;
  font-weight: 300;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.grayLightest};
  }
`

DropdownItem.propTypes = {
  children: PropTypes.string.isRequired
}

export default DropdownItem
