<template>
  <div :class="cardClass(reservationData.Cancelled)" :style="{'background-color': poolColor(reservationData.PoolID)}">
    <div class="card-content my-card-content has-text-white">
        <div
          @click="userFilterToggle(reservationData.UserEmail, $event)"
          :class="{clicked : selectedUsers.filter(user => { return user.Email === reservationData.UserEmail }).length > 0}"
          class="element clickable">
          <b-icon v-if="selectedUsers.filter(user => { return user.Email === reservationData.UserEmail }).length > 0"
            icon="times-circle"
            size="is-small">
          </b-icon>
          <b-icon v-else
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
        <div @click="poolFilterToggle(reservationData.PoolID, $event)"
          :class="{clicked : selectedPools.filter(pool => { return pool.ID === reservationData.PoolID }).length > 0}"
          class="element clickable">
          <b-icon v-if="(selectedPools.filter(pool => { return pool.ID === reservationData.PoolID }).length > 0)"
            icon="times-circle"
            size="is-small">
          </b-icon>
          <b-icon v-else
            icon="desktop"
            size="is-small">
          </b-icon>
          {{reservationData.PoolName}}
        </div>
        <div class="element">
          <b-icon
            icon="database"
            size="is-small">
          </b-icon>
          {{reservationData.Count}}
        </div>
    </div>
    <div class="card-footer my-card-footer" v-if="isReservationOwner(reservationData.UserEmail) || this.$store.getters.getIsAdmin">

      <b-button
        class="card-footer-item my-card-footer-item my-button"
        icon-left="pen"
        type="is-info"
        @click="editReservationForm(reservationData)">

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
import { cancelReservationReq, editReservationReq } from '@/api'
import CancelReservationForm from '@/components/CancelReservationForm.vue'
import ReservationForm from '@/components/ReservationForm.vue'

export default {
  props: {
    reservationData: Object,
    selectedUsers: Array,
    selectedPools: Array
  },
  data () {
    return {
      timeOptions: { hour: 'numeric', minute: 'numeric' },
      userClicked: false,
      poolClicked: false
    }
  },
  methods: {
    cardClass (cancelled) {
      return cancelled === 'true' ? 'cancelled' : ''
    },
    isReservationOwner (id) {
      return this.$store.getters.getUserData.email === id
    },
    poolColor (id) {
      var hash = 0
      for (var i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) * 34 + hash
      }
      return 'hsl(' + hash % 360 + ', 50%, 30%)'
    },
    userFilterToggle (data, event) {
      this.userClicked = !this.userClicked
      this.$emit('user', this.reservationData.UserEmail)
    },
    poolFilterToggle (data, event) {
      this.poolClicked = !this.poolClicked
      this.$emit('pool', this.reservationData.PoolID)
    },
    editReservationForm (resData) {
      const reservationProps = {
        PoolID: resData.PoolID,
        PoolName: resData.PoolName,
        StartDate: resData.StartDate,
        Count: resData.Count,
        ReservationID: resData.ReservationID
      }

      this.$modal.open({
        parent: this,
        props: reservationProps,
        component: ReservationForm,
        hasModalCard: true,
        events: {
          'saveReservation': (reservationProps) => {
            this.editReservation(reservationProps)
          }
        }
      })
    },
    editReservation (reservationProps) {
      editReservationReq(reservationProps).then(response => {
        this.$toast.open({
          message: `Reservation added successfully`,
          position: 'is-top',
          type: 'is-success'
        })
        this.$emit('edit')
      })
        // eslint-disable-next-line
        .catch(error => {
          this.$toast.open({
            message: `Error`,
            position: 'is-top',
            type: 'is-danger'
          })
        })
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
  }
}
</script>

<style lang="scss" scoped>

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
.clickable:hover, .clicked {
  background-color: white;
  color: black;
  cursor: pointer;
}
.cancelled {
  border: 10px dashed red
}

</style>
