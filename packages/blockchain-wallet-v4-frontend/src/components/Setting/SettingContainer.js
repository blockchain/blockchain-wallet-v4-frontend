import styled from 'styled-components'
import Media from 'services/ResponsiveService'

const SettingContainer = styled.div`
  width: 100%;
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0px;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
  ${Media.laptop`
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;  
  `};
`

export default SettingContainer
