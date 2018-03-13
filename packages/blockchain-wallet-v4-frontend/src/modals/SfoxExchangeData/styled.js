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
  width: 80%;
`

export const PartnerHeader = styled.div`
  font-size: 30px;
  font-weight: 600;
`

export const PartnerSubHeader = styled.div`
  margin-top: 5px;
  font-size: 14px;
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
