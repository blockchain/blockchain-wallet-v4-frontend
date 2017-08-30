import styled from 'styled-components'
import PropTypes from 'prop-types'
import { DefaultColor } from 'blockchain-info-components'

const SettingStatus = styled.div`
  display: block;
  padding: 1px 5px;
  box-sizing: border-box;
  border-radius: 3px;
  background-color: ${props => props.active ? DefaultColor.green : DefaultColor.red};
  color: ${DefaultColor.white};
  font-size: 12px;
  font-weight: 400;
  text-transform: capitalize;
`

SettingStatus.propTypes = {
  active: PropTypes.bool.isRequired
}

export default SettingStatus
