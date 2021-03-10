import React from 'react'
import { assoc, forEachObjIndexed, map } from 'ramda'

import { sizes } from 'services/styles'

import 'matchmedia-polyfill'
import 'matchmedia-polyfill/matchMedia.addListener'

const mediaMatchers = map(
  size => window.matchMedia(`(max-width: ${size}px)`),
  sizes
)
const getMediaMatches = () => map(({ matches }) => matches, mediaMatchers)

const startingMedia = getMediaMatches()
const mediaContext = React.createContext(startingMedia)

export class MediaContextProvider extends React.Component {
  constructor(props) {
    super(props)

    this.updateHandlers = {}
    this.state = {
      media: startingMedia
    }
  }

  componentDidMount() {
    forEachObjIndexed((matcher, matcherName) => {
      const updateHandler = this.updateMedia.bind(this, matcherName)
      this.updateHandlers[matcherName] = updateHandler
      matcher.addListener(updateHandler)
    }, mediaMatchers)
  }

  componentWillUnmount() {
    forEachObjIndexed(
      (matcher, matcherName) =>
        matcher.removeListener(this.updateHandlers[matcherName]),
      mediaMatchers
    )
  }

  updateMedia(matcherName, { matches }) {
    this.setState({
      media: assoc(matcherName, matches, this.state.media)
    })
  }

  render() {
    const { children } = this.props
    const { media } = this.state
    return (
      <mediaContext.Provider value={media}>{children}</mediaContext.Provider>
    )
  }
}

export const MediaContextConsumer = mediaContext.Consumer
