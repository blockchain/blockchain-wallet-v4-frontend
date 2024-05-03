import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
export const AddressWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 40px;
  border-bottom: ${(props) => `1px solid ${props.theme.grey000}`};
  &:first-child {
    border-top: ${(props) => `1px solid ${props.theme.grey000}`};
  }
`
export const AddressDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  overflow-wrap: anywhere;
  word-break: break-all;
  hyphens: none;
`
export const InfoContainer = styled.div`
  background: ${(props) => props.theme.grey000};
  margin: 16px 40px 0px 40px;
  padding: 16px;
  border-radius: 8px;
`
export const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 40px 0 36px;
  width: 100%;
`
export const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 40px 40px;

  & > :last-child {
    margin-top: 16px;
  }
`
export const AlertWrapper = styled.div`
  flex-direction: column;
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`
