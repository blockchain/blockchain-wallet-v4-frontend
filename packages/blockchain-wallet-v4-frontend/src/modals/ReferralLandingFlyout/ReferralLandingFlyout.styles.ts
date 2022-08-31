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
