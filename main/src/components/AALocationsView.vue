<template>

  <div class="text-left">
    <q-card style="border-radius: 15px; padding: 20px;">
      <q-splitter v-model="splitterModel" separator-class="locations-splitter">

        <template v-slot:before>
          <q-scroll-area style="height: 50vh;">
            <q-tree
              ref="tree"
              :nodes="locations"
              node-key="id"
              label-key="label"
              default-expand-all
              tick-strategy="leaf"
              no-selection-unset
              text-color="grey-5"
              selected-color="warning"
              v-model:selected="selectedKey"
              @update:selected="this.handleSelected($event)"
            />
          </q-scroll-area>
        </template>

        <template v-slot:after>
          <q-card>
            <q-list v-if="selectedNode !== null" style="max-width: 500px;">

              <q-item v-for="r in selectedNode.locationViewConfig" :key="r">
                <q-item-section v-for="c in r" :key="c">
                  <div v-if="!c.ignore">
                    <q-item-label>{{ c.label }}</q-item-label>
                    <q-item-label caption lines="1">{{ c.value }}</q-item-label>
                  </div>
                </q-item-section>
              </q-item>

            </q-list>
          </q-card>
        </template>
      </q-splitter>
    </q-card>
  </div>

</template>

<style lang="sass" scoped>
.q-card
  background: $locations-view-background
  color: $locations-view-text-icon

.q-item__label
  font-weight: 500
  color: $character-details-label
  font-size: 14px
.q-item__label--caption
  color: $character-details-caption
  font-size: 14px
</style>

<script>
import { ref/*, reactive */ } from 'vue'
import { Logger } from 'assets/js/logger.js'

export default {
  // name: 'ComponentName',
  props: {
    locations: {
      type: Array,
      required: true
    }
  },
  setup () {
    return {
      splitterModel: ref(25),
      selectedKey: ref(''), // needed to make tree nodes selectable
      selectedNode: ref(null),
      race: ref(''),
      class: ref(''),
      level: ref(''),
      vocation: ref('')
    }
  },
  beforeMount () {
    Logger.log('AALocationsView.beforeMount')
    // console.log(this.locations)
  },
  methods: {
    handleSelected (key) {
      Logger.log('AALocationsView.handleSelected')
      Logger.log(key)
      Logger.log(this.$refs.tree.getNodeByKey(key))
      // get character, update selected node, use node to drive list
      this.selectedNode = this.$refs.tree.getNodeByKey(key)
      if (this.selectedNode.type === 'container') { // && this.selectedNode.name !== 'Shared Storage') {
        const characterName = this.selectedNode.name.endsWith(' (Vault)') ? this.selectedNode.name.replace(' (Vault)', '') : this.selectedNode.name

        this.selectedNode.locationViewConfig = []
        if (isNaN(this.selectedNode.quantity)) {
          this.selectedNode.locationViewConfig.push([{ ignore: true }])
        } else {
          this.selectedNode.locationViewConfig.push(
            [
              { label: 'Quantity', value: parseInt(this.selectedNode.quantity).toLocaleString() }
            ]
          )
        }

        this.selectedNode.locationViewConfig.push(
          [
            { label: 'Name', value: characterName },
            { label: 'Server', value: this.selectedNode.server },
            { label: 'Account', value: this.selectedNode.account }
          ]
        )

        if (this.selectedNode.name !== 'Shared Storage') {
          window.invoke(
            'get-character',
            characterName,
            this.selectedNode.account,
            this.selectedNode.server
          ).then((result) => {
            Logger.log(result)
            this.race = result.race
            this.class = result.class
            this.level = result.level
            this.vocation = result.vocation

            this.selectedNode.locationViewConfig.push(
              [
                { label: 'Race', value: result.race },
                { label: 'Class', value: result.class },
                { label: 'Level', value: result.level }
              ]
            )

            if (this.vocation !== 'None') {
              return window.invoke(
                'get-character-professions',
                characterName,
                this.selectedNode.account,
                this.selectedNode.server
              )
            }
          }).then((result) => {
            Logger.log(result)
            if (result) {
              const array = []
              result.forEach(e => array.push(e.name))
              this.vocation += ' ( ' + array.join(' / ') + ' )'
            }
          }).finally(() => {
            this.selectedNode.locationViewConfig.push(
              [
                { label: 'Vocation', value: this.vocation }
              ]
            )
          })
        }
      } else if (this.selectedNode.type === 'server') {
        this.selectedNode.locationViewConfig = [
          [
            {
              label: this.selectedNode.useCharactersLabel ? 'Characters' : 'Quantity',
              value: isNaN(this.selectedNode.quantity) ? '-' : parseInt(this.selectedNode.quantity).toLocaleString()
            }
          ],
          [
            { ignore: true },
            { label: 'Server', value: this.selectedNode.server },
            { label: 'Account', value: this.selectedNode.account }
          ]
        ]
      } else if (this.selectedNode.type === 'account') {
        this.selectedNode.locationViewConfig = [
          [
            {
              label: this.selectedNode.useCharactersLabel ? 'Characters' : 'Quantity',
              value: isNaN(this.selectedNode.quantity) ? '-' : parseInt(this.selectedNode.quantity).toLocaleString()
            }
          ],
          [
            { ignore: true },
            { ignore: true },
            { label: 'Account', value: this.selectedNode.account }
          ]
        ]
      }
    },
    expandAll () {
      Logger.log('AALocationsView.expandAll')
      this.$refs.tree.expandAll()
    }
  }
}
</script>
