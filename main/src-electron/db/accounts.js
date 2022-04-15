const { BaseTable, TYPE } = require('./base_table.js')

class Accounts extends BaseTable {
  /**
   *
   * @param {*} db
   */
  constructor (db) {
    super(db, 'accounts', TYPE.TABLE)
  }

  /**
   * This object contains all the sql statements for the characters table
   */

  sql = {
    create: `               CREATE TABLE IF NOT EXISTS accounts (
                                id             INTEGER   PRIMARY KEY           ,
                                name           TEXT      UNIQUE        NOT NULL,
                                lotro_points   INTEGER   DEFAULT       0
                            );`,

    insert: `               INSERT OR REPLACE INTO accounts (
                                name
                            ) VALUES (
                                ?
                            );`,

    update_by_id: `         UPDATE accounts 
                            SET   lotro_points  = ? 
                            WHERE id            = ?;`,

    update_by_account: `    UPDATE accounts 
                            SET   lotro_points  = ? 
                            WHERE account       = ?;`,

    select: `               SELECT
                                id,
                                name,
                                lotro_points,
                                '[' || group_concat(json) || ']' as characters_json
                            FROM
                                (
                                    SELECT 
                                        a.id,
                                        a.name,
                                        a.lotro_points,
                                        json_object(  'server'      , c.server,
                                                        'characters'  , json_group_array(c.name)  ) as json
                                    FROM 
                                      accounts AS a, 
                                      characters AS c
                                    WHERE 
                                      c.account = a.name
                                    GROUP BY
                                      a.name,
                                      c.server
                                    ORDER BY
                                      a.name,
                                      c.server,
                                      c.name
                                )
                            WHERE name  = ?
                            GROUP BY
                                name
                            ORDER BY name ASC;`,

    selectall: `            SELECT
                                id,
                                name,
                                lotro_points,
                                '[' || group_concat(json) || ']' as characters_json
                            FROM
                                (
                                    SELECT 
                                        a.id,
                                        a.name,
                                        a.lotro_points,
                                        json_object(  'server'      , c.server,
                                                        'characters'  , json_group_array(c.name)  ) as json
                                    FROM 
                                        accounts AS a, 
                                        characters AS c
                                    WHERE 
                                        c.account = a.name
                                    GROUP BY
                                        a.name,
                                        c.server
                                    ORDER BY
                                        a.name,
                                        c.server,
                                        c.name
                                )
                            GROUP BY
                                name
                            ORDER BY name ASC;`

  }

  /**
   *
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
   * @param {*} account
   * @returns
   */
  add (account) {
    return this.runSql(this.sql.insert, account)
  }

  /**
   *
   * @param {*} accountId
   * @param {*} lotroPoints
   * @returns
   */
  updateAccountLotroPoints (accountId, lotroPoints) {
    return this.runSql(this.sql.update_by_id, lotroPoints, accountId)
  }

  /**
   *
   * @returns
   */
  getAccountsTable () {
    return this.allSql(this.sql.selectall)
  }
}

module.exports = { Accounts }
