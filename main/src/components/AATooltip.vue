<template>
  <q-tooltip
    class="bg-accent text-black text-body2 shadow-4"
    :offset="[10, 10]"
    :delay="350"
    transition-show="scale"
    transition-hide="scale"
    anchor="bottom left"
    self="top left"
  >
    <span v-if="text">{{ text }}</span>
    <span v-if="html">
      <span v-html="html"></span>
    </span>
  </q-tooltip>
</template>

<script>
export default {
  name: 'AATooltip',
  props: {
    text: {
      type: String
    },
    html: {
      type: String
    }
  },
  setup () {
    return {}
  }
}
</script>
