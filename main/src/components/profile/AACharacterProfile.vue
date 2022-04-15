<template>
  <q-card class="q-pa-md profile">
    <div class="row">
      <span style="font-size: 22px;" class="col-1">
        {{ account }} <q-icon name="chevron_right"></q-icon> {{ server }} <q-icon name="chevron_right"></q-icon> {{ characterName}}
      </span>
      <q-space></q-space>

      <span>
        <q-btn
          class="delete-button"
          size="lg"
          round
          dense
          flat
          icon="person_off"
          @click="confirm = true"
        >
        <AATooltip :html="'Delete '+ characterName"></AATooltip>
        </q-btn>
      </span>

      <span>
        <q-dialog v-model="confirm" persistent>
          <q-card class="delete-dialog">
            <q-card-section class="row items-center">
              <q-avatar icon="delete" class="delete-avatar"/>
              <span class="q-ml-sm">Are you sure you want to delete {{ characterName }} from Alt Army?</span>
              <span class="relative-center">
                <br>
                This will also prevent {{ characterName }}'s existing data from being imported again. It will not affect newer data.
                <br><br>
                Use this for characters you have deleted in LOTRO.
              </span>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancel" class="dialog-button" v-close-popup />
              <q-btn flat label="Delete" class="dialog-button" @click="deleteCharacter()" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </span>

    </div>
    <div class="row">
      <div class="col-2">
        <q-list>
          <q-item>
            <AACharacterProfileBadge :characterClass="characterClass"
                                    :level="level"
                                    :race="race"
                                    :isFreep="alignment === 'Free People'"></AACharacterProfileBadge>
          </q-item>

          <q-item clickable @click="handleClick('Stats')">
            <q-item-section avatar>
              <q-icon name="analytics"></q-icon>
            </q-item-section>
            <q-item-section>
              <q-item-label>Stats</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable @click="handleClick('Crafting')">
            <q-item-section avatar>
              <q-icon name="construction"></q-icon>
            </q-item-section>
            <q-item-section>
              <q-item-label>Crafting</q-item-label>
            </q-item-section>
          </q-item>

        </q-list>
      </div>

      <!-- <div class="col-1"></div> -->

      <div class="col" v-show="showStats">
        <AACharacterProfileStats  :characterName="characterName"
                                  :account="account"
                                  :server="server"
                                  :alignment="alignment"></AACharacterProfileStats>
      </div>
      <div class="col" v-show="showCrafting">
        <AACharacterProfileCrafting :characterName="characterName"
                                    :account="account"
                                    :server="server"
                                    :vocation="vocation"></AACharacterProfileCrafting>
      </div>

      <!-- <div class="col">
      </div> -->

    </div>
  </q-card>
</template>

<style lang="sass" scoped>
.profile
  border-radius: 15px !important
  background: $main-toolbar-background
  color: grey-5
  height: 50vh

.delete-button
  color: $negative

.dialog-button
  background: $negative
  color: $sub-table-head-foot-text-icon

.delete-dialog
  background: $main-toolbar-background
  color: $sub-table-head-foot-text-icon
  .q-card-section
    .q-avatar
      background: $sub-table-head-foot-text-icon

.delete-avatar
  background: $negative
  color: $sub-table-head-foot-text-icon
</style>

<script>
// import { Dialog } from 'quasar'
import AATooltip from 'components/AATooltip.vue'
import { store } from 'assets/js/store.js'
import { ref } from 'vue'
import AACharacterProfileCrafting from 'src/components/profile/AACharacterProfileCrafting.vue'
import AACharacterProfileStats from 'src/components/profile/AACharacterProfileStats.vue'
import AACharacterProfileBadge from 'src/components/profile/AACharacterProfileBadge.vue'

export default {
  // name: 'ComponentName',
  components: {
    AATooltip,
    AACharacterProfileCrafting,
    AACharacterProfileStats,
    AACharacterProfileBadge
  },
  props: {
    // row: { // the row of data from chracters table
    //   type: Object,
    //   required: true
    // }
    characterName: {
      type: String
    },
    account: {
      type: String
    },
    server: {
      type: String
    },
    lastUpdated: {
      type: String
    },
    level: {
      type: Number
    },
    characterClass: {
      type: String,
      required: true
    },
    race: {
      type: String
    },
    alignment: {
      type: String
    },
    vocation: {
      type: String
    }
  },
  setup () {
    return {
    }
  },
  data () {
    return {
      confirm: ref(false),
      showStats: ref(true),
      showCrafting: ref(false)
    }
  },
  methods: {
    refresh () {

    },
    deleteCharacter () {
      console.log('deleteCharacter', this.characterName, this.account, this.server, this.lastUpdated)
      window.invoke('delete-character', this.characterName, this.account, this.server, this.lastUpdated).then(() => {
        this.confirm = false
        // TODO
        let i = 0
        while (i < store.characters.rows.length) {
          const r = store.characters.rows[i]
          if (r.name === this.characterName && r.account === this.account && r.server === this.server) {
            // found matching character, remove it from the rows array
            // so that table gets updated
            store.characters.rows.splice(i, 1)
            break
          }
          i++
        }
      })
    },
    handleClick (name) {
      console.log(name)
      switch (name) {
        case 'Stats':
          this.showStats = true
          this.showCrafting = false
          break
        case 'Crafting':
          this.showStats = false
          this.showCrafting = true
          break
      }
    }
  }
}
</script>
