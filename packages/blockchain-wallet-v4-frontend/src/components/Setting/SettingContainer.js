import styled from 'styled-components'

const SettingContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  border-bottom: 1px solid ${props => props.theme['gray-2']};

  @media (min-width: 992px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`

export default SettingContainer
