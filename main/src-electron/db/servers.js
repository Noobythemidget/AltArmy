const { BaseTable, TYPE } = require('./base_table.js')

class Servers extends BaseTable {
  /**
   *
   * @param {*} db
   */
  constructor (db) {
    super(db, 'servers', TYPE.TABLE)
  }

  /**
   * This object contains all the sql statements for the characters table
   */

  sql = {

    create: `       CREATE TABLE IF NOT EXISTS servers (
                        id      INTEGER PRIMARY KEY,
                        name    TEXT UNIQUE NOT NULL
                    );`,

    insert: `       INSERT OR REPLACE INTO servers (
                        name
                    ) VALUES (
                        ?
                    );`,

    select: `       SELECT
                        id,
                        name,
                        '[' || group_concat(json) || ']' as characters_json
                    FROM
                        (
                            SELECT 
                                s.id,
                                s.name, 
                                json_object(    'account'     , c.account,
                                                'characters'  , json_group_array(c.name)  ) as json
                            FROM 
                                servers AS s, 
                                characters AS c
                            WHERE 
                                c.server = s.name
                            GROUP BY
                                s.name,
                                c.account
                            ORDER BY
                                s.name,
                                c.account,
                                c.name
                        )
                        WHERE name = ?
                        GROUP BY
                            name
                        ORDER BY 
                            name ASC;`,

    selectall: `        SELECT
                            id,
                            name,
                            '[' || group_concat(json) || ']' as characters_json
                        FROM
                            (
                                SELECT 
                                    s.id,
                                    s.name, 
                                    json_object(    'account'     , c.account,
                                                    'characters'  , json_group_array(c.name)  ) as json
                                FROM 
                                    servers AS s, 
                                    characters AS c
                                WHERE 
                                    c.server = s.name
                                GROUP BY
                                    s.name,
                                    c.account
                                ORDER BY
                                    s.name,
                                    c.account,
                                    c.name
                            )
                            GROUP BY
                                name
                            ORDER BY 
                                name ASC;`
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
   * @param {*} server
   * @returns
   */
  add (server) {
    return this.runSql(this.sql.insert, server)
  }

  /**
   *
   * @returns
   */
  getServersTable () {
    return this.allSql(this.sql.selectall)
  }
}

module.exports = { Servers }
