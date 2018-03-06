import * as KVStoreEntry from './KVStoreEntry'
import * as R from 'ramda'
import {view, over, lens, assoc, prop, __, compose, curry, converge, dec, inc, lensIndex, ifElse, is, add, always, identity, complement, isNil, pipe, when, evolve, set, divide} from 'ramda'
import {mapped, traverseOf, traversed} from 'ramda-lens'
import * as Task from 'data.task'
import Type from './Type'
import {Map, fromJS} from 'immutable'

const isNonNill = compose(complement, isNil)
const lensProp = key =>
  lens(
    (x) => {
      console.debug('GET ', key, ' from ', x)
      if (Map.isMap(x)) {
        return x.get(key)
      } else {
        return prop(key, x)
      }
    },
    (val, x) => {
      console.info('SET ', key, ' TO ', val, ' in ', x)
      if (Map.isMap(x)) {
        return x.set(key, val)
      } else {
        return assoc(key, val, x)
      }
    }
)

const whenTask = R.curry((con, c) => R.ifElse(con, c, Task.of))

const map = R.curry((fun, task) => {
  return task.map(obj => {
    console.debug('MAP ', obj)
    return fun(obj)
  })
})
const chain = R.curry((fun, task) => {
  return task.chain(obj => {
    console.debug('CHAIN ', obj)
    return fun(obj)
  })
})

const log = (a) => {
  console.info('LOG: ', a)
  return a
}

const logWithComment = R.curry((comment, a) => {
  console.info('LOG: ', comment, ' ', a)
  return a
})

const count = o => Object.keys(o).length
const maxKey = o => Math.max(Object.keys(o).map(parseInt))

export const lensValue = lensProp('value')
export const selectValue = view(lensValue)

export const lensTypeId = lensProp('typeId')
export const lensXpriv = lensProp('xpriv')
export const lensEntriesPerChild = lensProp('entriesPerChild')
export const lensEntryCount = lensProp('entryCount')
export const lensParent = lensProp('parentEntry')
export const lensChildren = lensProp('childEntries')
export const lensChild = i => compose(lensChildren, lensProp(i))
export const lensChildValue = i => compose(lensChild(i), lensValue)
export const lensChildCount = compose(lensParent, lensValue, lensProp('childCount'))
export const lensLastChild = list => compose(lensChild, maxKey, view(lensChildren))(list)

export const selectTypeId = view(lensTypeId)
export const selectXpriv = view(lensXpriv)
export const selectEntriesPerChild = view(lensEntriesPerChild)
export const selectEntryCount = view(lensEntryCount)
export const selectParent = view(lensParent)
export const selectChildren = view(lensChildren)
export const selectChild = i => view(lensChild(i))
export const selectChildCount = view(lensChildCount)
export const selectLastChild = list => view(lensLastChild(list), list)

export const create = (xpriv, typeId, entriesPerChild) => {
  return {
    VERSION: 1,
    xpriv: xpriv,
    typeId: typeId,
    entriesPerChild: entriesPerChild,
    childEntries: {}
  }
}

export const createListApi = (api) => {
  const createMasterNode = (list) => KVStoreEntry.fromMetadataXpriv(selectXpriv(list), selectTypeId(list))
  const createChildNode = R.curry((childId, list) => KVStoreEntry.fromMetadataXpriv(selectXpriv(list), [selectTypeId(list), childId]))

  // loadChild :: childId -> KVStoreList -> Task KVStoreList
  // If necessary, loads the correct child into memory from KV store and appends it into the list
  const loadChild = R.curry((childId, list) => {
    // fetchChildNode :: KVStoreEntry -> Task KVStoreEntry
    const fetchChildNode = whenTask(
      isNonNill,
      pipe(
        always(createChildNode(childId, list)),
        api.fetchKVStore))

    // initialiseChildNode :: KVStoreEntry -> Task KVStoreEntry
    const initialiseChildNode = whenTask(
      compose(isNil, view(lensValue)),
      pipe(
        set(lensValue, {}),
        api.updateKVStore))

    // loadChild :: KVStoreEntry -> Task KVStoreEntry
    const loadChild = pipe(
      fetchChildNode,
      chain(initialiseChildNode))

    return traverseOf(
      lensChild(childId),
      identity,
      loadChild
    )(list)
  })

  // loadEntryCount :: KVStoreList -> Task KVStoreList
  const loadLastChild = converge(
      loadChild,
      [ compose(dec, view(lensChildCount)), identity ])

  // initialise :: KVStoreList -> Task[KVStoreList]
  const initialize = (list) => {
    const initialiseParentNode = whenTask(
      pipe(selectValue, isNil),
      pipe(
        set(lensValue, {entriesPerChild: list.entriesPerChild, childCount: 1}),
        api.updateKVStore)
      )

    const loadParent = compose(
      chain(initialiseParentNode),
      api.fetchKVStore,
      always(createMasterNode(list)))

    // saveParent :: KVStoreList -> Task KVStoreList
    const saveParent = traverseOf(
      lensParent,
      Task.of,
      loadParent)

    const calculateTotalCount = R.converge(
      R.add,
      [ compose(count, selectValue, log, selectLastChild, log),
        R.converge(
          R.multiply,
          [ selectEntriesPerChild, compose(R.dec, log, selectChildCount, log) ])])

    const setTotalCount = (list) => {
      return R.set(
        lensEntryCount,
        calculateTotalCount(list))(list)
    }

    return saveParent(list)
      .chain(loadLastChild)
      .map(setTotalCount)
  }

  const add = (list, entry) => {
    const needNewPage = (list) => list.entryCount % list.entriesPerChild === 0
    const childId = Math.floor(list.entryCount / list.entriesPerChild)

    console.info('SAVE ENTRY IN ',childId)

    const valueLens = compose(
        lensChild(childId),
        lensValue)

    // idWithinChild :: KVStoreList -> Int
    const idWithinChild = compose(
      R.inc,
      count,
      view(valueLens)
    )

    // saveEntryInChild :: KVStoreList -> Object -> KVStoreList
    const saveEntryInChild = curry((entry, list) => {
      const l = compose(valueLens, lensProp(idWithinChild(list)))
      return set(l, entry, list)
    })

    // updateChildEntry :: KVStoreList -> Task KVStoreList
    const updateChildEntry = traverseOf(
      lensChild(childId),
      Task.of,
      api.updateKVStore
    )

    const incrementCount = over(lensEntryCount, inc)

    // incrementChildCount :: KVStoreList -> Task KVStoreList
    const incrementChildCount = whenTask(
      needNewPage,
      compose(
        traverseOf(
          lensProp('parentEntry'),
          Task.of,
          api.updateKVStore),
        R.over(
          compose(
            lensProp('parentEntry'),
            lensProp('value'),
            lensProp('childCount')),
          R.inc)))

    return loadChild(childId, list)
      .chain(incrementChildCount)
      .map(saveEntryInChild(entry))
      .chain(updateChildEntry)
      .map(incrementCount)
  }

  return {
    add,
    initialize
  }
}
