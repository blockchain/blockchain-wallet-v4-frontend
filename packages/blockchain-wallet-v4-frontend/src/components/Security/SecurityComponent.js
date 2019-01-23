import styled from 'styled-components'
import Media from 'services/ResponsiveService'

const SecurityComponent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  padding: 15px 0 10px 0;
  box-sizing: border-box;
  ${Media.laptop`
    align-items: center;
  `};
`

export default SecurityComponent
