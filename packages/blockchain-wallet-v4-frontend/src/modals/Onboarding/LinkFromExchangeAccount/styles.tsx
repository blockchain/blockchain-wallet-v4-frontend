import styled from 'styled-components'

export const Content = styled.div`
  display: flex;
  min-height: 300px;
  align-items: center;
  height: 90%;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  padding: 40px;
`
export const Status = styled.div`
  width: 100%;
  word-break: break-word;
  > div:not(:first-child) {
    margin-top: 8px;
  }
`

export const ActionsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`

export const MainContent = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

export const MainWrapper = styled.div`
  display: flex;
  min-height: 300px;
  height: calc(100% - 80px);
  align-items: center;
  flex: 1;
  flex-direction: column;
  text-align: center;
  padding: 40px;
`

export const TitleWrapper = styled.div`
  margin-top: 8px;
  width: 100%;
  display: flex;
  margin-bottom: 40px;
`

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1;
  width: 100%;
  flex-direction: column;
`
