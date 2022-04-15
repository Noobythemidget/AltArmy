// const enabled = true

class Logger {
  static log (msg, ...args) {
    if (args === null || args === undefined || args.length === 0) {
      console.log(msg, args)
    } else {
      console.log(msg)
    }
  }
}

module.exports = { Logger }
