const { BaseTable, TYPE } = require('./base_table.js')

class AccountNotes extends BaseTable {
  /**
   *
   * @param {*} db
   */
  constructor (db) {
    super(db, 'account_notes', TYPE.TABLE)
  }

  /**
   * This object contains all the sql statements for the characters table
   */

  sql = {

    create: `   CREATE TABLE IF NOT EXISTS account_notes (
                    id            INTEGER       PRIMARY KEY,
                    note          TEXT          NOT NULL,
                    timestamp     DATE          NOT NULL,
                    account_id    INTEGER       NOT NULL,
                    FOREIGN KEY   (account_id) 
                    REFERENCES    accounts (id) 
                      ON DELETE     CASCADE 
                      ON UPDATE     NO ACTION
                );`,

    insert: `   INSERT INTO account_notes (
                    note, 
                    timestamp, 
                    account_id
                ) VALUES (
                    ?, 
                    datetime('now'), 
                    ?
                );`,

    select: `   SELECT 
                    id, 
                    note, 
                    datetime(timestamp,'localtime') as timestamp, 
                    account_id 
                FROM 
                    account_notes 
                WHERE 
                    account_id = ?;`,

    update: `   UPDATE 
                    account_notes 
                SET 
                    note = ?, 
                    timestamp = datetime('now')
                WHERE 
                    id = ?;`,

    delete: `   DELETE FROM account_notes 
                WHERE id = ?;`

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
   * @param {*} note
   * @param {*} accountId
   * @returns
   */
  addAccountNote (note, accountId) {
    return this.runSql(this.sql.insert, note, accountId)
  }

  /**
   *
   * @param {*} id
   * @param {*} note
   * @returns
   */
  updateAccountNote (id, note) {
    return this.runSql(this.sql.update, note, id)
  }

  /**
   *
   * @param {*} id
   * @returns
   */
  deleteAccountNote (id) {
    return this.runSql(this.sql.delete, id)
  }

  /**
   *
   * @param {*} accountId
   * @returns
   */
  getAccountNotes (accountId) {
    return this.allSql(this.sql.select, accountId)
  }
}

module.exports = { AccountNotes }
