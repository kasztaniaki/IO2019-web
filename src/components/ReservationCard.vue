<template>
  <div class="card" :style="{'background-color': poolColor(reservationData.PoolID)}">
    <div class="card-content my-card-content has-text-white">
        <div @click="$emit('user',reservationData.UserEmail)" class="element clickable">
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
          {{new Date(reservationData.StartDate).toLocaleString('pl-PL', timeOptions)}} - {{new Date(reservationData.EndDate).toLocaleString('pl-PL',timeOptions)}}
        </div>
        <div @click="$emit('pool',reservationData.PoolID)" class="element clickable">
          <b-icon
            icon="desktop"
            size="is-small">
          </b-icon>
          {{reservationData.PoolName}}
        </div>
        <div @click="$emit('pool',reservationData.PoolID)" class="element">
          <b-icon
            icon="database"
            size="is-small">
          </b-icon>
          {{reservationData.Count}}
        </div>
    </div>
    <div class="card-footer my-card-footer" v-if="isReservationOwner(reservationData.UserEmail)">

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
        @click="cancelReservationDialog(reservationData)">

      </b-button>
    </div>
  </div>
</template>

<script>
import { cancelReservationReq } from '@/api'
import CancelReservationForm from '@/components/CancelReservationForm.vue'
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
    cancelReservationDialog (resData) {
      this.$modal.open({
        parent: this,
        component: CancelReservationForm,
        props: {
          reservationData: resData
        },
        events: {
          'cancel': (type) => {
            this.cancelReservation(this.reservationData.ReservationID, type)
          }
        }
      })
    },
    cancelReservation (id, type) {
      cancelReservationReq(id, type)
        .then(response => {
          if (response.status === 200) {
            this.$toast.open({
              message: `Reservation cancelled successfully`,
              position: 'is-top',
              type: 'is-success'
            })
            this.$emit('')
          }
          if (response.status === 202) {
            var IDs = response.data
            this.$dialog.confirm({
              title: 'Mass deleting reservations',
              message: 'Are you sure you want to <b>cancel</b> ' + IDs.length + ' reservations? This action cannot be undone.',
              confirmText: 'Confirm',
              type: 'is-danger',
              hasIcon: true,
              onConfirm: () => {
                this.cancelReservation(IDs, type)
              }
            })
          }
        }).catch(error => {
          if (error) {
            console.log(error)
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

td {
  border: 0px !important;
  padding: 2px !important;
}

.my-button {
  border-radius: 0px !important;
}
.element {
  padding: 0.3em;
  margin: -0.3em;
}
.clickable:hover {
  background-color: white;
  color: black;
}

</style>
