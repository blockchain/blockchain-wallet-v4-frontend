import styled from 'styled-components'

export const FullAssetImage = styled.div<{ backgroundImage }>`
  background-image: ${({ backgroundImage }) => `url(${backgroundImage})`};
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 480px;
`

export const AssetDesc = styled.div`
  padding: 40px;
`

export const StickyCTA = styled.div`
  background: ${(props) => props.theme.white};
  position: sticky;
  padding: 40px;
  bottom: 0;
  left: 0;
`
