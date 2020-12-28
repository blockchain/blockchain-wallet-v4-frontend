import styled from 'styled-components'

const SettingDescription = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 500;
  font-size: 13px;
  margin-top: 5px;
  margin-bottom: 10px;
  color: ${props => props.theme.grey700};

  & > * {
    display: inline;
    margin-right: 5px;
  }
`

export default SettingDescription
