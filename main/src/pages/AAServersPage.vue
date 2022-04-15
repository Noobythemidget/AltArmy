<template>
  <q-page class="plugin-data-view view-page">
    <AAServersTable class="view-page-table"
                    :expandButtonClicked="expandButtonClicked"
                    searchTooltip="Filter Servers"
                    :forEachRow="forEachRow"
                    title="Servers"
                    icon="public">

      <template v-slot="slot">
        <div class="expanded-row">
            <q-card style="min-height: 500px;" flat>
              <q-tabs
                v-model="slot.props.row.tab"
                dense
                align="left"
                class="character-tabs"
              >
                <q-tab :name="refName('characters2Tab',slot.props)"    class="character-tab"  label="Characters"    icon="group" />
                <q-tab :name="refName('notes2Tab',slot.props)"         class="character-tab"  label="Notes"     icon="notes" />
              </q-tabs>

              <q-tab-panels v-model="slot.props.row.tab" class="bg-primary text-white" @transition="(newVal, oldVal) => { tabChanged(newVal, oldVal, slot.props.row) }">

                <q-tab-panel :name="refName('characters2Tab',slot.props)" flat>
                  <AALocationsView  :ref="refName('characters2Table',slot.props)"
                                    :locations="slot.props.row.tree"></AALocationsView>
                </q-tab-panel>

                <q-tab-panel :name="refName('notes2Tab',slot.props)">
                  <AAServerNotesTable  :ref="refName('notes2Table',slot.props)"
                                        :foreignKeys="[slot.props.row.id]"></AAServerNotesTable>
                </q-tab-panel>
              </q-tab-panels>

            </q-card>
        </div>
      </template>

    </AAServersTable>
  </q-page>
</template>

<style lang="sass" scoped>
.q-card
  border-radius: 0px  // default 4px
  .character-tabs
    background: $character-tab-panel-top-background // color of the tabs when expanding a character row
    color: $character-tab-text-icon

    .q-tabs__content
      .q-tab--active,
      .q-tab
        text-transform: capitalize   // the tab label
      .q-tab--active
        color: $character-tab-text-icon

.q-tab-panel
  background: $character-tab-panel-body-background //lighten($mainbg, 25%) //#98002E   // background color of the tab panel
  padding: $character-tab-panel-padding  // default 16px // the padding around the q-tab-panel content (the wallet/inventory/notes tables) and q-tab-panels parent
</style>

<script>
// import { ref } from 'vue'
import AAServersTable from 'components/AAServersTable.vue'
import AALocationsView from 'components/AALocationsView.vue'
import AAServerNotesTable from 'components/AAServerNotesTable.vue'
// import { store } from 'assets/js/store.js'
import { Logger } from 'assets/js/logger.js'
import { startLoading, stopLoading } from 'assets/js/util.js'

export default {
  // name: 'AACharacterTablePage',
  components: {
    AAServersTable,
    AALocationsView,
    AAServerNotesTable
  },
  methods: {
    expandButtonClicked (props) {
      // Logger.log('AAServersPage.expandButtonClick')
      // Logger.log(props)
      // startLoading()
      // this.tab = props.row.tab

      // try {
      //   // the components remain undefined until the tab is loaded, so test that they exist
      //   const locViewComp = this.$refs['charactersTable' + props.row.index]
      //   if (!props.row.charactersLoaded && locViewComp) {
      //     locViewComp.refresh()
      //     props.row.charactersLoaded = true
      //   }
      // } catch (e) {
      //   Logger.log('charactersLoaded', e)
      // }

      // stopLoading()
      // props.expand = !props.expand

      Logger.log('AAServersPage.expandButtonClick')
      Logger.log(props)
      props.expand = !props.expand
      if (props.expand) {
        startLoading()

        if (props.row.tab === undefined) {
          props.row.tab = 'notesTab' + props.row.index
        }

        try {
          this.$refs[props.row.tab.replace('Tab', 'Table')].refresh()
        } catch (e) {

        }
        stopLoading()
      }
    },
    tabChanged (newTabName, oldTabName, row) {
      console.log('AAServersPage.tabChanged', oldTabName, newTabName, row.tab)
      try {
        // will not refresh the notestab explicitly because it is refreshed automatically by the AABaseNotesTable.beforeMount() method
        // calling it here will result in the code running twice
        if (!newTabName.startsWith('notesTab')) {
          this.$refs[newTabName.replace('Tab', 'Table')].refresh()
        }
      } catch (err) {
        // no op - will throw exception for the locations view since it doesn't have refresh()
      }
    },
    forEachRow (index, row) {
      Logger.log('AAServersPage.forEachRow')
      row.tab = 'notes2Tab' + index // default tab selected  other value: 'characters2Tab'

      const json = JSON.parse(row.characters_json)
      const nodes = []
      let id = 1
      json.forEach(j => {
        const accountNode = {
          label: j.account + ': ' + j.characters.length.toLocaleString(),
          expandable: true,
          noTick: true,
          icon: 'account_circle',
          children: [],

          // these are properties added by alt army
          id: id++,
          type: 'account',
          name: j.account,
          account: row.name,
          server: j.account,
          quantity: j.characters.length,
          useCharactersLabel: true
        }

        j.characters.forEach(c => {
          const toonNode = {
            label: c,
            expandable: false,
            noTick: true,
            icon: 'person',

            // these are properties added by alt army
            id: id++,
            type: 'container',
            name: c,
            account: j.account,
            server: row.name
          }
          accountNode.children.push(toonNode)
        })
        nodes.push(accountNode)
      })
      row.tree = nodes

      Logger.log(row)
    },
    refName (name, props) {
      return name + props.row.index
    }
  }
}

</script>
