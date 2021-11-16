import styled from 'styled-components'

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
  position: sticky;
  padding: 20px 40px;
  bottom: 0;
  left: 0;
`
