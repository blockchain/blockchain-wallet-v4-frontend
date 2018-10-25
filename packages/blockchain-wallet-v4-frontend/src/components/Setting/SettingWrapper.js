import styled from 'styled-components'

const SettingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  & > *:nth-child(2) {
    margin-top: 5px;
  }

  @media (min-width: 992px) {
    align-items: flex-end;
  }
`

export default SettingWrapper
