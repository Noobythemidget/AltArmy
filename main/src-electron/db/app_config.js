const { BaseTable, TYPE } = require('./base_table.js')

class AppConfig extends BaseTable {
  /**
   *
   * @param {*} db
   */
  constructor (db) {
    super(db, 'app_config', TYPE.TABLE)
  }

  /**
   * This object contains all the sql statements for the characters table
   */

  sql = {

    create: `   CREATE TABLE IF NOT EXISTS app_config (
                    key         TEXT PRIMARY KEY  NOT NULL,
                    value       TEXT              NOT NULL
                );`,

    insert: `   INSERT INTO app_config (
                  key, 
                  value
                ) VALUES (
                  $key,
                  $value
                )
                ON CONFLICT (key) 
                DO UPDATE SET value = $value;`,

    select: `   SELECT 
                    value 
                FROM 
                    app_config 
                WHERE 
                    key = ?;`,

    update: `   UPDATE 
                    app_config 
                SET 
                    value = ?, 
                WHERE 
                    key = ?;`,

    has: `      SELECT 
                  COUNT(*)
                FROM 
                  app_config
                WHERE 
                  key = ?;`,

    delete: `   DELETE FROM app_config 
                WHERE key = ?;`

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
   * @param {*} key
   * @param {*} value
   * @returns
   */
  setProperty (key, value) {
    const param = {
      $key: key,
      $value: value
    }
    return this.runSql(this.sql.insert, param)
  }

  /**
   *
   * @param {*} key
   * @returns
   */
  getProperty (key) {
    return this.getSql()
  }

  /**
   *
   * @param {*} key
   * @returns
   */
  async hasProperty (key) {
    const row = await this.getSql(this.sql.has, key)
    return row[0] === 1
  }

  /**
   *
   * @param {*} key
   * @returns
   */
  removeProperty (key) {
    return this.runSql(this.sql.delete, key)
  }
}

module.exports = { AppConfig }
