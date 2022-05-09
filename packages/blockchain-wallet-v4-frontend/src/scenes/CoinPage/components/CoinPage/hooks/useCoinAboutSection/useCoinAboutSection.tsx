import React, { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'

import { useCoinAssetInfo } from 'hooks'

import { AboutSection } from '../../../AboutSection'
import { CoinWhitepaperButton } from '../../../CoinWhitepaperButton'
import { OfficialCoinWebsiteButton } from '../../../OfficialCoinWebsiteButton'
import { CoinAboutSectionHook } from './useCoinAboutSection.types'

const useCoinAboutSection: CoinAboutSectionHook = ({ coin }) => {
  const { data } = useCoinAssetInfo({ coin })

  const node = useMemo(() => {
    if (!data) return

    return (
      <AboutSection
        content={data.description}
        title={
          <FormattedMessage
            id='coinView.aboutSection.title'
            defaultMessage='About {coin}'
            values={{ coin }}
          />
        }
        actions={[
          <OfficialCoinWebsiteButton key={1} href={data.website} />,
          <CoinWhitepaperButton key={2} href={data.whitepaper} />
        ]}
      />
    )
  }, [coin, data])

  return [node]
}

export default useCoinAboutSection
