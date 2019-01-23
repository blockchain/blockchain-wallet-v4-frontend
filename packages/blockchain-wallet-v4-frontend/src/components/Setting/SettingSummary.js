import styled from 'styled-components'
import Media from 'services/ResponsiveService'

const SettingSummary = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 50%;
  padding: 10px 0 10px 0;
  box-sizing: border-box;
  ${Media.laptop`
    width: 100%;
  `};
`

export default SettingSummary
