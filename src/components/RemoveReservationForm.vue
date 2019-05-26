<template>
  <form action="">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Remove reservation</p>
      </header>
      <section class="modal-card-body">
        <div class="field">
            <b-radio v-model="radio"
                native-value="this">
                Remove only this reservation
            </b-radio>
        </div>
        <div class="field">
            <b-radio v-model="radio"
                native-value="series"
                type="is-warning">
                Remove every reservation in
                {{new Date(reservationData.StartDate).toLocaleString('pl-PL',timeOptions)}} -
                {{new Date(reservationData.EndDate).toLocaleString('pl-PL',timeOptions)}}
                for {{reservationData.PoolName}}
            </b-radio>
        </div>
        <div class="field">
            <b-radio v-model="radio"
                native-value="every"
                type="is-danger">
                Remove every reservation for {{reservationData.PoolName}}
            </b-radio>
        </div>
      </section>
      <footer class="modal-card-foot">
        <b-button
        type="is-danger"
        icon-left="trash"
        @click="removeReservation(reservationData.ReservationID)">
          Remove
        </b-button>
        <b-button
        type="is-default"
        @click="$emit('close')">
          Cancel
        </b-button>
      </footer>
    </div>
  </form>
</template>

<script>
import { removeReservationReq } from '@/api'
export default {
  props: {
    reservationData: Object
  },
  data () {
    return {
      radio: 'this',
      timeOptions: { hour: 'numeric', minute: 'numeric' }
    }
  },
  methods: {
    removeReservation (id) {
      removeReservationReq(id)
        .then(response => {
          // todo
        }).catch(error => {
          if (error) {
            // todo
          }
        })
    }
  }
}
</script>

<style lang="scss">
#enabled-icon {
  color: green;
}
#disabled-icon {
  color: red;
}
</style>
