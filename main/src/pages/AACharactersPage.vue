<template>
  <q-page class="plugin-data-view view-page">
      <AACharacterTable class="view-page-table" :expandButtonClicked="expandButtonClicked" title="Characters" icon="people">

        <template v-slot="slot">
          <div class="expanded-row">
              <q-card style="min-height: 500px;" flat>
                <q-tabs
                  v-model="slot.props.row.tab"
                  dense
                  align="left"
                  class="character-tabs"
                >
                                  <!-- class="bg-grey-3 text-grey-7"
                  active-color="primary"
                  indicator-color="purple" -->
                  <q-tab :name="refName('profileTab',slot.props)"   class="character-tab"  :label="slot.props.row.name"    icon="person" />
                  <q-tab :name="refName('walletTab',slot.props)"    class="character-tab"  label="Wallet"    icon="account_balance" />
                  <q-tab :name="refName('inventoryTab',slot.props)" class="character-tab"  label="Inventory" icon="inventory" />
                  <q-tab :name="refName('notesTab',slot.props)"     class="character-tab"  label="Notes"     icon="notes" />
                </q-tabs>

                <q-tab-panels v-model="slot.props.row.tab" class="bg-primary text-white" @transition="(newVal, oldVal) => { tabChanged(newVal, oldVal, slot.props.row) }">

                  <q-tab-panel :name="refName('profileTab',slot.props)" flat>
                    <AACharacterProfile :ref="refName('profileTable',slot.props)"
                                        :characterName="slot.props.row.name"
                                        :account="slot.props.row.account"
                                        :server="slot.props.row.server"
                                        :characterClass="slot.props.row.class"
                                        :race="slot.props.row.race"
                                        :level="slot.props.row.level"
                                        :alignment="slot.props.row.alignment"
                                        :vocation="slot.props.row.vocation"
                                        :lastUpdated="slot.props.row.last_updated"
                                        ></AACharacterProfile> <!-- not a table but still using naming convention -->
                  </q-tab-panel>

                  <q-tab-panel :name="refName('walletTab',slot.props)" flat>
                    <AACharacterWalletTable :ref="refName('walletTable',slot.props)"
                                                      :characterName="slot.props.row.name"
                                                      :account="slot.props.row.account"
                                                      :server="slot.props.row.server"
                                                      :gold="slot.props.row.gold"
                                                      :silver="slot.props.row.silver"
                                                      :copper="slot.props.row.copper"></AACharacterWalletTable>
                  </q-tab-panel>

                  <q-tab-panel :name="refName('inventoryTab',slot.props)">
                    <AACharacterInventoryTable :ref="refName('inventoryTable',slot.props)"
                                                        :characterName="slot.props.row.name"
                                                        :account="slot.props.row.account"
                                                        :server="slot.props.row.server"></AACharacterInventoryTable>
                  </q-tab-panel>

                  <q-tab-panel :name="refName('notesTab',slot.props)">
                    <AACharacterNotesTable :ref="refName('notesTable',slot.props)"
                                           :foreignKeys="[slot.props.row.name, slot.props.row.account, slot.props.row.server]"></AACharacterNotesTable>
                  </q-tab-panel>
                </q-tab-panels>

              </q-card>
          </div>
        </template>

      </AACharacterTable>
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

  // max-height: 10px
  // font-size: 10px

  // .q-tab__content
  //   .q-tab__icon     // tab icon - these aren't taking effect so commenting out
  //     width: 24px
  //     height: 24px
  //     font-size: 24px

  //   .q-tab__label
  //     font-size: 5px
  //     line-height: 1.715em
  //     font-weight: 200

.q-tab-panel
  background: $character-tab-panel-body-background //lighten($mainbg, 25%) //#98002E   // background color of the tab panel
  padding: $character-tab-panel-padding  // default 16px // the padding around the q-tab-panel content (the wallet/inventory/notes tables) and q-tab-panels parent
</style>

<script>
import AACharacterTable from 'components/AACharacterTable.vue'
import { startLoading, stopLoading } from 'assets/js/util.js'
import AACharacterWalletTable from 'components/AACharacterWalletTable.vue'
import AACharacterInventoryTable from 'components/AACharacterInventoryTable.vue'
import AACharacterNotesTable from 'components/AACharacterNotesTable.vue'
import AACharacterProfile from 'components/profile/AACharacterProfile.vue'
import { Logger } from 'assets/js/logger.js'

export default {
  name: 'AACharacterTablePage',
  components: {
    AACharacterTable,
    AACharacterInventoryTable,
    AACharacterWalletTable,
    AACharacterNotesTable,
    AACharacterProfile
  },
  methods: {
    refName (name, props) {
      return name + props.row.index
    },
    expandButtonClicked (props) {
      Logger.log('AACharactersPage.expandButtonClick')
      Logger.log(props)
      props.expand = !props.expand
      if (props.expand) {
        startLoading()
        if (props.row.tab === undefined) {
          props.row.tab = 'profileTab' + props.row.index
        }

        try {
          Logger.log(props.row.tab)
          this.$refs[props.row.tab.replace('Tab', 'Table')].refresh()
        } catch (e) {

        }
        stopLoading()
      }
    },
    tabChanged (newTabName, oldTabName, row) {
      Logger.log('AACharactersPage.tabChanged', newTabName, row.tab)
      if (newTabName) {
        this.$refs[newTabName.replace('Tab', 'Table')].refresh()
      }
    }
  }
}
</script>
