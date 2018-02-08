import {wrapHex} from '../helper'
import * as assert from 'assert'
import {BufHelper} from '../messages/bufhelper'

export const routeSagas = (apiUrl) => {
  // The server returns
  // {
  //   error: "..."
  //   result:
  //    [
  //      { "id" : "02fa77e0f4ca666f7d158c4bb6675d1436e339903a9feeeaacbd6e55021b98e7ee", "channel" : "1279104:12:0", "msatoshi" : 101000, "delay" : 153 }
  //      { ... }
  //    ]
  // }
  const parseRouteToRaw = (route) => {
    return route.map(hop => {
      return new BufHelper(Buffer.alloc(32))
        .write(hop.channel)
        .write64(hop.msatoshi)
        .write32(hop.delay)
        .buffer
    })
  }

  const parseShortChannelId = (scIdString) => {
    let parts = scIdString.split(':')
    assert.equal(parts.length, 3, 'Short Channel ID has wrong formatting ' + scIdString)

    let b1 = Buffer.alloc(4)
    b1.writeInt32BE(parts[0], 0)

    let b2 = Buffer.alloc(4)
    b2.writeInt32BE(parts[1], 0)

    let b3 = Buffer.alloc(2)
    b3.writeInt16BE(parts[2], 0)

    let final = Buffer.alloc(8)
    b1.copy(final, 0, 1)
    b2.copy(final, 3, 1)
    b3.copy(final, 6)

    return final
  }

  const parseServerResponse = (object) => {
    if (object.error) {
      throw new Error(object.error.message)
    }

    let route = object.result.route

    if (route.length === 0) {
      throw new Error('No route found')
    }

    route = route.map(hop => {
      hop.id = wrapHex(hop.id)
      hop.channel = parseShortChannelId(hop.channel)
      return hop
    })

    return {
      firstHop: route[0],
      raw: parseRouteToRaw(route)
    }
  }

  const queryRoute = (start, end, amount, cltvEnd) => {
    return fetch(apiUrl,
      {
        method: 'POST',
        body: JSON.stringify({
          id: 1,
          jsonrpc: '2.0',
          method: 'getroute',
          params: [end.toString('hex'), amount.toString(), '1', cltvEnd.toString(), start.toString('hex')]
        })
      }).then(r => r.json())
  }

  const retrieveRoute = function * (start, end, amount, cltvEnd) {
    const response = yield queryRoute(start, end, amount, cltvEnd)
    return parseServerResponse(response)
  }

  return {
    retrieveRoute
  }
}
