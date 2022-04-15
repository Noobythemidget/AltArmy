const { BaseTable, TYPE } = require('./base_table.js')

class DeletedCharacters extends BaseTable {
  /**
   *
   * @param {*} db
   */
  constructor (db) {
    super(db, 'deleted_characters', TYPE.TABLE)
  }

  /**
   * This object contains all the sql statements for the characters table
   */

  sql = {

    create: `   CREATE TABLE IF NOT EXISTS deleted_characters (
                    name            TEXT NOT NULL,
                    account         TEXT NOT NULL,
                    server          TEXT NOT NULL,
                    last_updated    TEXT NOT NULL,
                    PRIMARY KEY (name, account, server)
                );`,

    insert: `   INSERT OR REPLACE INTO deleted_characters (
                    name,
                    account,
                    server, 
                    last_updated
                ) 
                SELECT
                    c.name,
                    c.account,
                    c.server,
                    c.last_updated
                FROM characters AS c
                WHERE 
                    c.name    = ?  AND 
                    c.account = ?  AND 
                    c.server  = ?;`,

    select: `   SELECT 
                    last_updated 
                FROM 
                    deleted_characters 
                WHERE 
                    name    = ? AND
                    account = ? AND
                    server  = ?;`,

    delete: `   DELETE FROM deleted_characters 
                WHERE 
                    name    = ? AND
                    account = ? AND
                    server  = ?;`
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
   * @param {*} name
   * @param {*} account
   * @param {*} server
   * @returns
   */
  add (name, account, server) {
    return this.runSql(this.sql.insert, name, account, server)
  }

  /**
   *
   * @param {*} name
   * @param {*} account
   * @param {*} server
   */
  delete (name, account, server) {
    return this.runSql(this.sql.delete, name, account, server)
  }
}

module.exports = { DeletedCharacters }
