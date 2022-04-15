<template>

  <div v-if="vocation === 'None'" class="text-h6">This character does not craft.</div>

  <div v-else>

    <div class="row">
      <div class="col-2 text-left">
        <span class="text-h4">{{ vocation }}</span>
        <q-option-group
            v-model="panel"
            :options="options"
            color="warning"
          />
      </div>
    <!-- </div>

    <div class="row"> -->
      <div class="col">
      <q-tab-panels v-model="panel" animated class="rounded-borders col" style="background: transparent;">

        <q-tab-panel v-for="p of professions" :key="p" :name="p.name">
          <div class="row">
            <div class="col-2 q-ma-xs"></div>
            <div class="col q-ma-xs" style="font-size: 18px">Proficiency</div>
            <div class="col q-ma-xs" style="font-size: 18px">Mastery</div>
          </div>

          <div class="row" v-for="i in getMaxCraftTier(p)" :key="i">
            <div class="col-2 q-ma-xs craft-tier-label">{{ getCraftTier(i-1) }}</div>

            <!-- proficiency -->
            <div class="col q-ma-xs" v-if="(i-1) > p.proficiency_level">
              <q-linear-progress  size="14px"
                                  :value="0"
                                  color="warning"
                                  track-color="grey-13"
                                  rounded>
              </q-linear-progress>
            </div>
            <div class="col q-ma-xs" v-else-if="(i-1) < p.proficiency_level">
              <q-linear-progress  size="14px"
                                  :value="1"
                                  color="warning"
                                  track-color="grey-13"
                                  rounded>
              </q-linear-progress>
            </div>
            <div class="col q-ma-xs" v-else>
              <q-linear-progress  size="14px"
                                  :value="p.proficiency_exp / p.proficiency_exp_target"
                                  color="warning"
                                  track-color="grey-13"
                                  rounded>
                  <div class="absolute-full flex flex-center">
                    <q-badge  color="grey-9"
                              text-color="warning"
                              style="font-weight: 500"
                              :label="p.proficiency_exp + ' / ' + p.proficiency_exp_target" />
                  </div>
              </q-linear-progress>
            </div>

            <!-- mastery -->
            <div class="col q-ma-xs" v-if="(i-1) > p.mastery_level">
              <q-linear-progress  size="14px"
                                  :value="0"
                                  color="warning"
                                  track-color="grey-13"
                                  rounded>
              </q-linear-progress>
            </div>
            <div class="col q-ma-xs" v-else-if="(i-1) < p.mastery_level">
              <q-linear-progress  size="14px"
                                  :value="1"
                                  color="warning"
                                  track-color="grey-13"
                                  rounded>
              </q-linear-progress>
            </div>
            <div class="col q-ma-xs" v-else>
              <q-linear-progress  size="14px"
                                  :value="p.mastery_exp / p.mastery_exp_target"
                                  color="warning"
                                  track-color="grey-13"
                                  rounded>
                  <div class="absolute-full flex flex-center">
                    <q-badge  color="grey-9"
                              text-color="warning"
                              style="font-weight: 500"
                              :label="p.mastery_exp + ' / ' + p.mastery_exp_target" />
                  </div>
              </q-linear-progress>
            </div>

          </div>

        </q-tab-panel>

      </q-tab-panels>
      </div>

    </div>

  </div>

  <!-- <div>
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
  </div> -->

</template>

<style lang="sass">
.q-radio__inner--falsy
  color: grey !important

.craft-tier-label
  height: 14px
  display: table-cell
  vertical-align: middle
  font-size: 12px
  text-align: right
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
    vocation: {
      type: String,
      required: true
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
      professions: ref([]),
      panel: ref(''),
      options: ref([])
    }
  },
  methods: {
    getCraftTier (tier) {
      if (tier >= this.craftTiers.length) {
        return 'Tier ' + tier
      } else {
        return this.craftTiers[tier]
      }
    },
    getMaxCraftTier (prof) {
      return Math.max(prof.proficiency_level, prof.mastery_level, this.craftTiers.length)
    }
  },
  beforeMount () {
    console.log('Crafting.beforeMount')
    window.invoke('get-character-professions', this.characterName, this.account, this.server).then((result) => {
      console.log('professions result: ', result)
      this.professions = result
      if (this.professions.length > 0) {
        this.options = [
          { label: this.professions[0].name, value: this.professions[0].name },
          { label: this.professions[1].name, value: this.professions[1].name },
          { label: this.professions[2].name, value: this.professions[2].name }
        ]
        this.panel = this.professions[0].name
      }
    })
  }
}
</script>
