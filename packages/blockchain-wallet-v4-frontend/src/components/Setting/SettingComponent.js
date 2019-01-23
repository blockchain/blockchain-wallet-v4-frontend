import styled from 'styled-components'
import Media from 'services/ResponsiveService'

const SettingComponent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  width: 30%;
  padding: 10px 0 10px 0;
  box-sizing: border-box;
  ${Media.laptop`
    align-items: flex-start;
    width: 100%;
  `};
`

export default SettingComponent
