import styled from 'styled-components'

import { Row } from 'components/Flyout/model'

export const FullAssetImage = styled.div<{ backgroundImage; cropped?: boolean }>`
  background-image: ${({ backgroundImage }) => `url(${backgroundImage})`};
  background-size: cover;
  background-position: center;
  width: 100%;
  height: ${(props) => (props.cropped ? '240px' : '480px')};
`

export const AssetDesc = styled.div`
  padding: 40px;
`

export const StickyCTA = styled.div`
  background: ${(props) => props.theme.white};
  border-top: 1px solid ${(props) => props.theme.grey000};
  position: sticky;
  padding: 20px 40px;
  bottom: 0;
  left: 0;
`

export const CTARow = styled(Row)`
  padding-left: 0px;
  padding-right: 0px;
  &:first-child {
    padding-top: 0px;
    border-top: 0;
  }
`
