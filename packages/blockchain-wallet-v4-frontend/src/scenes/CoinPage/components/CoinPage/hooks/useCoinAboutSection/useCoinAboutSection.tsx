import React, { ReactElement, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'

import { useCoinAssetInfo } from 'hooks'

import { AboutSection } from '../../../AboutSection'
import { CoinWhitepaperButton } from '../../../CoinWhitepaperButton'
import { OfficialCoinWebsiteButton } from '../../../OfficialCoinWebsiteButton'
import { CoinAboutSectionHook } from './useCoinAboutSection.types'

const useCoinAboutSection: CoinAboutSectionHook = ({ coin }) => {
  const { data } = useCoinAssetInfo({ coin })

  const actions = useMemo(() => {
    const actionButtons: ReactElement[] = []

    if (data?.website) {
      actionButtons.push(<OfficialCoinWebsiteButton key={data.website} href={data.website} />)
    }

    if (data?.whitepaper) {
      actionButtons.push(<CoinWhitepaperButton key={data.whitepaper} href={data.whitepaper} />)
    }

    return actionButtons
  }, [data])

  const node = useMemo(() => {
    if (!data || !data?.description) return

    return (
      <AboutSection
        content={data.description}
        actions={actions}
        title={
          <FormattedMessage
            id='coinView.aboutSection.title'
            defaultMessage='About {coin}'
            values={{ coin }}
          />
        }
      />
    )
  }, [coin, data, actions])

  return [node]
}

export default useCoinAboutSection
