'use strict'

var assert = require('assert')

/**
 * A linked list.
 * @exports List
 * @constructor
 */

function List () {
  if (!(this instanceof List)) { return new List() }

  this.head = null
  this.tail = null
}

/**
 * Reset the cache. Clear all items.
 */

List.prototype.reset = function reset () {
  var item, next

  for (item = this.head; item; item = next) {
    next = item.next
    item.prev = null
    item.next = null
  }

  assert(!item)

  this.head = null
  this.tail = null
}

/**
 * Remove the first item in the list.
 */

List.prototype.shiftItem = function shiftItem () {
  var item = this.head

  if (!item) { return }

  this.removeItem(item)

  return item
}

/**
 * Prepend an item to the linked list (sets new head).
 * @private
 * @param {ListItem}
 */

List.prototype.unshiftItem = function unshiftItem (item) {
  this.insertItem(null, item)
}

/**
 * Append an item to the linked list (sets new tail).
 * @private
 * @param {ListItem}
 */

List.prototype.pushItem = function pushItem (item) {
  this.insertItem(this.tail, item)
}

/**
 * Remove the last item in the list.
 */

List.prototype.popItem = function popItem () {
  var item = this.tail

  if (!item) { return }

  this.removeItem(item)

  return item
}

/**
 * Remove the first item in the list.
 */

List.prototype.shift = function shift () {
  var item = this.shiftItem()
  if (!item) { return }
  return item.value
}

/**
 * Prepend an item to the linked list (sets new head).
 * @private
 * @param {ListItem}
 */

List.prototype.unshift = function unshift (value) {
  var item = new ListItem(value)
  this.unshiftItem(item)
  return item
}

/**
 * Append an item to the linked list (sets new tail).
 * @private
 * @param {ListItem}
 */

List.prototype.push = function push (value) {
  var item = new ListItem(value)
  this.pushItem(item)
  return item
}

/**
 * Remove the last item in the list.
 */

List.prototype.pop = function pop () {
  var item = this.popItem()
  if (!item) { return }
  return item.value
}

/**
 * Insert item into the linked list.
 * @private
 * @param {ListItem|null} ref
 * @param {ListItem} item
 */

List.prototype.insertItem = function insertItem (ref, item) {
  assert(!item.next)
  assert(!item.prev)

  if (ref == null) {
    if (!this.head) {
      this.head = item
      this.tail = item
    } else {
      this.head.prev = item
      item.next = this.head
      this.head = item
    }
    return
  }

  item.next = ref.next
  item.prev = ref
  ref.next = item

  if (ref === this.tail) { this.tail = item }
}

/**
 * Remove item from the linked list.
 * @private
 * @param {ListItem}
 */

List.prototype.removeItem = function removeItem (item) {
  if (item.prev) { item.prev.next = item.next }

  if (item.next) { item.next.prev = item.prev }

  if (item === this.head) { this.head = item.next }

  if (item === this.tail) { this.tail = item.prev || this.head }

  if (!this.head) { assert(!this.tail) }

  if (!this.tail) { assert(!this.head) }

  item.prev = null
  item.next = null
}

/**
 * Convert the list to an array of items.
 * @returns {Object[]}
 */

List.prototype.toArray = function toArray () {
  var items = []
  var item

  for (item = this.head; item; item = item.next) { items.push(item.value) }

  return items
}

/**
 * Get the list size.
 * @returns {Number}
 */

List.prototype.size = function size () {
  var total = 0
  var item

  for (item = this.head; item; item = item.next) { total += 1 }

  return total
}

/**
 * Represents an LRU item.
 * @constructor
 * @private
 * @param {String} key
 * @param {Object} value
 */

function ListItem (value) {
  this.value = value
  this.next = null
  this.prev = null
}

/*
 * Expose
 */

module.exports = List
