<template>
  <div class="card" :style="{'background-color': poolColor(reservationData.PoolID)}">
    <div class="card-content has-text-white">
        <div>
          <b-icon
            icon="user"
            size="is-small">
          </b-icon>
          {{reservationData.Name}} {{reservationData.Surname}}
        </div>
        <div>
          <b-icon
            icon="clock"
            size="is-small">
          </b-icon>
          {{new Date(reservationData.StartDate).toLocaleString('pl-PL',timeOptions)}} - {{new Date(reservationData.EndDate).toLocaleString('pl-PL',timeOptions)}}
        </div>
        <div>
          <b-icon
            icon="desktop"
            size="is-small">

          </b-icon>
          {{reservationData.PoolName}}
        </div>
    </div>
    <div class="card-footer" v-if="isReservationOwner(reservationData.UserID)">

      <b-button
        class="card-footer-item"
        icon-left="pen"
        type="is-info">

      </b-button>
      <b-button
        class="card-footer-item"
        icon-left="trash"
        type="is-danger">

      </b-button>
    </div>
  </div>
</template>

<script>
// import { loadReservationsReq } from '@/api'

export default {
  methods: {
    isReservationOwner (id) {
      return this.$store.getters.getUserData.email === id
    },
    poolColor (id) {
      var hash = 0
      for (var i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) * 33 + hash
      }
      return 'hsl(' + hash % 360 + ', 50%, 30%)'
    }

  },
  props: {
    reservationData: Object
  },
  data () {
    return {
      timeOptions: { hour: 'numeric', minute: 'numeric' }
    }
  },
  mounted () {
    this.poolColor('s7n-prog')
  }
}
</script>

<style lang="scss">

.card-footer-item {
  border-color: transparent !important;
  padding: 0px !important;
}
.card-footer, .card-content, .button{
  border: none !important;
  border-radius: 0px !important;
}

</style>
