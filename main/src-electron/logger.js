const Logger = {
  log: (msg, ...args) => {
    if (args === null || args === undefined || args.length === 0) {
      console.log(msg)
    } else {
      console.log(msg, args)
    }
  }
}

module.exports = { Logger }
