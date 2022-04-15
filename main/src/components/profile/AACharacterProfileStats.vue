<template>
  <div class="row">

    <div class="col-2 text-left" v-if="alignment !== 'Free People'">
      <span class="text-h6">Creep stats are not supported.</span>
    </div>

    <div class="col-2 text-left"  v-if="alignment === 'Free People'">
      <span class="text-h4">Stats</span>
      <q-option-group
          v-model="panel"
          :options="[
            {label: 'Basic Stats', value: 'Basic Stats'},
            {label: 'Offense', value: 'Offense'},
            {label: 'Defense', value: 'Defense'}
          ]"
          color="warning"
        />
    </div>

    <div class="col-4" v-if="alignment === 'Free People'">
      <q-tab-panels v-model="panel" animated class="rounded-borders col" style="background: transparent;">

        <q-tab-panel name="Basic Stats">
          <q-scroll-area style="height: 35vh" class="q-pa-sm" :vertical-thumb-style="{ right: '4px', borderRadius: '5px', background: '#F9A01B', width: '10px', opacity: .5, }">
            <q-markup-table flat dense>
              <tbody>
                <tr v-for="s of basicStats" :key="s">
                  <td v-if="s.padding" class="q-pa-sm">&rArr; {{ s.label }}</td>
                  <td v-else>{{ s.label }}</td>
                  <td class="stat-value">{{ parseInt(s.value).toLocaleString() }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-scroll-area>

        </q-tab-panel>

        <q-tab-panel name="Offense">
          <q-scroll-area style="height: 35vh" class="q-pa-sm" :vertical-thumb-style="{ right: '4px', borderRadius: '5px', background: '#F9A01B', width: '10px', opacity: .5, }">
            <q-markup-table dense>
              <tbody>
                <tr v-for="s of offenseStats" :key="s">
                  <td v-if="s.padding" class="q-pa-sm">&rArr; {{ s.label }}</td>
                  <td v-else>{{ s.label }}</td>
                  <td class="stat-value">{{ parseInt(s.value).toLocaleString() }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-scroll-area>
        </q-tab-panel>

        <q-tab-panel name="Defense">
          <q-scroll-area style="height: 35vh" class="q-pa-sm" :vertical-thumb-style="{ right: '4px', borderRadius: '5px', background: '#F9A01B', width: '10px', opacity: .5, }">
            <q-markup-table dense>
              <tbody>
                <tr v-for="s of defenseStats" :key="s">
                  <td v-if="s.padding" class="q-pa-sm">&rArr; {{ s.label }}</td>
                  <td v-else>{{ s.label }}</td>
                  <td class="stat-value">{{ parseInt(s.value).toLocaleString() }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-scroll-area>
        </q-tab-panel>

      </q-tab-panels>
    </div>

  </div>
</template>

<style lang="sass" scoped>
.stat-value
  text-align: right

.q-markup-table
  background: lighten($dark,10%)
  color: darken(white,10%)
</style>

<script>
import { ref } from 'vue'

export default {
  // name: 'ComponentName',
  props: {
    characterName: {
      type: String,
      required: true
    },
    account: {
      type: String,
      required: true
    },
    server: {
      type: String,
      required: true
    },
    alignment: {
      type: String,
      required: true
    }
  },
  computed: {
    basicStats: function () {
      return [
        { label: 'Morale', value: this.getStat('max_morale') },
        { label: 'In Combat Morale Regen', value: this.getStat('in_combat_morale_regeneration') * 60, padding: true },
        { label: 'Out of Combat Morale Regen', value: this.getStat('out_of_combat_morale_regeneration') * 60, padding: true },
        { label: 'Power', value: this.getStat('max_power') },
        { label: 'In Combat Power Regen', value: this.getStat('in_combat_power_regeneration') * 60, padding: true },
        { label: 'Out of Combat Power Regen', value: this.getStat('out_of_combat_power_regeneration') * 60, padding: true },
        { label: 'Armor', value: this.getStat('armor') },
        { label: 'Might', value: this.getStat('might') },
        { label: 'Agility', value: this.getStat('agility') },
        { label: 'Vitality', value: this.getStat('vitality') },
        { label: 'Will', value: this.getStat('will') },
        { label: 'Fate', value: this.getStat('fate') }
      ]
    },
    offenseStats: function () {
      return [
        { label: 'Critical Rating', value: this.getStat('base_critical_hit_chance') },
        { label: 'Finesse', value: this.getStat('finesse') },
        { label: 'Physical Mastery', value: this.getStat('melee_damage') },
        { label: 'Tactical Mastery', value: this.getStat('tactical_damage') }
      ]
    },
    defenseStats: function () {
      return [
        { label: 'Resistance', value: this.getStat('base_critical_hit_chance') },
        { label: 'Critical Defense', value: this.getStat('finesse') },
        { label: 'Incoming Healing', value: this.getStat('incoming_healing') },
        { label: 'Block', value: this.getStat('block') },
        { label: 'Parry', value: this.getStat('parry') },
        { label: 'Evade', value: this.getStat('evade') },
        { label: 'Physical Mitigation', value: this.getStat('common_mitigation') }, // for some reason this matches the phys mitigation and not the physical_mitigation field
        { label: 'Tactical Mitigation', value: this.getStat('tactical_mitigation') }
      ]
    }
  },
  setup () {
    return {
      panel: ref('Basic Stats'),
      stats: ref([])
    }
  },
  methods: {
    getStat (statName) {
      if (this.stats && this.stats[statName]) {
        return this.stats[statName]
      } else {
        return 0
      }
    }
  },
  beforeMount () {
    console.log('Crafting.beforeMount')
    window.invoke('get-character-stats', this.characterName, this.account, this.server).then((result) => {
      console.log('stats result: ', result)
      this.stats = result
    })
  }
}
</script>
