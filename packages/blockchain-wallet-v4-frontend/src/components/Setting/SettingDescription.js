import styled from 'styled-components'

const SettingDescription = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: 200;
  font-size: 14px;
  margin-top: 5px;
  margin-bottom: 10px;
  color: ${props => props.theme['gray-5']};

  & > * {
    display: inline;
    margin-right: 5px;
  }
`

export default SettingDescription
