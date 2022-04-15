const { Logger } = require('../logger.js')

/// //////////////
// Utility Function
/// //////////////

/**
 *
 * @param {*} input
 * @returns
 */
// reference: https://www.utf8-chartable.de/unicode-utf8-table.pl
// burgled from https://stackoverflow.com/questions/17057407/javascript-create-a-string-or-char-from-an-utf-8-value
function convertHexToString (input) {
  // split input into groups of two
  const hex = input.match(/[\s\S]{2}/g) || []
  let output = ''

  // build a hex-encoded representation of your string
  for (let i = 0, j = hex.length; i < j; i++) {
    output += '%' + ('0' + hex[i]).slice(-2)
  }

  // decode it using this trick
  output = decodeURIComponent(output)

  return output
}

/**
 *
 * @param {*} encodedString
 * @returns
 */
function decodeUTF8 (encodedString) {
  const replacer = (substr) => {
    const hexStr = substr.split(/([0-9]+)/).filter(e => !isNaN(e)).map(e => parseInt(e).toString(16)).join('')
    return convertHexToString(hexStr)
  }

  const regex = /(#[0-9]+#)+/g // matches the encoded UTF-8 strings '#195##128#...'
  const decodedStr = encodedString.replace(regex, replacer)
  return decodedStr.startsWith('#') ? decodedStr.substring(1) : decodedStr
}

/**
 *
 */
const TYPE = {
  TABLE: 'TABLE',
  VIEW: 'VIEW',
  TRIGGER: 'TRIGGER',
  NONE: 'NONE'
}

/**
 *
 */
class BaseTable {
  /**
   *
   * @param {*} db
   * @param {*} name
   * @param {*} type
   */
  constructor (db, name, type) {
    this.db = db
    this.name = name
    this.type = type

    console.log('constructing', name, type)
  }

  /**
   *
   * @returns
   */
  isNone () {
    return this.type === TYPE.NONE
  }

  /// //////////////////////////////////////////////////////////////////////////////////////////
  // Helper SQL Methods - all derived classes should call these instead of directly on this.db
  /// //////////////////////////////////////////////////////////////////////////////////////////

  /**
   *
   * @param {*} columnName
   * @param {*} sqlString
   * @param  {...any} args
   * @returns
   */
  async allSqlOneColumn (columnName, sqlString, ...args) {
    const rows = args.length > 0 ? await this.allSql(sqlString, args) : await this.allSql(sqlString)
    console.log(rows)
    return rows.map(r => {
      if (r[columnName] === undefined) {
        return null
      } else {
        return r[columnName]
      }
    })
  }

  /**
   *
   * @param {*} columnName
   * @param {*} sqlString
   * @param  {...any} args
   * @returns
   */
  async getSqlOneColumn (columnName, sqlString, ...args) {
    const row = args.length > 0 ? await this.allSql(sqlString, args) : await this.allSql(sqlString)
    console.log(row)
    if (row[columnName] === undefined) {
      return null
    } else {
      return row[columnName]
    }
  }

  /**
   *
   * @param {*} sqlString
   * @param  {...any} args
   * @returns
   */
  // #getAllRows
  allSql (sqlString, ...args) {
    return new Promise((resolve, reject) => {
      // db.all - Runs the SQL query with the specified parameters and calls the callback with all result rows afterwards.
      this.db.all(sqlString, args, (err, rows) => {
        if (err) {
          Logger.log('Error allSql')
          Logger.log(err, sqlString, args)
          reject(err)
        } else {
          // successful run
          resolve(rows)
        }
      })
    })
  }

  /**
   *
   * @param {*} sqlString
   * @param  {...any} args
   * @returns
   */
  // #getFirstRow
  getSql (sqlString, ...args) {
    return new Promise((resolve, reject) => {
      // db.get - Runs the SQL query with the specified parameters and calls the callback with the first result row afterwards.
      this.db.get(sqlString, args, (err, row) => {
        if (err) {
          Logger.log('Error getSql')
          Logger.log(err, sqlString, args)
          reject(err)
        } else {
          // successful run
          resolve(row)
        }
      })
    })
  }

  /**
   *
   * @param {*} sqlString
   * @returns
   */
  execSql (sqlString) {
    return new Promise((resolve, reject) => {
      // db.exec - Runs all SQL queries in the supplied string. No result rows are retrieved.
      this.db.exec(sqlString, (err) => {
        if (err) {
          Logger.log('Error execSql')
          Logger.log(err, sqlString)
          reject(err)
        } else {
          // successful run
          resolve()
        }
      })
    })
  }

  /**
   *
   * @param {*} sqlString
   */
  execSqlSync (sqlString) {
    // db.exec - Runs all SQL queries in the supplied string. No result rows are retrieved.
    this.db.exec(sqlString, (err) => {
      if (err) {
        Logger.log('Error execSqlSync')
        Logger.log(err, sqlString)
        throw err
      } else {
        // successful run
      }
    })
  }

  /**
   *
   * @param {*} sqlString
   * @param  {...any} args
   * @returns
   */
  runSql (sqlString, ...args) {
    return new Promise((resolve, reject) => {
      // db.run - Runs the SQL query with the specified parameters and calls the callback afterwards. It does not retrieve any result data.
      this.db.run(sqlString, args, (err) => {
        if (err) {
          Logger.log('Error runSql')
          Logger.log(err, sqlString, args)
          reject(new Error(err))
        } else {
          // successful run
          resolve()
        }
      })
    })
  }

  /**
   *
   * @param {*} sqlString
   * @param  {...any} args
   */
  runSqlSync (sqlString, ...args) {
    // db.run - Runs the SQL query with the specified parameters and calls the callback afterwards. It does not retrieve any result data.
    this.db.run(sqlString, args, (err) => {
      if (err) {
        Logger.log('Error runSqlSync')
        Logger.log(err, sqlString, args)
        throw new Error(err)
      } else {
        // successful run
      }
    })
  }

  /// /////////////////////////////////////////////////
  // Standard Methods - all Table classes should have
  /// /////////////////////////////////////////////////

  // sql = {
  //   create: 'placeholder - override this in derrived class'
  // }

  /**
   * Override this method in a derrived class
   */
  create () {
    // await this.execSql(this.sql.create) // <-- override the propertie sql.create in derrived class
  }

  /**
   * Override this method in a derrived class
   */
  createSync () {
    // this.execSqlSync(this.sql.create) // <-- override the propertie sql.create in derrived class
  }

  async exists () {
    const sqlStmt = ` SELECT EXISTS (
                        SELECT *
                        FROM sqlite_schema
                        WHERE type    =   '` + this.type.toLowerCase() + `' 
                              AND 
                              name    =   '` + this.name + `'
                      );`

    const row = await this.getSql(sqlStmt)
    return row[0] === 1
  }

  /**
   *
   * @returns
   */
  selectAll () {
    const sqlStmt = 'SELECT * FROM ' + this.name + ';'
    return this.allSql(sqlStmt)
  }

  /**
   *
   * @returns
   */
  deleteAll () {
    const sqlStmt = 'DELETE FROM ' + this.name + ';'
    return this.execSql(sqlStmt)
  }

  /**
   *
   */
  deleteAllSync () {
    const sqlStmt = 'DELETE FROM ' + this.name + ';'
    this.execSqlSync(sqlStmt)
  }

  /**
   *
   * @returns
   */
  drop () {
    const sqlStmt = 'DROP ' + this.type + ' IF EXISTS ' + this.name + ';'
    return this.execSql(sqlStmt)
  }

  /**
   *
   */
  dropSync () {
    const sqlStmt = 'DROP ' + this.type + ' IF EXISTS ' + this.name + ';'
    this.execSqlSync(sqlStmt)
  }
}

module.exports = { BaseTable, Logger, TYPE, convertHexToString, decodeUTF8 }
