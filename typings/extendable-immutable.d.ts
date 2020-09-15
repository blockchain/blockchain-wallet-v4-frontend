// Type definitions for extendable-immutable 1.3.3
// Project: https://github.com/kitten/extendable-immutable
// Definitions by: Nigel Daniels <https://github.com/nigel-daniels>
// Definitions: https://github.com/nigel-daniels/extendable-immutable-typings
/* eslint-disable */
declare module 'extendable-immutable' {
  import {
    Iterable,
    Iterator,
    List as List1,
    Map as Map1,
    OrderedMap as OrderedMap1,
    OrderedSet as OrderedSet1,
    Seq,
    Set as Set1,
    Stack as Stack1
  } from 'immutable'

  export class List<T> implements List1<any> {
    // Iterable methods
    equals(other: Iterable<any, any>): boolean
    hashCode(): number
    get(key: any, notSetValue?: any): any
    has(key: any): boolean
    includes(value: any): boolean
    contains(value: any): boolean
    first(): any
    last(): any
    getIn(searchKeyPath: Array<any>, notSetValue?: any): any
    getIn(searchKeyPath: Iterable<any, any>, notSetValue?: any): any
    hasIn(searchKeyPath: Array<any>): boolean
    hasIn(searchKeyPath: Iterable<any, any>): boolean
    toJS(): any
    toArray(): Array<any>
    toObject(): { [key: string]: any }
    toMap(): Map1<any, any>
    toOrderedMap(): OrderedMap1<any, any>
    toSet(): Set1<any>
    toOrderedSet(): OrderedSet1<any>
    toList(): List1<any>
    toStack(): Stack1<any>
    toSeq(): Seq<any, any>
    toKeyedSeq(): Seq.Keyed<any, any>
    toIndexedSeq(): Seq.Indexed<any>
    toSetSeq(): Seq.Set<any>
    keys(): Iterator<any>
    values(): Iterator<any>
    entries(): Iterator</* [any, any] */ Array<any>>
    keySeq(): Seq.Indexed<any>
    valueSeq(): Seq.Indexed<any>
    entrySeq(): Seq.Indexed</* (any, any) */ Array<any>>
    map<M>(
      mapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => M,
      context?: any
    ): /* this */ Iterable<any, M>
    filter(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    filterNot(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    reverse(): /* this */ Iterable<any, any>
    sort(
      comparator?: (valueA: any, valueB: any) => number
    ): /* this */ Iterable<any, any>
    sortBy<C>(
      comparatorValueMapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => C,
      comparator?: (valueA: C, valueB: C) => number
    ): /* this */ Iterable<any, any>
    groupBy<G>(
      grouper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => G,
      context?: any
    ): /* Map */ Seq.Keyed<G, /* this */ Iterable<any, any>>
    forEach(
      sideEffect: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => any,
      context?: any
    ): number
    slice(begin?: number, end?: number): /* this */ Iterable<any, any>
    rest(): /* this */ Iterable<any, any>
    butLast(): /* this */ Iterable<any, any>
    skip(amount: number): /* this */ Iterable<any, any>
    skipLast(amount: number): /* this */ Iterable<any, any>
    skipWhile(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    skipUntil(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    take(amount: number): /* this */ Iterable<any, any>
    takeLast(amount: number): /* this */ Iterable<any, any>
    takeWhile(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    takeUntil(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    concat(
      ...valuesOrIterables: /* Array<Iterable<any, any>|any */ any[]
    ): /* this */ Iterable<any, any>
    flatten(depth?: number): /* this */ Iterable<any, any>
    flatten(shallow?: boolean): /* this */ Iterable<any, any>
    flatMap<MK, MV>(
      mapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => Iterable<MK, MV>,
      context?: any
    ): /* this */ Iterable<MK, MV>
    flatMap<MK, MV>(
      mapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => /* iterable-like */ any,
      context?: any
    ): /* this */ Iterable<MK, MV>
    reduce<R>(
      reducer: (
        reduction?: R,
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => R,
      initialReduction?: R,
      context?: any
    ): R
    reduceRight<R>(
      reducer: (
        reduction?: R,
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => R,
      initialReduction?: R,
      context?: any
    ): R
    every(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): boolean
    some(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): boolean
    join(separator?: string): string
    isEmpty(): boolean
    count(): number
    count(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): number
    countBy<G>(
      grouper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => G,
      context?: any
    ): Map1<G, number>
    find(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any,
      notSetValue?: any
    ): any
    findLast(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any,
      notSetValue?: any
    ): any
    findEntry(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any,
      notSetValue?: any
    ): /* [any, any] */ Array<any>
    findLastEntry(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any,
      notSetValue?: any
    ): /* [any, any] */ Array<any>
    findKey(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable.Keyed<any, any>
      ) => boolean,
      context?: any
    ): any
    findLastKey(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable.Keyed<any, any>
      ) => boolean,
      context?: any
    ): any
    keyOf(searchValue: any): any
    lastKeyOf(searchValue: any): any
    max(comparator?: (valueA: any, valueB: any) => number): any
    maxBy<C>(
      comparatorValueMapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => C,
      comparator?: (valueA: C, valueB: C) => number
    ): any
    min(comparator?: (valueA: any, valueB: any) => number): any
    minBy<C>(
      comparatorValueMapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => C,
      comparator?: (valueA: C, valueB: C) => number
    ): any
    isSubset(iter: Iterable<any, any>): boolean
    isSubset(iter: Array<any>): boolean
    isSuperset(iter: Iterable<any, any>): boolean
    isSuperset(iter: Array<any>): boolean
    size: number

    // Indexed methods
    get(index: number, notSetValue?: any): any
    toSeq(): Seq.Indexed<any>
    fromEntrySeq(): Seq.Keyed<any, any>
    interpose(separator: any): /* this */ Iterable.Indexed<any>
    interleave(
      ...iterables: Array<Iterable<any, any>>
    ): /* this */ Iterable.Indexed<any>
    splice(
      index: number,
      removeNum: number,
      ...values: /* Array<Iterable.Indexed<any> | any> */ any[]
    ): /* this */ Iterable.Indexed<any>
    zip(
      ...iterables: Array<Iterable<any, any>>
    ): /* this */ Iterable.Indexed<any>
    zipWith<U, Z>(
      zipper: (value: any, otherValue: U) => Z,
      otherIterable: Iterable<any, U>
    ): Iterable.Indexed<Z>
    zipWith<U, V, Z>(
      zipper: (value: any, otherValue: U, thirdValue: V) => Z,
      otherIterable: Iterable<any, U>,
      thirdIterable: Iterable<any, V>
    ): Iterable.Indexed<Z>
    zipWith<Z>(
      zipper: (...any: Array<any>) => Z,
      ...iterables: Array<Iterable<any, any>>
    ): Iterable.Indexed<Z>
    indexOf(searchValue: any): number
    lastIndexOf(searchValue: any): number
    findIndex(
      predicate: (
        value?: any,
        index?: number,
        iter?: /* this */ Iterable.Indexed<any>
      ) => boolean,
      context?: any
    ): number
    findLastIndex(
      predicate: (
        value?: any,
        index?: number,
        iter?: /* this */ Iterable.Indexed<any>
      ) => boolean,
      context?: any
    ): number

    // Keyed Methods
    toSeq(): Seq.Keyed<any, any>
    flip(): /* this */ Iterable.Keyed<any, any>
    mapKeys<M>(
      mapper: (
        key?: any,
        value?: any,
        iter?: /* this */ Iterable.Keyed<any, any>
      ) => M,
      context?: any
    ): /* this */ Iterable.Keyed<any, any>
    mapEntries<KM, VM>(
      mapper: (
        entry?: /* (K, V) */ Array<any>,
        index?: number,
        iter?: /* this */ Iterable.Keyed<any, any>
      ) => /* [KM, VM] */ Array<any>,
      context?: any
    ): /* this */ Iterable.Keyed<KM, VM>

    // List Methods
    isList(maybeList: any): boolean
    of(...values: any[]): List1<any>
    set(index: number, value: any): List1<any>
    delete(index: number): List1<any>
    remove(index: number): List1<any>
    insert(index: number, value: any): List1<any>
    clear(): List1<any>
    push(...values: any[]): List1<any>
    pop(): List1<any>
    unshift(...values: any[]): List1<any>
    shift(): List1<any>
    update(updater: (value: List1<any>) => List1<any>): List1<any>
    update(index: number, updater: (value: any) => any): List1<any>
    update(
      index: number,
      notSetValue: any,
      updater: (value: any) => any
    ): List1<any>
    merge(...iterables: Iterable.Indexed<any>[]): List1<any>
    merge(...iterables: Array<any>[]): List1<any>
    mergeWith(
      merger: (previous?: any, next?: any, key?: number) => any,
      ...iterables: Iterable.Indexed<any>[]
    ): List1<any>
    mergeWith(
      merger: (previous?: any, next?: any, key?: number) => any,
      ...iterables: Array<any>[]
    ): List1<any>
    mergeDeep(...iterables: Iterable.Indexed<any>[]): List1<any>
    mergeDeep(...iterables: Array<any>[]): List1<any>
    mergeDeepWith(
      merger: (previous?: any, next?: any, key?: number) => any,
      ...iterables: Iterable.Indexed<any>[]
    ): List1<any>
    mergeDeepWith(
      merger: (previous?: any, next?: any, key?: number) => any,
      ...iterables: Array<any>[]
    ): List1<any>
    setSize(size: number): List1<any>
    setIn(keyPath: Array<any>, value: any): List1<any>
    setIn(keyPath: Iterable<any, any>, value: any): List1<any>
    deleteIn(keyPath: Array<any>): List1<any>
    deleteIn(keyPath: Iterable<any, any>): List1<any>
    removeIn(keyPath: Array<any>): List1<any>
    removeIn(keyPath: Iterable<any, any>): List1<any>
    updateIn(keyPath: Array<any>, updater: (value: any) => any): List1<any>
    updateIn(
      keyPath: Array<any>,
      notSetValue: any,
      updater: (value: any) => any
    ): List1<any>
    updateIn(
      keyPath: Iterable<any, any>,
      updater: (value: any) => any
    ): List1<any>
    updateIn(
      keyPath: Iterable<any, any>,
      notSetValue: any,
      updater: (value: any) => any
    ): List1<any>
    mergeIn(
      keyPath: Iterable<any, any>,
      ...iterables: Iterable.Indexed<any>[]
    ): List1<any>
    mergeIn(
      keyPath: Array<any>,
      ...iterables: Iterable.Indexed<any>[]
    ): List1<any>
    mergeIn(keyPath: Array<any>, ...iterables: Array<any>[]): List1<any>
    mergeDeepIn(
      keyPath: Iterable<any, any>,
      ...iterables: Iterable.Indexed<any>[]
    ): List1<any>
    mergeDeepIn(
      keyPath: Array<any>,
      ...iterables: Iterable.Indexed<any>[]
    ): List1<any>
    mergeDeepIn(keyPath: Array<any>, ...iterables: Array<any>[]): List1<any>
    withMutations(mutator: (mutable: List1<any>) => any): List1<any>
    asMutable(): List1<any>
    asImmutable(): List1<any>
  }

  export class Map<K, V> implements Map1<any, any> {
    // Iterable methods
    equals(other: Iterable<any, any>): boolean
    hashCode(): number
    get(key: any, notSetValue?: any): any
    has(key: any): boolean
    includes(value: any): boolean
    contains(value: any): boolean
    first(): any
    last(): any
    getIn(searchKeyPath: Array<any>, notSetValue?: any): any
    getIn(searchKeyPath: Iterable<any, any>, notSetValue?: any): any
    hasIn(searchKeyPath: Array<any>): boolean
    hasIn(searchKeyPath: Iterable<any, any>): boolean
    toJS(): any
    toArray(): Array<any>
    toObject(): { [key: string]: any }
    toMap(): Map1<any, any>
    toOrderedMap(): OrderedMap1<any, any>
    toSet(): Set1<any>
    toOrderedSet(): OrderedSet1<any>
    toList(): List1<any>
    toStack(): Stack1<any>
    toSeq(): Seq<any, any>
    toKeyedSeq(): Seq.Keyed<any, any>
    toIndexedSeq(): Seq.Indexed<any>
    toSetSeq(): Seq.Set<any>
    keys(): Iterator<any>
    values(): Iterator<any>
    entries(): Iterator</* [any, any] */ Array<any>>
    keySeq(): Seq.Indexed<any>
    valueSeq(): Seq.Indexed<any>
    entrySeq(): Seq.Indexed</* (any, any) */ Array<any>>
    map<M>(
      mapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => M,
      context?: any
    ): /* this */ Iterable<any, M>
    filter(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    filterNot(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    reverse(): /* this */ Iterable<any, any>
    sort(
      comparator?: (valueA: any, valueB: any) => number
    ): /* this */ Iterable<any, any>
    sortBy<C>(
      comparatorValueMapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => C,
      comparator?: (valueA: C, valueB: C) => number
    ): /* this */ Iterable<any, any>
    groupBy<G>(
      grouper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => G,
      context?: any
    ): /* Map */ Seq.Keyed<G, /* this */ Iterable<any, any>>
    forEach(
      sideEffect: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => any,
      context?: any
    ): number
    slice(begin?: number, end?: number): /* this */ Iterable<any, any>
    rest(): /* this */ Iterable<any, any>
    butLast(): /* this */ Iterable<any, any>
    skip(amount: number): /* this */ Iterable<any, any>
    skipLast(amount: number): /* this */ Iterable<any, any>
    skipWhile(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    skipUntil(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    take(amount: number): /* this */ Iterable<any, any>
    takeLast(amount: number): /* this */ Iterable<any, any>
    takeWhile(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    takeUntil(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    concat(
      ...valuesOrIterables: /* Array<Iterable<any, any>|any */ any[]
    ): /* this */ Iterable<any, any>
    flatten(depth?: number): /* this */ Iterable<any, any>
    flatten(shallow?: boolean): /* this */ Iterable<any, any>
    flatMap<MK, MV>(
      mapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => Iterable<MK, MV>,
      context?: any
    ): /* this */ Iterable<MK, MV>
    flatMap<MK, MV>(
      mapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => /* iterable-like */ any,
      context?: any
    ): /* this */ Iterable<MK, MV>
    reduce<R>(
      reducer: (
        reduction?: R,
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => R,
      initialReduction?: R,
      context?: any
    ): R
    reduceRight<R>(
      reducer: (
        reduction?: R,
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => R,
      initialReduction?: R,
      context?: any
    ): R
    every(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): boolean
    some(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): boolean
    join(separator?: string): string
    isEmpty(): boolean
    count(): number
    count(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): number
    countBy<G>(
      grouper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => G,
      context?: any
    ): Map1<G, number>
    find(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any,
      notSetValue?: any
    ): any
    findLast(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any,
      notSetValue?: any
    ): any
    findEntry(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any,
      notSetValue?: any
    ): /* [any, any] */ Array<any>
    findLastEntry(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any,
      notSetValue?: any
    ): /* [any, any] */ Array<any>
    findKey(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable.Keyed<any, any>
      ) => boolean,
      context?: any
    ): any
    findLastKey(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable.Keyed<any, any>
      ) => boolean,
      context?: any
    ): any
    keyOf(searchValue: any): any
    lastKeyOf(searchValue: any): any
    max(comparator?: (valueA: any, valueB: any) => number): any
    maxBy<C>(
      comparatorValueMapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => C,
      comparator?: (valueA: C, valueB: C) => number
    ): any
    min(comparator?: (valueA: any, valueB: any) => number): any
    minBy<C>(
      comparatorValueMapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => C,
      comparator?: (valueA: C, valueB: C) => number
    ): any
    isSubset(iter: Iterable<any, any>): boolean
    isSubset(iter: Array<any>): boolean
    isSuperset(iter: Iterable<any, any>): boolean
    isSuperset(iter: Array<any>): boolean
    size: number

    // Keyed Methods
    toSeq(): Seq.Keyed<any, any>
    flip(): /* this */ Iterable.Keyed<any, any>
    mapKeys<M>(
      mapper: (
        key?: any,
        value?: any,
        iter?: /* this */ Iterable.Keyed<any, any>
      ) => M,
      context?: any
    ): /* this */ Iterable.Keyed<any, any>
    mapEntries<KM, VM>(
      mapper: (
        entry?: /* (K, V) */ Array<any>,
        index?: number,
        iter?: /* this */ Iterable.Keyed<any, any>
      ) => /* [KM, VM] */ Array<any>,
      context?: any
    ): /* this */ Iterable.Keyed<KM, VM>

    // Map methods
    isMap(maybeMap: any): boolean
    of(...keyValues: any[]): Map1<any, any>
    set(key: any, value: any): Map1<any, any>
    delete(key: any): Map1<any, any>
    remove(key: any): Map1<any, any>
    clear(): Map1<any, any>
    update(updater: (value: Map1<any, any>) => Map1<any, any>): Map1<any, any>
    update(key: any, updater: (value: any) => any): Map1<any, any>
    update(
      key: any,
      notSetValue: any,
      updater: (value: any) => any
    ): Map1<any, any>
    merge(...iterables: Iterable<any, any>[]): Map1<any, any>
    merge(...iterables: { [key: string]: any }[]): Map1<string, any>
    mergeWith(
      merger: (previous?: any, next?: any, key?: any) => any,
      ...iterables: Iterable<any, any>[]
    ): Map1<any, any>
    mergeWith(
      merger: (previous?: any, next?: any, key?: any) => any,
      ...iterables: { [key: string]: any }[]
    ): Map1<string, any>
    mergeDeep(...iterables: Iterable<any, any>[]): Map1<any, any>
    mergeDeep(...iterables: { [key: string]: any }[]): Map1<string, any>
    mergeDeepWith(
      merger: (previous?: any, next?: any, key?: any) => any,
      ...iterables: Iterable<any, any>[]
    ): Map1<any, any>
    mergeDeepWith(
      merger: (previous?: any, next?: any, key?: any) => any,
      ...iterables: { [key: string]: any }[]
    ): Map1<string, any>
    setIn(keyPath: Array<any>, value: any): Map1<any, any>
    setIn(KeyPath: Iterable<any, any>, value: any): Map1<any, any>
    deleteIn(keyPath: Array<any>): Map1<any, any>
    deleteIn(keyPath: Iterable<any, any>): Map1<any, any>
    removeIn(keyPath: Array<any>): Map1<any, any>
    removeIn(keyPath: Iterable<any, any>): Map1<any, any>
    updateIn(keyPath: Array<any>, updater: (value: any) => any): Map1<any, any>
    updateIn(
      keyPath: Array<any>,
      notSetValue: any,
      updater: (value: any) => any
    ): Map1<any, any>
    updateIn(
      keyPath: Iterable<any, any>,
      updater: (value: any) => any
    ): Map1<any, any>
    updateIn(
      keyPath: Iterable<any, any>,
      notSetValue: any,
      updater: (value: any) => any
    ): Map1<any, any>
    mergeIn(
      keyPath: Iterable<any, any>,
      ...iterables: Iterable<any, any>[]
    ): Map1<any, any>
    mergeIn(
      keyPath: Array<any>,
      ...iterables: Iterable<any, any>[]
    ): Map1<any, any>
    mergeIn(
      keyPath: Array<any>,
      ...iterables: { [key: string]: any }[]
    ): Map1<string, any>
    mergeDeepIn(
      keyPath: Iterable<any, any>,
      ...iterables: Iterable<any, any>[]
    ): Map1<any, any>
    mergeDeepIn(
      keyPath: Array<any>,
      ...iterables: Iterable<any, any>[]
    ): Map1<any, any>
    mergeDeepIn(
      keyPath: Array<any>,
      ...iterables: { [key: string]: any }[]
    ): Map1<string, any>
    withMutations(mutator: (mutable: Map1<any, any>) => any): Map1<any, any>
    asMutable(): Map1<any, any>
    asImmutable(): Map1<any, any>
  }

  export class OrderedMap<K, V> implements OrderedMap1<any, any> {
    // Iterable methods
    equals(other: Iterable<any, any>): boolean
    hashCode(): number
    get(key: any, notSetValue?: any): any
    has(key: any): boolean
    includes(value: any): boolean
    contains(value: any): boolean
    first(): any
    last(): any
    getIn(searchKeyPath: Array<any>, notSetValue?: any): any
    getIn(searchKeyPath: Iterable<any, any>, notSetValue?: any): any
    hasIn(searchKeyPath: Array<any>): boolean
    hasIn(searchKeyPath: Iterable<any, any>): boolean
    toJS(): any
    toArray(): Array<any>
    toObject(): { [key: string]: any }
    toMap(): Map1<any, any>
    toOrderedMap(): OrderedMap1<any, any>
    toSet(): Set1<any>
    toOrderedSet(): OrderedSet1<any>
    toList(): List1<any>
    toStack(): Stack1<any>
    toSeq(): Seq<any, any>
    toKeyedSeq(): Seq.Keyed<any, any>
    toIndexedSeq(): Seq.Indexed<any>
    toSetSeq(): Seq.Set<any>
    keys(): Iterator<any>
    values(): Iterator<any>
    entries(): Iterator</* [any, any] */ Array<any>>
    keySeq(): Seq.Indexed<any>
    valueSeq(): Seq.Indexed<any>
    entrySeq(): Seq.Indexed</* (any, any) */ Array<any>>
    map<M>(
      mapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => M,
      context?: any
    ): /* this */ Iterable<any, M>
    filter(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    filterNot(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    reverse(): /* this */ Iterable<any, any>
    sort(
      comparator?: (valueA: any, valueB: any) => number
    ): /* this */ Iterable<any, any>
    sortBy<C>(
      comparatorValueMapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => C,
      comparator?: (valueA: C, valueB: C) => number
    ): /* this */ Iterable<any, any>
    groupBy<G>(
      grouper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => G,
      context?: any
    ): /* Map */ Seq.Keyed<G, /* this */ Iterable<any, any>>
    forEach(
      sideEffect: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => any,
      context?: any
    ): number
    slice(begin?: number, end?: number): /* this */ Iterable<any, any>
    rest(): /* this */ Iterable<any, any>
    butLast(): /* this */ Iterable<any, any>
    skip(amount: number): /* this */ Iterable<any, any>
    skipLast(amount: number): /* this */ Iterable<any, any>
    skipWhile(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    skipUntil(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    take(amount: number): /* this */ Iterable<any, any>
    takeLast(amount: number): /* this */ Iterable<any, any>
    takeWhile(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    takeUntil(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    concat(
      ...valuesOrIterables: /* Array<Iterable<any, any>|any */ any[]
    ): /* this */ Iterable<any, any>
    flatten(depth?: number): /* this */ Iterable<any, any>
    flatten(shallow?: boolean): /* this */ Iterable<any, any>
    flatMap<MK, MV>(
      mapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => Iterable<MK, MV>,
      context?: any
    ): /* this */ Iterable<MK, MV>
    flatMap<MK, MV>(
      mapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => /* iterable-like */ any,
      context?: any
    ): /* this */ Iterable<MK, MV>
    reduce<R>(
      reducer: (
        reduction?: R,
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => R,
      initialReduction?: R,
      context?: any
    ): R
    reduceRight<R>(
      reducer: (
        reduction?: R,
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => R,
      initialReduction?: R,
      context?: any
    ): R
    every(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): boolean
    some(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): boolean
    join(separator?: string): string
    isEmpty(): boolean
    count(): number
    count(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): number
    countBy<G>(
      grouper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => G,
      context?: any
    ): Map1<G, number>
    find(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any,
      notSetValue?: any
    ): any
    findLast(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any,
      notSetValue?: any
    ): any
    findEntry(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any,
      notSetValue?: any
    ): /* [any, any] */ Array<any>
    findLastEntry(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any,
      notSetValue?: any
    ): /* [any, any] */ Array<any>
    findKey(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable.Keyed<any, any>
      ) => boolean,
      context?: any
    ): any
    findLastKey(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable.Keyed<any, any>
      ) => boolean,
      context?: any
    ): any
    keyOf(searchValue: any): any
    lastKeyOf(searchValue: any): any
    max(comparator?: (valueA: any, valueB: any) => number): any
    maxBy<C>(
      comparatorValueMapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => C,
      comparator?: (valueA: C, valueB: C) => number
    ): any
    min(comparator?: (valueA: any, valueB: any) => number): any
    minBy<C>(
      comparatorValueMapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => C,
      comparator?: (valueA: C, valueB: C) => number
    ): any
    isSubset(iter: Iterable<any, any>): boolean
    isSubset(iter: Array<any>): boolean
    isSuperset(iter: Iterable<any, any>): boolean
    isSuperset(iter: Array<any>): boolean
    size: number

    // Keyed Methods
    toSeq(): Seq.Keyed<any, any>
    flip(): /* this */ Iterable.Keyed<any, any>
    mapKeys<M>(
      mapper: (
        key?: any,
        value?: any,
        iter?: /* this */ Iterable.Keyed<any, any>
      ) => M,
      context?: any
    ): /* this */ Iterable.Keyed<any, any>
    mapEntries<KM, VM>(
      mapper: (
        entry?: /* (K, V) */ Array<any>,
        index?: number,
        iter?: /* this */ Iterable.Keyed<any, any>
      ) => /* [KM, VM] */ Array<any>,
      context?: any
    ): /* this */ Iterable.Keyed<KM, VM>

    // Ordered map methods
    isOrderedMap(maybeOrderedMap: any): boolean

    // Map methods
    isMap(maybeMap: any): boolean
    of(...keyValues: any[]): Map1<any, any>
    set(key: any, value: any): Map1<any, any>
    delete(key: any): Map1<any, any>
    remove(key: any): Map1<any, any>
    clear(): Map1<any, any>
    update(updater: (value: Map1<any, any>) => Map1<any, any>): Map1<any, any>
    update(key: any, updater: (value: any) => any): Map1<any, any>
    update(
      key: any,
      notSetValue: any,
      updater: (value: any) => any
    ): Map1<any, any>
    merge(...iterables: Iterable<any, any>[]): Map1<any, any>
    merge(...iterables: { [key: string]: any }[]): Map1<string, any>
    mergeWith(
      merger: (previous?: any, next?: any, key?: any) => any,
      ...iterables: Iterable<any, any>[]
    ): Map1<any, any>
    mergeWith(
      merger: (previous?: any, next?: any, key?: any) => any,
      ...iterables: { [key: string]: any }[]
    ): Map1<string, any>
    mergeDeep(...iterables: Iterable<any, any>[]): Map1<any, any>
    mergeDeep(...iterables: { [key: string]: any }[]): Map1<string, any>
    mergeDeepWith(
      merger: (previous?: any, next?: any, key?: any) => any,
      ...iterables: Iterable<any, any>[]
    ): Map1<any, any>
    mergeDeepWith(
      merger: (previous?: any, next?: any, key?: any) => any,
      ...iterables: { [key: string]: any }[]
    ): Map1<string, any>
    setIn(keyPath: Array<any>, value: any): Map1<any, any>
    setIn(KeyPath: Iterable<any, any>, value: any): Map1<any, any>
    deleteIn(keyPath: Array<any>): Map1<any, any>
    deleteIn(keyPath: Iterable<any, any>): Map1<any, any>
    removeIn(keyPath: Array<any>): Map1<any, any>
    removeIn(keyPath: Iterable<any, any>): Map1<any, any>
    updateIn(keyPath: Array<any>, updater: (value: any) => any): Map1<any, any>
    updateIn(
      keyPath: Array<any>,
      notSetValue: any,
      updater: (value: any) => any
    ): Map1<any, any>
    updateIn(
      keyPath: Iterable<any, any>,
      updater: (value: any) => any
    ): Map1<any, any>
    updateIn(
      keyPath: Iterable<any, any>,
      notSetValue: any,
      updater: (value: any) => any
    ): Map1<any, any>
    mergeIn(
      keyPath: Iterable<any, any>,
      ...iterables: Iterable<any, any>[]
    ): Map1<any, any>
    mergeIn(
      keyPath: Array<any>,
      ...iterables: Iterable<any, any>[]
    ): Map1<any, any>
    mergeIn(
      keyPath: Array<any>,
      ...iterables: { [key: string]: any }[]
    ): Map1<string, any>
    mergeDeepIn(
      keyPath: Iterable<any, any>,
      ...iterables: Iterable<any, any>[]
    ): Map1<any, any>
    mergeDeepIn(
      keyPath: Array<any>,
      ...iterables: Iterable<any, any>[]
    ): Map1<any, any>
    mergeDeepIn(
      keyPath: Array<any>,
      ...iterables: { [key: string]: any }[]
    ): Map1<string, any>
    withMutations(mutator: (mutable: Map1<any, any>) => any): Map1<any, any>
    asMutable(): Map1<any, any>
    asImmutable(): Map1<any, any>
  }

  export class Set<T> implements Set1<any> {
    // Iterable methods
    equals(other: Iterable<any, any>): boolean
    hashCode(): number
    get(key: any, notSetValue?: any): any
    has(key: any): boolean
    includes(value: any): boolean
    contains(value: any): boolean
    first(): any
    last(): any
    getIn(searchKeyPath: Array<any>, notSetValue?: any): any
    getIn(searchKeyPath: Iterable<any, any>, notSetValue?: any): any
    hasIn(searchKeyPath: Array<any>): boolean
    hasIn(searchKeyPath: Iterable<any, any>): boolean
    toJS(): any
    toArray(): Array<any>
    toObject(): { [key: string]: any }
    toMap(): Map1<any, any>
    toOrderedMap(): OrderedMap1<any, any>
    toSet(): Set1<any>
    toOrderedSet(): OrderedSet1<any>
    toList(): List1<any>
    toStack(): Stack1<any>
    toSeq(): Seq<any, any>
    toKeyedSeq(): Seq.Keyed<any, any>
    toIndexedSeq(): Seq.Indexed<any>
    toSetSeq(): Seq.Set<any>
    keys(): Iterator<any>
    values(): Iterator<any>
    entries(): Iterator</* [any, any] */ Array<any>>
    keySeq(): Seq.Indexed<any>
    valueSeq(): Seq.Indexed<any>
    entrySeq(): Seq.Indexed</* (any, any) */ Array<any>>
    map<M>(
      mapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => M,
      context?: any
    ): /* this */ Iterable<any, M>
    filter(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    filterNot(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    reverse(): /* this */ Iterable<any, any>
    sort(
      comparator?: (valueA: any, valueB: any) => number
    ): /* this */ Iterable<any, any>
    sortBy<C>(
      comparatorValueMapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => C,
      comparator?: (valueA: C, valueB: C) => number
    ): /* this */ Iterable<any, any>
    groupBy<G>(
      grouper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => G,
      context?: any
    ): /* Map */ Seq.Keyed<G, /* this */ Iterable<any, any>>
    forEach(
      sideEffect: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => any,
      context?: any
    ): number
    slice(begin?: number, end?: number): /* this */ Iterable<any, any>
    rest(): /* this */ Iterable<any, any>
    butLast(): /* this */ Iterable<any, any>
    skip(amount: number): /* this */ Iterable<any, any>
    skipLast(amount: number): /* this */ Iterable<any, any>
    skipWhile(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    skipUntil(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    take(amount: number): /* this */ Iterable<any, any>
    takeLast(amount: number): /* this */ Iterable<any, any>
    takeWhile(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    takeUntil(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    concat(
      ...valuesOrIterables: /* Array<Iterable<any, any>|any */ any[]
    ): /* this */ Iterable<any, any>
    flatten(depth?: number): /* this */ Iterable<any, any>
    flatten(shallow?: boolean): /* this */ Iterable<any, any>
    flatMap<MK, MV>(
      mapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => Iterable<MK, MV>,
      context?: any
    ): /* this */ Iterable<MK, MV>
    flatMap<MK, MV>(
      mapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => /* iterable-like */ any,
      context?: any
    ): /* this */ Iterable<MK, MV>
    reduce<R>(
      reducer: (
        reduction?: R,
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => R,
      initialReduction?: R,
      context?: any
    ): R
    reduceRight<R>(
      reducer: (
        reduction?: R,
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => R,
      initialReduction?: R,
      context?: any
    ): R
    every(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): boolean
    some(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): boolean
    join(separator?: string): string
    isEmpty(): boolean
    count(): number
    count(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): number
    countBy<G>(
      grouper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => G,
      context?: any
    ): Map1<G, number>
    find(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any,
      notSetValue?: any
    ): any
    findLast(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any,
      notSetValue?: any
    ): any
    findEntry(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any,
      notSetValue?: any
    ): /* [any, any] */ Array<any>
    findLastEntry(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any,
      notSetValue?: any
    ): /* [any, any] */ Array<any>
    findKey(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable.Keyed<any, any>
      ) => boolean,
      context?: any
    ): any
    findLastKey(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable.Keyed<any, any>
      ) => boolean,
      context?: any
    ): any
    keyOf(searchValue: any): any
    lastKeyOf(searchValue: any): any
    max(comparator?: (valueA: any, valueB: any) => number): any
    maxBy<C>(
      comparatorValueMapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => C,
      comparator?: (valueA: C, valueB: C) => number
    ): any
    min(comparator?: (valueA: any, valueB: any) => number): any
    minBy<C>(
      comparatorValueMapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => C,
      comparator?: (valueA: C, valueB: C) => number
    ): any
    isSubset(iter: Iterable<any, any>): boolean
    isSubset(iter: Array<any>): boolean
    isSuperset(iter: Iterable<any, any>): boolean
    isSuperset(iter: Array<any>): boolean
    size: number

    // Indexed methods
    get(index: number, notSetValue?: any): any
    toSeq(): Seq.Indexed<any>
    fromEntrySeq(): Seq.Keyed<any, any>
    interpose(separator: any): /* this */ Iterable.Indexed<any>
    interleave(
      ...iterables: Array<Iterable<any, any>>
    ): /* this */ Iterable.Indexed<any>
    splice(
      index: number,
      removeNum: number,
      ...values: /* Array<Iterable.Indexed<any> | any> */ any[]
    ): /* this */ Iterable.Indexed<any>
    zip(
      ...iterables: Array<Iterable<any, any>>
    ): /* this */ Iterable.Indexed<any>
    zipWith<U, Z>(
      zipper: (value: any, otherValue: U) => Z,
      otherIterable: Iterable<any, U>
    ): Iterable.Indexed<Z>
    zipWith<U, V, Z>(
      zipper: (value: any, otherValue: U, thirdValue: V) => Z,
      otherIterable: Iterable<any, U>,
      thirdIterable: Iterable<any, V>
    ): Iterable.Indexed<Z>
    zipWith<Z>(
      zipper: (...any: Array<any>) => Z,
      ...iterables: Array<Iterable<any, any>>
    ): Iterable.Indexed<Z>
    indexOf(searchValue: any): number
    lastIndexOf(searchValue: any): number
    findIndex(
      predicate: (
        value?: any,
        index?: number,
        iter?: /* this */ Iterable.Indexed<any>
      ) => boolean,
      context?: any
    ): number
    findLastIndex(
      predicate: (
        value?: any,
        index?: number,
        iter?: /* this */ Iterable.Indexed<any>
      ) => boolean,
      context?: any
    ): number

    // Keyed Methods
    toSeq(): Seq.Keyed<any, any>
    flip(): /* this */ Iterable.Keyed<any, any>
    mapKeys<M>(
      mapper: (
        key?: any,
        value?: any,
        iter?: /* this */ Iterable.Keyed<any, any>
      ) => M,
      context?: any
    ): /* this */ Iterable.Keyed<any, any>
    mapEntries<KM, VM>(
      mapper: (
        entry?: /* (K, V) */ Array<any>,
        index?: number,
        iter?: /* this */ Iterable.Keyed<any, any>
      ) => /* [KM, VM] */ Array<any>,
      context?: any
    ): /* this */ Iterable.Keyed<KM, VM>

    // Set Methods
    isSet(maybeSet: any): boolean
    of(...values: any[]): Set1<any>
    fromKeys(iter: Iterable<any, any>): Set1<any>
    fromKeys(obj: { [key: string]: any }): Set1<string>
    add(value: any): Set1<any>
    delete(value: any): Set1<any>
    remove(value: any): Set1<any>
    clear(): Set1<any>
    union(...iterables: Iterable<any, any>[]): Set1<any>
    union(...iterables: Array<any>[]): Set1<any>
    merge(...iterables: Iterable<any, any>[]): Set1<any>
    merge(...iterables: Array<any>[]): Set1<any>
    intersect(...iterables: Iterable<any, any>[]): Set1<any>
    intersect(...iterables: Array<any>[]): Set1<any>
    subtract(...iterables: Iterable<any, any>[]): Set1<any>
    subtract(...iterables: Array<any>[]): Set1<any>
    withMutations(mutator: (mutable: Set1<any>) => any): Set1<any>
    asMutable(): Set1<any>
    asImmutable(): Set1<any>
  }

  export class OrderedSet<T> implements OrderedSet1<any> {
    // Iterable methods
    equals(other: Iterable<any, any>): boolean
    hashCode(): number
    get(key: any, notSetValue?: any): any
    has(key: any): boolean
    includes(value: any): boolean
    contains(value: any): boolean
    first(): any
    last(): any
    getIn(searchKeyPath: Array<any>, notSetValue?: any): any
    getIn(searchKeyPath: Iterable<any, any>, notSetValue?: any): any
    hasIn(searchKeyPath: Array<any>): boolean
    hasIn(searchKeyPath: Iterable<any, any>): boolean
    toJS(): any
    toArray(): Array<any>
    toObject(): { [key: string]: any }
    toMap(): Map1<any, any>
    toOrderedMap(): OrderedMap1<any, any>
    toSet(): Set1<any>
    toOrderedSet(): OrderedSet1<any>
    toList(): List1<any>
    toStack(): Stack1<any>
    toSeq(): Seq<any, any>
    toKeyedSeq(): Seq.Keyed<any, any>
    toIndexedSeq(): Seq.Indexed<any>
    toSetSeq(): Seq.Set<any>
    keys(): Iterator<any>
    values(): Iterator<any>
    entries(): Iterator</* [any, any] */ Array<any>>
    keySeq(): Seq.Indexed<any>
    valueSeq(): Seq.Indexed<any>
    entrySeq(): Seq.Indexed</* (any, any) */ Array<any>>
    map<M>(
      mapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => M,
      context?: any
    ): /* this */ Iterable<any, M>
    filter(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    filterNot(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    reverse(): /* this */ Iterable<any, any>
    sort(
      comparator?: (valueA: any, valueB: any) => number
    ): /* this */ Iterable<any, any>
    sortBy<C>(
      comparatorValueMapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => C,
      comparator?: (valueA: C, valueB: C) => number
    ): /* this */ Iterable<any, any>
    groupBy<G>(
      grouper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => G,
      context?: any
    ): /* Map */ Seq.Keyed<G, /* this */ Iterable<any, any>>
    forEach(
      sideEffect: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => any,
      context?: any
    ): number
    slice(begin?: number, end?: number): /* this */ Iterable<any, any>
    rest(): /* this */ Iterable<any, any>
    butLast(): /* this */ Iterable<any, any>
    skip(amount: number): /* this */ Iterable<any, any>
    skipLast(amount: number): /* this */ Iterable<any, any>
    skipWhile(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    skipUntil(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    take(amount: number): /* this */ Iterable<any, any>
    takeLast(amount: number): /* this */ Iterable<any, any>
    takeWhile(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    takeUntil(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    concat(
      ...valuesOrIterables: /* Array<Iterable<any, any>|any */ any[]
    ): /* this */ Iterable<any, any>
    flatten(depth?: number): /* this */ Iterable<any, any>
    flatten(shallow?: boolean): /* this */ Iterable<any, any>
    flatMap<MK, MV>(
      mapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => Iterable<MK, MV>,
      context?: any
    ): /* this */ Iterable<MK, MV>
    flatMap<MK, MV>(
      mapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => /* iterable-like */ any,
      context?: any
    ): /* this */ Iterable<MK, MV>
    reduce<R>(
      reducer: (
        reduction?: R,
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => R,
      initialReduction?: R,
      context?: any
    ): R
    reduceRight<R>(
      reducer: (
        reduction?: R,
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => R,
      initialReduction?: R,
      context?: any
    ): R
    every(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): boolean
    some(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): boolean
    join(separator?: string): string
    isEmpty(): boolean
    count(): number
    count(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): number
    countBy<G>(
      grouper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => G,
      context?: any
    ): Map1<G, number>
    find(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any,
      notSetValue?: any
    ): any
    findLast(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any,
      notSetValue?: any
    ): any
    findEntry(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any,
      notSetValue?: any
    ): /* [any, any] */ Array<any>
    findLastEntry(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any,
      notSetValue?: any
    ): /* [any, any] */ Array<any>
    findKey(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable.Keyed<any, any>
      ) => boolean,
      context?: any
    ): any
    findLastKey(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable.Keyed<any, any>
      ) => boolean,
      context?: any
    ): any
    keyOf(searchValue: any): any
    lastKeyOf(searchValue: any): any
    max(comparator?: (valueA: any, valueB: any) => number): any
    maxBy<C>(
      comparatorValueMapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => C,
      comparator?: (valueA: C, valueB: C) => number
    ): any
    min(comparator?: (valueA: any, valueB: any) => number): any
    minBy<C>(
      comparatorValueMapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => C,
      comparator?: (valueA: C, valueB: C) => number
    ): any
    isSubset(iter: Iterable<any, any>): boolean
    isSubset(iter: Array<any>): boolean
    isSuperset(iter: Iterable<any, any>): boolean
    isSuperset(iter: Array<any>): boolean
    size: number

    // Indexed methods
    get(index: number, notSetValue?: any): any
    toSeq(): Seq.Indexed<any>
    fromEntrySeq(): Seq.Keyed<any, any>
    interpose(separator: any): /* this */ Iterable.Indexed<any>
    interleave(
      ...iterables: Array<Iterable<any, any>>
    ): /* this */ Iterable.Indexed<any>
    splice(
      index: number,
      removeNum: number,
      ...values: /* Array<Iterable.Indexed<any> | any> */ any[]
    ): /* this */ Iterable.Indexed<any>
    zip(
      ...iterables: Array<Iterable<any, any>>
    ): /* this */ Iterable.Indexed<any>
    zipWith<U, Z>(
      zipper: (value: any, otherValue: U) => Z,
      otherIterable: Iterable<any, U>
    ): Iterable.Indexed<Z>
    zipWith<U, V, Z>(
      zipper: (value: any, otherValue: U, thirdValue: V) => Z,
      otherIterable: Iterable<any, U>,
      thirdIterable: Iterable<any, V>
    ): Iterable.Indexed<Z>
    zipWith<Z>(
      zipper: (...any: Array<any>) => Z,
      ...iterables: Array<Iterable<any, any>>
    ): Iterable.Indexed<Z>
    indexOf(searchValue: any): number
    lastIndexOf(searchValue: any): number
    findIndex(
      predicate: (
        value?: any,
        index?: number,
        iter?: /* this */ Iterable.Indexed<any>
      ) => boolean,
      context?: any
    ): number
    findLastIndex(
      predicate: (
        value?: any,
        index?: number,
        iter?: /* this */ Iterable.Indexed<any>
      ) => boolean,
      context?: any
    ): number

    // Keyed Methods
    toSeq(): Seq.Keyed<any, any>
    flip(): /* this */ Iterable.Keyed<any, any>
    mapKeys<M>(
      mapper: (
        key?: any,
        value?: any,
        iter?: /* this */ Iterable.Keyed<any, any>
      ) => M,
      context?: any
    ): /* this */ Iterable.Keyed<any, any>
    mapEntries<KM, VM>(
      mapper: (
        entry?: /* (K, V) */ Array<any>,
        index?: number,
        iter?: /* this */ Iterable.Keyed<any, any>
      ) => /* [KM, VM] */ Array<any>,
      context?: any
    ): /* this */ Iterable.Keyed<KM, VM>

    // OrderedSet Methods
    isOrderedSet(maybeOrderedSet: any): boolean
    of(...values: any[]): OrderedSet1<any>
    fromKeys(iter: Iterable<any, any>): OrderedSet1<any>
    fromKeys(obj: { [key: string]: any }): OrderedSet1<string>
    add(value: any): OrderedSet1<any>
    delete(value: any): OrderedSet1<any>
    remove(value: any): OrderedSet1<any>
    clear(): OrderedSet1<any>
    union(...iterables: Iterable<any, any>[]): OrderedSet1<any>
    union(...iterables: Array<any>[]): OrderedSet1<any>
    merge(...iterables: Iterable<any, any>[]): OrderedSet1<any>
    merge(...iterables: Array<any>[]): OrderedSet1<any>
    intersect(...iterables: Iterable<any, any>[]): OrderedSet1<any>
    intersect(...iterables: Array<any>[]): OrderedSet1<any>
    subtract(...iterables: Iterable<any, any>[]): OrderedSet1<any>
    subtract(...iterables: Array<any>[]): OrderedSet1<any>
    withMutations(mutator: (mutable: OrderedSet1<any>) => any): OrderedSet1<any>
    asMutable(): OrderedSet1<any>
    asImmutable(): OrderedSet1<any>
  }

  export class Stack<T> implements Stack1<any> {
    // Iterable methods
    equals(other: Iterable<any, any>): boolean
    hashCode(): number
    get(key: any, notSetValue?: any): any
    has(key: any): boolean
    includes(value: any): boolean
    contains(value: any): boolean
    first(): any
    last(): any
    getIn(searchKeyPath: Array<any>, notSetValue?: any): any
    getIn(searchKeyPath: Iterable<any, any>, notSetValue?: any): any
    hasIn(searchKeyPath: Array<any>): boolean
    hasIn(searchKeyPath: Iterable<any, any>): boolean
    toJS(): any
    toArray(): Array<any>
    toObject(): { [key: string]: any }
    toMap(): Map1<any, any>
    toOrderedMap(): OrderedMap1<any, any>
    toSet(): Set1<any>
    toOrderedSet(): OrderedSet1<any>
    toList(): List1<any>
    toStack(): Stack1<any>
    toSeq(): Seq<any, any>
    toKeyedSeq(): Seq.Keyed<any, any>
    toIndexedSeq(): Seq.Indexed<any>
    toSetSeq(): Seq.Set<any>
    keys(): Iterator<any>
    values(): Iterator<any>
    entries(): Iterator</* [any, any] */ Array<any>>
    keySeq(): Seq.Indexed<any>
    valueSeq(): Seq.Indexed<any>
    entrySeq(): Seq.Indexed</* (any, any) */ Array<any>>
    map<M>(
      mapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => M,
      context?: any
    ): /* this */ Iterable<any, M>
    filter(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    filterNot(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    reverse(): /* this */ Iterable<any, any>
    sort(
      comparator?: (valueA: any, valueB: any) => number
    ): /* this */ Iterable<any, any>
    sortBy<C>(
      comparatorValueMapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => C,
      comparator?: (valueA: C, valueB: C) => number
    ): /* this */ Iterable<any, any>
    groupBy<G>(
      grouper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => G,
      context?: any
    ): /* Map */ Seq.Keyed<G, /* this */ Iterable<any, any>>
    forEach(
      sideEffect: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => any,
      context?: any
    ): number
    slice(begin?: number, end?: number): /* this */ Iterable<any, any>
    rest(): /* this */ Iterable<any, any>
    butLast(): /* this */ Iterable<any, any>
    skip(amount: number): /* this */ Iterable<any, any>
    skipLast(amount: number): /* this */ Iterable<any, any>
    skipWhile(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    skipUntil(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    take(amount: number): /* this */ Iterable<any, any>
    takeLast(amount: number): /* this */ Iterable<any, any>
    takeWhile(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    takeUntil(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): /* this */ Iterable<any, any>
    concat(
      ...valuesOrIterables: /* Array<Iterable<any, any>|any */ any[]
    ): /* this */ Iterable<any, any>
    flatten(depth?: number): /* this */ Iterable<any, any>
    flatten(shallow?: boolean): /* this */ Iterable<any, any>
    flatMap<MK, MV>(
      mapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => Iterable<MK, MV>,
      context?: any
    ): /* this */ Iterable<MK, MV>
    flatMap<MK, MV>(
      mapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => /* iterable-like */ any,
      context?: any
    ): /* this */ Iterable<MK, MV>
    reduce<R>(
      reducer: (
        reduction?: R,
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => R,
      initialReduction?: R,
      context?: any
    ): R
    reduceRight<R>(
      reducer: (
        reduction?: R,
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => R,
      initialReduction?: R,
      context?: any
    ): R
    every(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): boolean
    some(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): boolean
    join(separator?: string): string
    isEmpty(): boolean
    count(): number
    count(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any
    ): number
    countBy<G>(
      grouper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => G,
      context?: any
    ): Map1<G, number>
    find(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any,
      notSetValue?: any
    ): any
    findLast(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any,
      notSetValue?: any
    ): any
    findEntry(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any,
      notSetValue?: any
    ): /* [any, any] */ Array<any>
    findLastEntry(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => boolean,
      context?: any,
      notSetValue?: any
    ): /* [any, any] */ Array<any>
    findKey(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable.Keyed<any, any>
      ) => boolean,
      context?: any
    ): any
    findLastKey(
      predicate: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable.Keyed<any, any>
      ) => boolean,
      context?: any
    ): any
    keyOf(searchValue: any): any
    lastKeyOf(searchValue: any): any
    max(comparator?: (valueA: any, valueB: any) => number): any
    maxBy<C>(
      comparatorValueMapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => C,
      comparator?: (valueA: C, valueB: C) => number
    ): any
    min(comparator?: (valueA: any, valueB: any) => number): any
    minBy<C>(
      comparatorValueMapper: (
        value?: any,
        key?: any,
        iter?: /* this */ Iterable<any, any>
      ) => C,
      comparator?: (valueA: C, valueB: C) => number
    ): any
    isSubset(iter: Iterable<any, any>): boolean
    isSubset(iter: Array<any>): boolean
    isSuperset(iter: Iterable<any, any>): boolean
    isSuperset(iter: Array<any>): boolean
    size: number

    // Indexed methods
    get(index: number, notSetValue?: any): any
    toSeq(): Seq.Indexed<any>
    fromEntrySeq(): Seq.Keyed<any, any>
    interpose(separator: any): /* this */ Iterable.Indexed<any>
    interleave(
      ...iterables: Array<Iterable<any, any>>
    ): /* this */ Iterable.Indexed<any>
    splice(
      index: number,
      removeNum: number,
      ...values: /* Array<Iterable.Indexed<any> | any> */ any[]
    ): /* this */ Iterable.Indexed<any>
    zip(
      ...iterables: Array<Iterable<any, any>>
    ): /* this */ Iterable.Indexed<any>
    zipWith<U, Z>(
      zipper: (value: any, otherValue: U) => Z,
      otherIterable: Iterable<any, U>
    ): Iterable.Indexed<Z>
    zipWith<U, V, Z>(
      zipper: (value: any, otherValue: U, thirdValue: V) => Z,
      otherIterable: Iterable<any, U>,
      thirdIterable: Iterable<any, V>
    ): Iterable.Indexed<Z>
    zipWith<Z>(
      zipper: (...any: Array<any>) => Z,
      ...iterables: Array<Iterable<any, any>>
    ): Iterable.Indexed<Z>
    indexOf(searchValue: any): number
    lastIndexOf(searchValue: any): number
    findIndex(
      predicate: (
        value?: any,
        index?: number,
        iter?: /* this */ Iterable.Indexed<any>
      ) => boolean,
      context?: any
    ): number
    findLastIndex(
      predicate: (
        value?: any,
        index?: number,
        iter?: /* this */ Iterable.Indexed<any>
      ) => boolean,
      context?: any
    ): number

    // Keyed Methods
    toSeq(): Seq.Keyed<any, any>
    flip(): /* this */ Iterable.Keyed<any, any>
    mapKeys<M>(
      mapper: (
        key?: any,
        value?: any,
        iter?: /* this */ Iterable.Keyed<any, any>
      ) => M,
      context?: any
    ): /* this */ Iterable.Keyed<any, any>
    mapEntries<KM, VM>(
      mapper: (
        entry?: /* (K, V) */ Array<any>,
        index?: number,
        iter?: /* this */ Iterable.Keyed<any, any>
      ) => /* [KM, VM] */ Array<any>,
      context?: any
    ): /* this */ Iterable.Keyed<KM, VM>

    // Stack Methods
    isStack(maybeStack: any): boolean
    of(...values: any[]): Stack1<any>
    peek(): any
    clear(): Stack1<any>
    unshift(...values: any[]): Stack1<any>
    unshiftAll(iter: Iterable<any, any>): Stack1<any>
    unshiftAll(iter: Array<any>): Stack1<any>
    shift(): Stack1<any>
    push(...values: any[]): Stack1<any>
    pushAll(iter: Iterable<any, any>): Stack1<any>
    pushAll(iter: Array<any>): Stack1<any>
    pop(): Stack1<any>
    withMutations(mutator: (mutable: Stack1<any>) => any): Stack1<any>
    asMutable(): Stack1<any>
    asImmutable(): Stack1<any>
  }
}
/* eslint-enable */
