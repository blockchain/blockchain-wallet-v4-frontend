import styled from 'styled-components'

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: row;
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`

export const ColLeft = styled.div`
  width: 50%;
`

export const ColLeftInner = styled.div`
  width: 80%;
`

export const ColRight = styled.div`
  width: 50%;
`

export const Info = styled.div`
  font-size: 14px;
  margin-bottom: 10px;
`

export const InputWrapper = styled.div`
  width: 100%;
`

export const PartnerHeader = styled.div`
  font-size: 30px;
  font-weight: 600;
  @media (max-width: 480px){
    font-size: 20px;
    font-weight: 500;
  }
`

export const PartnerSubHeader = styled.div`
  margin-top: 5px;
  font-size: 16px;
  @media (max-width: 480px){
    font-size: 14px;
  }
`

export const ButtonWrapper = styled.div`
  margin-top: 25px;
`

export const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 20px;
`

export const Subtitle = styled.div`
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 15px;
`

export const ErrorWrapper = styled.div`
  margin-top: 5px;
  a {
    cursor: pointer;
    color: ${props => props.theme['brand-secondary']}
  }
`

export const ColRightInner = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  padding-left: 20%;
`

export const EmailHelper = styled.span`
  margin-top: 5px;
  font-size: 12px;
  color: ${props => props.error ? props.theme['error'] : props.theme['gray-3']};
  a {
    cursor: pointer;
    color: ${props => props.theme['brand-secondary']};
  }
`
export const CenteredWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 15px;
`
export const CancelWrapper = styled(CenteredWrapper)`
  a {
    color: #545456;
    font-weight: 300;
    font-size: 14px;
  }
`

export const BorderBox = styled.div`
  border: 1px solid ${props => props.theme['gray-1']};
  padding: 30px;
`
