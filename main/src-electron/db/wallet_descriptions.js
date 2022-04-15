const { BaseTable, TYPE, decodeUTF8 } = require('./base_table.js')

class WalletDescriptions extends BaseTable {
  /**
   *
   * @param {*} db
   */
  constructor (db) {
    super(db, 'wallet_descriptions', TYPE.TABLE)
  }

  /**
   * This object contains all the sql statements for the characters table
   */

  sql = {

    create: `   CREATE TABLE IF NOT EXISTS wallet_descriptions (
                    name        TEXT NOT NULL PRIMARY KEY,
                    description TEXT NOT NULL
                );`,

    insert: `   INSERT OR IGNORE INTO wallet_descriptions (
                    name, 
                    description
                ) VALUES (
                    ?, 
                    ?
                );`,

    select: `   SELECT * 
                FROM wallet_descriptions 
                WHERE name = ?;`

  }

  /**
   *
   * @returns
   */
  create () {
    return this.execSql(this.sql.create)
  }

  /**
   *
   */
  createSync () {
    this.execSqlSync(this.sql.create)
  }

  /// //////////////////////////////////////
  // helper methods
  /// //////////////////////////////////////

  /**
   *
   * @param {*} currencyName
   * @param {*} description
   * @returns
   */
  add (currencyName, description) {
    return this.runSql(this.sql.insert, decodeUTF8(currencyName), description)
  }
}

module.exports = { WalletDescriptions }
