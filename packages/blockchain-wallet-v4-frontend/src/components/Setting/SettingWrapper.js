import styled from 'styled-components'
import Media from 'services/ResponsiveService'

const SettingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  & > *:nth-child(2) {
    margin-top: 5px;
  }
  ${Media.laptop`
    align-items: flex-start;  
  `};
`

export default SettingWrapper
