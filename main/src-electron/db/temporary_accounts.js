const { BaseTable, TYPE } = require('./base_table.js')

class TemporaryAccounts extends BaseTable {
  /**
   *
   * @param {*} db
   */
  constructor (db) {
    super(db, 'temporary_accounts', TYPE.TABLE)
  }

  /**
   * This object contains all the sql statements for the characters table
   */

  sql = {

    create: `           CREATE TABLE IF NOT EXISTS temporary_accounts (
                            id              INTEGER   PRIMARY KEY,
                            name            TEXT      NOT NULL,
                            lotro_points    INTEGER   NOT NULL
                        );`,

    insert: `           INSERT INTO temporary_accounts (
                            name, 
                            lotro_points
                        )
                        SELECT
                            name,
                            lotro_points
                        FROM 
                            accounts;`,

    update_accounts: `  UPDATE accounts
                        SET     
                            lotro_points  = t.lotro_points
                        FROM    
                            (SELECT lotro_points, name FROM temporary_accounts) AS t
                        WHERE
                            accounts.name = t.name;`

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
   * @returns
   */
  backup () {
    return this.execSql(this.sql.insert)
  }

  /**
   *
   */
  backupSync () {
    this.execSqlSync(this.sql.insert)
  }

  /**
   *
   * @returns
   */
  restore () {
    return this.execSql(this.sql.update_accounts)
  }

  /**
   *
   */
  restoreSync () {
    this.execSqlSync(this.sql.update_accounts)
  }
}

module.exports = { TemporaryAccounts }
