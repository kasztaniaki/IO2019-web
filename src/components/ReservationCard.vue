<template>
  <div class="card" :style="{'background-color': poolColor(reservationData.PoolID)}">
    <div class="card-content my-card-content has-text-white">
        <div @click="$emit('user',reservationData.UserID)" class="element clickable">
          <b-icon
            icon="user"
            size="is-small">
          </b-icon>
          {{reservationData.Name}} {{reservationData.Surname}}
        </div>
        <div class="element">
          <b-icon
            icon="clock"
            size="is-small">
          </b-icon>
          {{new Date(reservationData.StartDate).toLocaleString('pl-PL')}} - {{new Date(reservationData.EndDate).toLocaleString('pl-PL',timeOptions)}}
        </div>
        <div @click="$emit('pool',reservationData.PoolID)" class="element clickable">
          <b-icon
            icon="desktop"
            size="is-small">
          </b-icon>
          {{reservationData.PoolName}}
          ({{reservationData.Count}})
        </div>
    </div>
    <div class="card-footer my-card-footer" v-if="isReservationOwner(reservationData.UserID)">

      <b-button
        class="card-footer-item my-card-footer-item my-button"
        icon-left="pen"
        type="is-info"
        @click="editReservation(reservationData)">

      </b-button>
      <b-button
        class="card-footer-item my-card-footer-item my-button"
        icon-left="trash"
        type="is-danger"
        @click="removeReservationDialog(reservationData)">

      </b-button>
    </div>
  </div>
</template>

<script>
// import { loadReservationsReq } from '@/api'
import RemoveReservationForm from '@/components/RemoveReservationForm.vue'
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
    },
    editReservation (resData) {
      console.log('edit fired')
    },
    removeReservationDialog (resData) {
      this.$modal.open({
        parent: this,
        component: RemoveReservationForm,
        props: {
          reservationData: resData
        }
      })
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

.my-card-footer-item {
  border-color: transparent !important;
  padding: 0px !important;
}
.my-card-footer {
  border: none !important;
}
.my-card-content{
  border: none !important;
  padding: 0.6em
}

.my-button {
  border-radius: 0px !important;
}
.element {
  padding: 0.5em
}
.clickable:hover {
  background-color: white;
  color: black;
}

</style>
