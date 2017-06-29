import PropTypes from 'prop-types'
import styled from 'styled-components'

const grayLighter = '#eceeef'

const DropdownHeader = styled.a`
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: ${grayLighter};
  font-weight: normal;
  cursor: not-allowed;
`

DropdownHeader.propTypes = {
  children: PropTypes.string.isRequired
}

export default DropdownHeader
