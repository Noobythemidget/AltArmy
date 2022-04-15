const { BaseTable, TYPE } = require('./base_table.js')

class ProfessionsView extends BaseTable {
  /**
   *
   * @param {*} db
   */
  constructor (db) {
    super(db, 'professions_view', TYPE.VIEW)
  }

  /**
   * This object contains all the sql statements for the characters table
   */
  sql = {

    create: `   CREATE VIEW IF NOT EXISTS professions_view (
                    id, 
                    name,
                    proficiency_name, 
                    proficiency_title, 
                    proficiency_level, 
                    proficiency_exp, 
                    proficiency_exp_target,
                    mastery_name, 
                    mastery_title, 
                    mastery_level, 
                    mastery_exp, 
                    mastery_exp_target,
                    sort_value, 
                    character_name, 
                    account, 
                    server
                )
                AS
                SELECT 
                    p.id, 
                    p.name,
                    p.proficiency_name, 
                    p.proficiency_title, 
                    p.proficiency_level, 
                    p.proficiency_exp, 
                    p.proficiency_exp_target,
                    p.mastery_name, 
                    p.mastery_title, 
                    p.mastery_level, 
                    p.mastery_exp, 
                    p.mastery_exp_target,
                    p.sort_value, 
                    c.name, 
                    c.account, 
                    c.server
                FROM 
                    professions AS p, 
                    characters_view AS c
                WHERE 
                    p.character_name    =   c.name      AND 
                    p.account           =   c.account   AND 
                    p.server            =   c.server;`,

    select_by_account: `    SELECT
                                *
                            FROM
                                characters_view
                            WHERE
                                account = ?;`,

    select_by_server: `     SELECT
                                *
                            FROM
                                characters_view
                            WHERE
                                server = ?;`
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
}

module.exports = { ProfessionsView }
