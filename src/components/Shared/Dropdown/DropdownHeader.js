import PropTypes from 'prop-types'
import styled from 'styled-components'

const DropdownHeader = styled.a`
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.grayLighter};
  font-weight: normal;
  cursor: not-allowed;
`

DropdownHeader.propTypes = {
  children: PropTypes.string.isRequired
}

export default DropdownHeader
