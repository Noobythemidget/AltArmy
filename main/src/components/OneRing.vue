<template>
  <div class="ring" id="precious">{{ string }}</div>
  <!-- <div class="tengwarannatar-font">{{ string }}</div> -->
</template>

<script>
// https://github.com/peterhry/CircleType
import CircleType from 'circletype'

export default {
  props: {
    ring: {
      type: Boolean,
      default: true
    }
  },
  setup () {
    return {
      // https://www.tecendil.com/ - one source of the encoding below (also looking at the tengwar font in a font viewer)
      string: 'AD5,Dx26Yw1Ej^z^Y  = AD5,DxxwP%1Ej^  =AD5,Dx37zE1Ej^z^YXDw6Ykt^AG`Bz7qpT1Ej^',
      array: [
        'AD', '5', ',D', 'x', '2', '6Y', 'w', '1E', 'j^', 'z^Y', '  ', '=', ' ',
        'AD', '5', ',D', 'x', 'x', 'wP%', '1E', 'j^', '  ',
        '=', 'AD', '5', ',D', 'x', '3', '7', 'zE', '1E', 'j^', 'z^Y', 'XD', 'w', '6Y', 'k', 't^', 'AG`B', 'z', '7', 'qpT', '1E', 'j^',
        ' ', '=' // added this bit to make another break in the circle between the start/end points
      ]
    }
  },
  mounted () {
    // eslint-disable-next-line
    const circle = new CircleType(document.getElementById('precious'), (text) => {  // splitter function
      // console.log('original text', text)
      return this.array // already manually split the string
    })
  }
}
</script>
