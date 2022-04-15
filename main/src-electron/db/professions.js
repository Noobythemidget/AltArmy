const { BaseTable, TYPE } = require('./base_table.js')

class Professions extends BaseTable {
  /**
   *
   * @param {*} db
   */
  constructor (db) {
    super(db, 'professions', TYPE.TABLE)
  }

  /**
   * This object contains all the sql statements for the characters table
   */
  sql = {
    create: `CREATE TABLE IF NOT EXISTS professions (
                name                    TEXT    NOT NULL,
                proficiency_name        TEXT    NOT NULL,
                proficiency_title       TEXT    NOT NULL,
                proficiency_level       INTEGER NOT NULL,
                proficiency_exp         INTEGER NOT NULL,
                proficiency_exp_target  INTEGER NOT NULL,
                mastery_name            TEXT    NOT NULL,
                mastery_title           TEXT    NOT NULL,
                mastery_level           INTEGER NOT NULL,
                mastery_exp             INTEGER NOT NULL,
                mastery_exp_target      INTEGER NOT NULL,
                sort_value              INTEGER NOT NULL,
                character_name          TEXT    NOT NULL,
                account                 TEXT    NOT NULL,
                server                  TEXT    NOT NULL,
                PRIMARY KEY(name, character_name, account, server),
                FOREIGN KEY(character_name, account, server)
                    REFERENCES characters (name, account, server)
                    ON DELETE CASCADE
                    ON UPDATE NO ACTION
                );`,

    insert: `INSERT OR IGNORE INTO professions (
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
            ) VALUES (
                ?, 
                ?, 
                ?, 
                ?, 
                ?, 
                ?, 
                ?, 
                ?, 
                ?, 
                ?, 
                ?, 
                ?, 
                ?, 
                ?, 
                ?
            );`,

    select: `SELECT 
                * 
            FROM professions 
            WHERE   character_name  = ? AND 
                    account         = ? AND 
                    server          = ? 
            ORDER BY sort_value ASC;`
  }

  /**
   *
   */
  async create () {
    await this.execSql(this.sql.create)
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
   * @param {*} characterObj
   */
  // add a profession entry to the table
  addProfession (characterObj) {
    const promiseArray = []
    if (characterObj.data.Crafting !== undefined && characterObj.data.Crafting.Professions !== undefined) {
      let sortValue = 1
      for (const professionName of Object.keys(characterObj.data.Crafting.Professions)) {
        const p = characterObj.data.Crafting.Professions[professionName]
        promiseArray.push(
          this.runSql(this.sql.insert,
            professionName, // name
            p.Proficiency.Name, // proficiency_name
            p.Proficiency.Title, // proficiency_title
            parseInt(p.Proficiency.Level), // proficiency_level
            parseInt(p.Proficiency.Exp), // proficiency_exp
            parseInt(p.Proficiency.ExpTarget), // proficiency_exp_target
            p.Mastery.Name, // mastery_name
            p.Mastery.Title, // mastery_title
            parseInt(p.Mastery.Level), // mastery_level
            parseInt(p.Mastery.Exp), // mastery_exp
            parseInt(p.Mastery.ExpTarget), // mastery_exp_target
            sortValue++,
            characterObj.name, // character_name
            characterObj.account,
            characterObj.server
          )
        )
      }
    }
    return Promise.all(promiseArray)
  }

  /**
   *
   * @param {*} characterName
   * @param {*} account
   * @param {*} server
   * @returns
   */
  // formerly getCharacterProfessions
  async getProfessions (characterName, account, server) {
    return await this.allSql(this.sql.select, characterName, account, server)
  }
}

module.exports = { Professions }
