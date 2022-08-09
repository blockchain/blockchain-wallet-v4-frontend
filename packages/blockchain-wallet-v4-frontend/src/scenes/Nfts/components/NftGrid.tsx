import React from 'react'
import styled from 'styled-components'

import { media } from 'services/styles'

// const DELAY = 500

const DESKTOP = 8
const LAPTOP_L = 6
const LAPTOP_M = 5
const MORE_ASSETS = 4
const LAPTOP = 3
const TABLET = 2
const MOBILE = 2

const Grid = styled.div<{ fullscreen: boolean; moreAssetsPage?: boolean }>`
  width: 100%;
  display: grid;
  overflow: scroll;
  gap: 20px;
  grid-template-columns: repeat(
    ${(props) => (props.fullscreen ? DESKTOP : LAPTOP_L)},
    minmax(0, 1fr)
  );
  ${media.desktop`
    grid-template-columns: repeat(${(props) =>
      props.moreAssetsPage ? MORE_ASSETS : props.fullscreen ? LAPTOP_L : LAPTOP_M}, minmax(0, 1fr));
      .asset-image-container {
        height: 215px;
      }
  `}
  ${media.laptopL`
    grid-template-columns: repeat(${(props) =>
      props.moreAssetsPage ? MORE_ASSETS : props.fullscreen ? LAPTOP_M : LAPTOP}, minmax(0, 1fr));
      .asset-image-container {
        height: height: 215px;
      }
  `}
  ${media.laptop`
    grid-template-columns: repeat(${(props) =>
      props.fullscreen ? MOBILE : TABLET}, minmax(0, 1fr));
    padding: 12px;
    box-sizing: border-box;
    .asset-image-container {
        height: 200px;
    }
  `}
  ${media.tablet`
    grid-template-columns: repeat(${MOBILE}, minmax(0, 1fr));
    padding: 12px;
    box-sizing: border-box;
  `}
`

export const getNftGridSize = (
  fullscreen: boolean,
  isDesktop: boolean,
  isLaptopL: boolean,
  isLaptop: boolean,
  isTablet: boolean
) => {
  const items = isTablet
    ? MOBILE
    : isLaptop
    ? fullscreen
      ? TABLET
      : MOBILE
    : isLaptopL
    ? fullscreen
      ? LAPTOP_M
      : LAPTOP
    : isDesktop
    ? fullscreen
      ? LAPTOP_L
      : LAPTOP_M
    : fullscreen
    ? DESKTOP
    : LAPTOP_L

  return items
}

const NftGrid: React.FC<Props> = ({ children, fullscreen, moreAssetsPage }) => {
  //   const isDesktop = useMedia('desktop')
  //   const isLaptopL = useMedia('laptopL')
  //   const isLaptop = useMedia('laptop')
  //   const isTablet = useMedia('tablet')
  //   const ref = useRef<HTMLDivElement | null>(null)
  //   const refExists = !!ref.current

  //   const handleResize = useCallback(() => {
  //     if (ref.current) {
  //       const items = getNftGridSize(fullScreen, isDesktop, isLaptopL, isLaptop, isTablet)
  //       const gridWidth = ref.current.clientWidth
  //       const itemWidth = gridWidth / items - 50
  //       ref.current.querySelectorAll<HTMLElement>('.asset-image-container').forEach((item) => {
  //         item.style.height = `${itemWidth}px`
  //       })
  //     }
  //   }, [desktop, laptopL, laptop, tablet, fullscreen])
  //   useEffect(() => {
  //     if (refExists) {
  //       //   handleResize()
  //     }
  //     window.addEventListener('resize', () => setTimeout(handleResize, DELAY))
  //     return () => window.removeEventListener('resize', handleResize)
  //   }, [handleResize, refExists])

  //   useEffect(() => {
  //     setTimeout(handleResize, DELAY)
  //   }, [fullscreen, handleResize])

  return (
    <Grid fullscreen={fullscreen} moreAssetsPage={moreAssetsPage}>
      {children}
    </Grid>
  )
}

type Props = {
  fullscreen: boolean
  moreAssetsPage?: boolean
}

export default NftGrid
