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
      <div class="col-1 text-center">
        <div>
          <q-img  v-if="alignment === 'Free People'"
                  :src="require('assets/images/'+ characterClass +'-icon.png')"
                  loading="eager"
                  width="128px"
                  height="128px"></q-img>
        </div>
        <div>
          <span style="font-size: 26px;">Level: {{ level }}</span>
        </div>
        <div>
          <span style="font-size: 26px;">{{ race }}</span>
        </div>
      </div>

      <div class="col-1"></div>

      <div class="col-4">
        <span class="text-h6">Crafting: {{ vocation }}</span>
          <div class="row" v-for="p of professions" :key="p">
            {{ p.name }}

            <q-linear-progress  size="25px"
                                :value="p.proficiency_exp / p.proficiency_exp_target"
                                color="warning"
                                track-color="grey-13"
                                rounded
                                class="q-ma-xs">
              <div class="absolute-full flex flex-center">
                <q-badge  color="grey"
                          text-color="black"
                          style="font-weight: 500"
                          :label="this.craftTiers[p.proficiency_level] + ' Proficiency: ' + p.proficiency_exp + '/' + p.proficiency_exp_target" />
              </div>
            </q-linear-progress>

            <q-linear-progress  size="25px"
                                :value="p.mastery_exp / p.mastery_exp_target"
                                color="warning"
                                track-color="grey-13"
                                rounded
                                dark
                                class="q-ma-xs">
              <div class="absolute-full flex flex-center">
                <q-badge  color="grey"
                          text-color="black"
                          style="font-weight: 500"
                          :label="this.craftTiers[p.mastery_level] + ' Mastery: ' + p.mastery_exp + '/' + p.mastery_exp_target" />
              </div>
            </q-linear-progress>
          </div>
      </div>

      <div class="col">
      </div>

    </div>
  </q-card>
</template>

<style lang="sass" scoped>
.profile
  border-radius: 15px
  background: $main-toolbar-background
  color: grey
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

export default {
  // name: 'ComponentName',
  components: {
    AATooltip
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
      craftTiers: [
        'Apprentice',
        'Journeyman',
        'Expert',
        'Artisan',
        'Master',
        'Supreme',
        'Westfold',
        'Eastemnet',
        'Westemnet',
        'Anórien',
        'Doomfold',
        'Ironfold',
        'Minas Ithil',
        'Gundabad'
      ]
    }
  },
  data () {
    return {
      confirm: ref(false),
      professions: ref([])
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
    }
  },
  beforeMount () {
    window.invoke('get-character-professions', this.characterName, this.account, this.server).then((result) => {
      console.log('professions result: ', result)
      this.professions = result
    })
  }
}
</script>
