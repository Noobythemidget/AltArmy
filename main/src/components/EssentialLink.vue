<template>
  <!-- if it has the external property then open a new window -->
  <div v-if="external">
    <q-item clickable @click="handleClick">
      <q-item-section v-if="icon" avatar>
        <q-icon :name="icon" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ title }}</q-item-label>
        <q-item-label caption>{{ caption }}</q-item-label>
      </q-item-section>
    </q-item>
  </div>
  <div v-else-if="seperator">
    <!-- nothing here just empty space -->
  </div>
  <div v-else>
    <q-item clickable :to="link">
      <q-item-section v-if="icon" avatar>
        <q-icon :name="icon" class="text-icon" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ title }}</q-item-label>
        <q-item-label caption>{{ caption }}</q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<style lang="sass" scoped>
// normal colors
.q-item
    color: darken(white,10%)
.q-item
  .q-item__label
    color: darken(white,10%)

// colors while hovering
.q-item:hover
  color: $main-toolbar-text-icon
.q-item:hover
  .q-item__label
    color: $main-toolbar-text-icon

// colors while active
.q-router-link--active
  background: $main-toolbar-text-icon
  color: black
  font-weight: 500
  .q-item__label,
  .q-item__label--caption
    color: black

// colors while active and hovering
.q-router-link--active:hover
  background: $negative

</style>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: ''
    },

    icon: {
      type: String,
      default: ''
    },

    external: {
      type: Boolean,
      default: false
    },

    seperator: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick () {
      console.log('clicked: ' + this.link)
      window.invoke('open-link', this.link)
    }
  }
})
</script>
