import React from 'react'
import { map, forEachObjIndexed, assoc } from 'ramda'
import 'matchmedia-polyfill'
import 'matchmedia-polyfill/matchMedia.addListener'

import { sizes } from 'services/ResponsiveService'

const mediaMatchers = map((size) => window.matchMedia(`(max-width: ${size}px)`), sizes)
const getMediaMatches = () => map(({ matches }) => matches, mediaMatchers)

const startingMedia = getMediaMatches()
const mediaContext = React.createContext(startingMedia)

export class MediaContextProvider extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      media: startingMedia
    }
  }

  componentDidMount () {
    forEachObjIndexed((matcher, matcherName) =>
      matcher.addListener(this.updateMedia.bind(this, matcherName))
      , mediaMatchers
    )
  }

  componentWillUnmount () {
    forEachObjIndexed((matcher) => matcher.removeListener(this.updateMedia), mediaMatchers)
  }

  updateMedia (matcherName, { matches }) {
    this.setState({
      media: assoc(matcherName, matches, this.state.media)
    })
  }

  render () {
    const { children } = this.props
    const { media } = this.state
    return (
      <mediaContext.Provider value={media}>
        {children}
      </mediaContext.Provider>
    )
  }
}

export const MediaContextConsumer = mediaContext.Consumer
