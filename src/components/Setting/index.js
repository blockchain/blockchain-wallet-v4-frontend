import styled from 'styled-components'

const SettingContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  border-bottom: 1px solid #EFEFEF;

  @media (min-width: 992px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`
const SettingSummary = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 5px 0;
  box-sizing: border-box;

  @media (min-width: 992px) {
    width: 50%;
  }
`
const SettingComponent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 5px 0;
  box-sizing: border-box;
  text-align: right;

  @media (min-width: 992px) {
    align-items: flex-end;
    width: 30%;
  }
`
const SettingDescription = styled.div`
  text-align: justify;
  padding: 10px 0;
  font-weight: 200;
  & > * { display: inline; margin-right: 5px; }
`
const SettingHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  padding-top: 10px;
`

export { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary }
