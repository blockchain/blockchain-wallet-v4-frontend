import * as KVStoreEntry from './KVStoreEntry'
import * as R from 'ramda'
import {multiply, range, modulo, dissoc, concat, reduce, view, over, prop, __,
  compose, curry, converge, dec, inc, always, identity,
  isNil, pipe, set, divide} from 'ramda'
import {traverseOf} from 'ramda-lens'
import * as Task from 'data.task'
import {lensProp, whenTask, taskChain} from 'util'

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

export const lensEntryId = lensProp('entryId')
export const selectEntryId = view(lensEntryId)

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
  const createChildNode = curry((childId, list) => KVStoreEntry.fromMetadataXpriv(selectXpriv(list), [selectTypeId(list), childId]))

  // loadChild :: childId -> KVStoreList -> Task KVStoreList
  // If necessary, loads the correct child into memory from KV store and appends it into the list
  const loadChild = curry((childId, list) => {
    // fetchChildNode :: KVStoreEntry -> Task KVStoreEntry
    const fetchChildNode = whenTask(
      isNil,
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
      taskChain(initialiseChildNode))

    return traverseOf(
      lensChild(childId),
      identity,
      loadChild
    )(list)
  })

  // updateChildEntry :: Int -> KVStoreList -> Task KVStoreList
  const updateChildEntry = curry((childId, list) => traverseOf(
    lensChild(childId),
    Task.of,
    api.updateKVStore
  )(list))

  // loadLastChild :: KVStoreList -> Task KVStoreList
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
      taskChain(initialiseParentNode),
      api.fetchKVStore,
      always(createMasterNode(list)))

    // saveParent :: KVStoreList -> Task KVStoreList
    const saveParent = traverseOf(
      lensParent,
      Task.of,
      loadParent)

    const calculateTotalCount = converge(
      R.add,
      [ compose(count, selectValue, selectLastChild),
        converge(
          multiply,
          [ selectEntriesPerChild, compose(dec, selectChildCount) ])])

    const setTotalCount = (list) => {
      return set(
        lensEntryCount,
        calculateTotalCount(list))(list)
    }

    return saveParent(list)
      .chain(loadLastChild)
      .map(setTotalCount)
  }

  const add = (list, entry) => {
    const needNewPage = (list) => selectEntryCount(list) % selectEntriesPerChild(list) === 0
    const childId = Math.floor(list.entryCount / list.entriesPerChild)

    // idWithinChild :: KVStoreList -> Int
    const idWithinChild = compose(
      count,
      view(lensChildValue(childId))
    )

    // saveEntryInChild :: KVStoreList -> Object -> KVStoreList
    const saveEntryInChild = curry((entry, list) => {
      const l = compose(lensChildValue(childId), lensProp(idWithinChild(list)))
      return set(l, entry, list)
    })

    const incrementCount = over(lensEntryCount, inc)

    // incrementChildCount :: KVStoreList -> Task KVStoreList
    const incrementChildCount = whenTask(
      needNewPage,
      compose(
        traverseOf(
          lensProp('parentEntry'),
          Task.of,
          api.updateKVStore),
        over(
          compose(
            lensProp('parentEntry'),
            lensProp('value'),
            lensProp('childCount')),
          inc)))

    return loadChild(childId, list)
      .map(incrementCount)
      .chain(incrementChildCount)
      .map(saveEntryInChild(entry))
      .chain(updateChildEntry(childId))
  }

  const update = (list, entry) => {
    const entriesPerChild = selectEntriesPerChild(list)
    const childId = compose(
      Math.floor,
      divide(__, entriesPerChild),
      selectEntryId)(entry)

    const idWithinChild = compose(
      modulo(__, entriesPerChild),
      selectEntryId
    )

    // saveEntryInChild :: KVStoreList -> Object -> KVStoreList
    const saveEntryInChild = curry((entry, list) => {
      const l = compose(lensChildValue(childId), lensProp(idWithinChild(entry)))
      return set(l, dissoc('entryId', entry), list)
    })

    return loadChild(childId, list)
      .map(saveEntryInChild(entry))
      .chain(updateChildEntry(childId))
  }

  // loadChildForEntry :: KVStoreList -> Int -> Task KVStoreList
  const loadChildForEntry = curry((list, entryId) => {
    const childId = Math.floor(entryId / selectEntriesPerChild(list))
    return loadChild(childId, list)
  })

  const get = (list, entryId) => {
    const childId = Math.floor(entryId / selectEntriesPerChild(list))
    const idWithinChild = entryId % selectEntriesPerChild(list)

    const loadEntry = compose(set(lensEntryId, entryId), prop(idWithinChild), view(lensChildValue(childId)))

    return loadChildForEntry(list, entryId)
      .map(l => ({list: l, obj: loadEntry(l)}))
  }

  const getList = (list, from, to) => {
    // loadAllChildren :: Int -> Int -> Task KVStoreList
    // TODO Pretty sure we can do this in parallel somehow?
    const loadAllChildren = list =>
      reduce((task, entryId) => task.chain(list => loadChildForEntry(list, entryId)), Task.of(list), range(from, to))

    const extractEntry = (list, entryId) => {
      const childId = Math.floor(entryId / selectEntriesPerChild(list))
      const idWithinChild = entryId % selectEntriesPerChild(list)
      return compose(set(lensEntryId, entryId), prop(idWithinChild), view(lensChildValue(childId)))(list)
    }

    const extractAllEntries = list =>
      reduce((entries, entryId) => concat(entries, [extractEntry(list, entryId)]), [], range(from, to))

    return loadAllChildren(list)
      .map(l => ({list: l, obj: extractAllEntries(l)}))
  }

  return {
    add,
    initialize,
    update,
    get,
    getList
  }
}
