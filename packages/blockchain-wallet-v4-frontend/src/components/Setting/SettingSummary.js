import styled from 'styled-components'

const SettingSummary = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 15px 0 10px 0;
  box-sizing: border-box;

  @media (min-width: 992px) {
    width: 50%;
  }
`

export default SettingSummary
