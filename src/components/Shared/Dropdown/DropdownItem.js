import PropTypes from 'prop-types'
import styled from 'styled-components'

const grayLightest = '#f7f7f9'

const DropdownItem = styled.a`
  width: 100%;
  padding: 0.5rem 1rem;
  font-weight: 300;
  cursor: pointer;

  &:hover {
    background-color: ${grayLightest};
  }
`

DropdownItem.propTypes = {
  children: PropTypes.string.isRequired
}

export default DropdownItem
