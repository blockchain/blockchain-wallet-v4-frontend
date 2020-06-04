import styled from 'styled-components'

const SettingHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: ${props => props.theme.grey700};

  & > * {
    margin-right: 10px;
  }
`

export default SettingHeader
