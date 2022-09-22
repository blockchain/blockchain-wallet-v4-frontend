import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

export const HeaderWrapper = styled(FlyoutWrapper)`
  flex-direction: row;
  justify-content: flex-end;
  display: flex;
  max-width: 480px;
  background-color: ${(props) => props.theme.white};
`

export const CloseIconContainer = styled.div`
  cursor: pointer;
`

export const ImageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 18px;
`

export const Title = styled(Text)`
  display: flex;
  text-align: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
`

export const DescriptionWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
`

export const Description = styled(Text)`
  display: flex;
  text-align: center;
  margin-bottom: 7px;
  font-size: 16px;
  font-weight: 500;
  max-width: 345px;
`

export const ReferralId = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  height: 120px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  background: #fafbff;
  margin-bottom: 24px;
`

export const CircleBackground = styled.div<{ color?: string; size?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => (props.size ? props.size : '48px')};
  height: ${(props) => (props.size ? props.size : '48px')};
  min-width: ${(props) => (props.size ? props.size : '48px')};
  background-color: ${(props) => (props.color ? props.theme[props.color] : props.theme.blue000)};
  border-radius: ${(props) => (props.size ? props.size : '48px')};
  margin: 8px 8px 8px 0;
`

export const ReferralItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

export const ReferralItems = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  justify-content: center;
`

export const ReferralItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`
export const ReferralItemDescription = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
