export function TCP () {
  if (!(this instanceof TCP)) { return new TCP() }

  this.messages = []
}

TCP.prototype.connectToNode = function (node, onConnect, onData, onClose) {
  this.onConnect = onConnect
  this.onData = onData
  this.onClose = onClose

  onConnect()
}

TCP.prototype.sendToNode = function (node, data) {
  this.messages.push(data)
}
