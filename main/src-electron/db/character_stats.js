const { BaseTable, TYPE } = require('./base_table.js')

class CharacterStats extends BaseTable {
  /**
   *
   * @param {*} db
   */
  constructor (db) {
    super(db, 'character_stats', TYPE.TABLE)
  }

  /**
   * This object contains all the sql statements for the characters table
   */

  sql = {

    create: `   CREATE TABLE IF NOT EXISTS character_stats (
                    id                                      INTEGER PRIMARY KEY,

                    base_max_morale                         INTEGER DEFAULT 0,
                    base_max_power                          INTEGER DEFAULT 0,
                    base_armor                              INTEGER DEFAULT 0,
                    base_might                              INTEGER DEFAULT 0,
                    base_agility                            INTEGER DEFAULT 0,
                    base_vitality                           INTEGER DEFAULT 0,
                    base_will                               INTEGER DEFAULT 0,
                    base_fate                               INTEGER DEFAULT 0,

                    max_morale                              INTEGER DEFAULT 0,
                    max_power                               INTEGER DEFAULT 0,
                    armor                                   INTEGER DEFAULT 0,
                    might                                   INTEGER DEFAULT 0,
                    agility                                 INTEGER DEFAULT 0,
                    vitality                                INTEGER DEFAULT 0,
                    will                                    INTEGER DEFAULT 0,
                    fate                                    INTEGER DEFAULT 0,
                    
                    out_of_combat_morale_regeneration       INTEGER DEFAULT 0,
                    out_of_combat_power_regeneration        INTEGER DEFAULT 0,
                    in_combat_morale_regeneration           INTEGER DEFAULT 0,
                    in_combat_power_regeneration            INTEGER DEFAULT 0,

                    base_critical_hit_chance                INTEGER DEFAULT 0,
                    melee_critical_hit_chance               INTEGER DEFAULT 0,
                    range_critical_hit_chance               INTEGER DEFAULT 0,
                    tactical_critical_hit_chance            INTEGER DEFAULT 0,

                    finesse                                 INTEGER DEFAULT 0,

                    melee_damage                            INTEGER DEFAULT 0,
                    range_damage                            INTEGER DEFAULT 0,
                    tactical_damage                         INTEGER DEFAULT 0,

                    base_resistance                         INTEGER DEFAULT 0,
                    wound_resistance                        INTEGER DEFAULT 0,
                    poison_resistance                       INTEGER DEFAULT 0,
                    fear_resistance                         INTEGER DEFAULT 0,
                    disease_resistance                      INTEGER DEFAULT 0,

                    base_critical_hit_avoidance             INTEGER DEFAULT 0,
                    melee_critical_hit_avoidance            INTEGER DEFAULT 0,
                    range_critical_hit_avoidance            INTEGER DEFAULT 0,
                    tactical_critical_hit_avoidance         INTEGER DEFAULT 0,

                    melee_defence                           INTEGER DEFAULT 0,
                    range_defence                           INTEGER DEFAULT 0,
                    tactical_defence                        INTEGER DEFAULT 0,

                    incoming_healing                        INTEGER DEFAULT 0,
                    outgoing_healing                        INTEGER DEFAULT 0,

                    block                                   INTEGER DEFAULT 0,
                    parry                                   INTEGER DEFAULT 0,
                    evade                                   INTEGER DEFAULT 0,

                    common_mitigation                       INTEGER DEFAULT 0,
                    physical_mitigation                     INTEGER DEFAULT 0,
                    tactical_mitigation                     INTEGER DEFAULT 0,
                    lightning_mitigation                    INTEGER DEFAULT 0,
                    acid_mitigation                         INTEGER DEFAULT 0,
                    frost_mitigation                        INTEGER DEFAULT 0,
                    fire_mitigation                         INTEGER DEFAULT 0,
                    shadow_mitigation                       INTEGER DEFAULT 0,

                    destiny_points                          INTEGER DEFAULT 0,

                    character_name                          TEXT NOT NULL,
                    account                                 TEXT NOT NULL,
                    server                                  TEXT NOT NULL,
                    FOREIGN KEY (character_name, account, server)
                    REFERENCES characters (name, account, server)
                        ON DELETE CASCADE
                        ON UPDATE NO ACTION
                );`,

    insert: `   INSERT OR IGNORE INTO character_stats (
                    base_max_morale,
                    base_max_power,
                    base_armor,
                    base_might,
                    base_agility,
                    base_vitality,
                    base_will,
                    base_fate,

                    max_morale,
                    max_power,
                    armor,
                    might,
                    agility,
                    vitality,
                    will,
                    fate,

                    out_of_combat_morale_regeneration,
                    out_of_combat_power_regeneration,
                    in_combat_morale_regeneration,
                    in_combat_power_regeneration,

                    base_critical_hit_chance,
                    melee_critical_hit_chance,
                    range_critical_hit_chance,
                    tactical_critical_hit_chance,

                    finesse,

                    melee_damage,
                    range_damage,
                    tactical_damage,

                    base_resistance,
                    wound_resistance,
                    poison_resistance,
                    fear_resistance,
                    disease_resistance,

                    base_critical_hit_avoidance,
                    melee_critical_hit_avoidance,
                    range_critical_hit_avoidance,
                    tactical_critical_hit_avoidance,

                    melee_defence,
                    range_defence,
                    tactical_defence,

                    incoming_healing,
                    outgoing_healing,

                    block,
                    parry,
                    evade,

                    common_mitigation,
                    physical_mitigation,
                    tactical_mitigation,
                    lightning_mitigation,
                    acid_mitigation,
                    frost_mitigation,
                    fire_mitigation,
                    shadow_mitigation,

                    destiny_points,

                    character_name,
                    account,
                    server
                ) VALUES (
                    ?,?,?,?, ?,?,?,?,
                    ?,?,?,?, ?,?,?,?,
                    ?,?,?,?,
                    ?,?,?,?,
                    ?,
                    ?,?,?,
                    ?,?,?,?,?,
                    ?,?,?,?,
                    ?,?,?,
                    ?,?,
                    ?,?,?,
                    ?,?,?,?, ?,?,?,?,
                    ?,
                    ?,?,?
                );`,

    select: `   SELECT 
                    *
                FROM 
                    character_stats 
                WHERE 
                    character_name  = ?  AND
                    account         = ?  AND
                    server          = ?;`,

    delete: `   DELETE FROM character_stats 
                WHERE 
                    character_name  = ?  AND
                    account         = ?  AND
                    server          = ?;`

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
   * @param {*} characterObj
   * @returns
   */
  addCharacterStats (characterObj) {
    if (characterObj.data.Stats === undefined || Object.keys(characterObj.data.Stats).length === 0) {
      return Promise.resolve()
    } else {
      const sanitize = (val) => {
        return val === undefined ? 0 : Math.round(val)
      }

      console.log(characterObj.name + ' stats')
      return this.runSql(
        this.sql.insert,
        sanitize(characterObj.data.Stats.BaseMaxMorale),
        sanitize(characterObj.data.Stats.BaseMaxPower),
        sanitize(characterObj.data.Stats.BaseArmor),
        sanitize(characterObj.data.Stats.BaseMight),
        sanitize(characterObj.data.Stats.BaseAgility),
        sanitize(characterObj.data.Stats.BaseVitality),
        sanitize(characterObj.data.Stats.BaseWill),
        sanitize(characterObj.data.Stats.BaseFate),

        sanitize(characterObj.data.Stats.MaxMorale),
        sanitize(characterObj.data.Stats.MaxPower),
        sanitize(characterObj.data.Stats.Armor),
        sanitize(characterObj.data.Stats.Might),
        sanitize(characterObj.data.Stats.Agility),
        sanitize(characterObj.data.Stats.Vitality),
        sanitize(characterObj.data.Stats.Will),
        sanitize(characterObj.data.Stats.Fate),

        sanitize(characterObj.data.Stats.OutOfCombatMoraleRegeneration),
        sanitize(characterObj.data.Stats.OutOfCombatPowerRegeneration),
        sanitize(characterObj.data.Stats.InCombatMoraleRegeneration),
        sanitize(characterObj.data.Stats.InCombatPowerRegeneration),

        sanitize(characterObj.data.Stats.BaseCriticalHitChance),
        sanitize(characterObj.data.Stats.MeleeCriticalHitChance),
        sanitize(characterObj.data.Stats.RangeCriticalHitChance),
        sanitize(characterObj.data.Stats.TacticalCriticalHitChance),

        sanitize(characterObj.data.Stats.Finesse),

        sanitize(characterObj.data.Stats.MeleeDamage),
        sanitize(characterObj.data.Stats.RangeDamage),
        sanitize(characterObj.data.Stats.TacticalDamage),

        sanitize(characterObj.data.Stats.BaseResistance),
        sanitize(characterObj.data.Stats.WoundResistance),
        sanitize(characterObj.data.Stats.PoisonResistance),
        sanitize(characterObj.data.Stats.FearResistance),
        sanitize(characterObj.data.Stats.DiseaseResistance),

        sanitize(characterObj.data.Stats.BaseCriticalHitAvoidance),
        sanitize(characterObj.data.Stats.MeleeCriticalHitAvoidance),
        sanitize(characterObj.data.Stats.RangeCriticalHitAvoidance),
        sanitize(characterObj.data.Stats.TacticalCriticalHitAvoidance),

        sanitize(characterObj.data.Stats.MeleeDefence),
        sanitize(characterObj.data.Stats.RangeDefence),
        sanitize(characterObj.data.Stats.TacticalDefence),

        sanitize(characterObj.data.Stats.IncomingHealing),
        sanitize(characterObj.data.Stats.OutgoingHealing),

        sanitize(characterObj.data.Stats.Block),
        sanitize(characterObj.data.Stats.Parry),
        sanitize(characterObj.data.Stats.Evade),

        sanitize(characterObj.data.Stats.CommonMitigation),
        sanitize(characterObj.data.Stats.PhysicalMitigation),
        sanitize(characterObj.data.Stats.TacticalMitigation),
        sanitize(characterObj.data.Stats.LightningMitigation),
        sanitize(characterObj.data.Stats.AcidMitigation),
        sanitize(characterObj.data.Stats.FrostMitigation),
        sanitize(characterObj.data.Stats.FireMitigation),
        sanitize(characterObj.data.Stats.ShadowMitigation),

        sanitize(characterObj.data.Stats.DestinyPoints),

        characterObj.name, // character_name
        characterObj.account,
        characterObj.server
      )
    }
  }

  /**
   *
   * @param {*} characterName
   * @param {*} account
   * @param {*} serverd
   * @returns
   */
  deleteCharacterStats (characterName, account, server) {
    return this.runSql(this.sql.delete, characterName, account, server)
  }

  /**
   *
   * @param {*} characterName
   * @param {*} account
   * @param {*} server
   * @returns
   */
  getCharacterStats (characterName, account, server) {
    return this.getSql(this.sql.select, characterName, account, server)
  }
}

module.exports = { CharacterStats }
