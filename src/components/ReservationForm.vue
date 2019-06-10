<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title"><b>{{ this.PoolName }}</b></p>
    </header>
    <section class="modal-card-body">
        <b-field>
          <div class="columns is-centered">
            <div class="column is-two-thirds">
              <b-datepicker
                inline
                v-model="selectedDate"
                :min-date="today">
              </b-datepicker>
            </div>
            <div class="column is-one-third buttons">
              <b-radio-button class="slot" type="is-primary" v-for="(slot, index) in timeSlots" :key="index" v-model="selectedSlot" :native-value="index"
                :disabled="slot.start < now && today.getDate() === selectedDate.getDate()">
                <span>
                {{ printTimeSlot(slot) }}
                </span>
              </b-radio-button>
              <b-radio-button class="slot" v-model="selectedSlot" :native-value="-1"> Custom slot
              </b-radio-button>
            </div>
          </div>
        </b-field>
      <div class="columns is-centered">
        <b-field class="column" label="FROM" v-if="selectedSlot===-1">
          <b-clockpicker
            inline
            hour-format="24"
            v-model="start"></b-clockpicker>
        </b-field>
        <b-field class="column" label="TO" v-if="selectedSlot===-1">
          <b-clockpicker
            inline
            hour-format="24"
            v-model="end"></b-clockpicker>
        </b-field>
      </div>
      <div class="columns is-centered">
        <div class="column">
          <b-field label="Machines Count">
            <div class="level columns">
              <b-numberinput
                class="level-item is-two-thirds column"
                value="machinesCount"
                controls-position="compact"
                v-model="machinesCount"
                :min=0
                :max="this.maxCount"
                expanded>
              </b-numberinput>
              <div
                class="level-item column">
                Available: {{maxCount}}
              </div>
            </div>
          </b-field>
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <b-button
        class="button level-left"
        type="is-success"
        icon-left="check"
        :disabled="selectedDate === null || selectedSlot === null"
        @click="saveForm()">
          Save
      </b-button>
    </footer>
  </div>
</template>

<script>
import { TIME_SLOTS } from '@/consts.js'
import { getPoolAvailabilityReq } from '@/api'

export default {
  props: {
    PoolName: {
      type: String,
      default: ''
    },
    PoolID: {
      type: String,
      default: ''
    },
    Count: {
      type: Number,
      default: 0
    },
    StartDate: {
      type: Date,
      default: null
    },
    ReservationID: {
      type: Number,
      default: null
    }
  },
  data () {
    const today_ = new Date()
    return {
      today: new Date(today_.getFullYear(), today_.getMonth(), today_.getDate(), 0, 0, 0, 0),
      now: new Date(today_.getFullYear(), today_.getMonth(), today_.getDate(), today_.getHours(), today_.getMinutes(), 0, 0),
      selectedDate: today_,
      machinesCount: this.Count,
      maxCount: 0,
      timeSlots: TIME_SLOTS,
      selectedSlot: null,
      start: null,
      end: null
    }
  },
  computed: {
    startTime () {
      if (this.selectedSlot === -1) {
        return new Date(this.selectedDate.getUTCFullYear(),
          this.selectedDate.getMonth(),
          this.selectedDate.getDate(),
          this.start.getHours(),
          this.start.getMinutes(),
          0, 0)
      } else {
        var time = this.timeSlots[this.selectedSlot]['start']
        console.log(this.selectedDate.getUTCDate())
        var dt =  new Date(this.selectedDate.getFullYear(),
          this.selectedDate.getMonth(),
          this.selectedDate.getDate(),
          time.getHours(),
          time.getMinutes(),
          0, 0)
        return dt
      }
    },
    endTime () {
      if (this.selectedSlot === -1) {
        return new Date(this.selectedDate.getFullYear(),
          this.selectedDate.getMonth(),
          this.selectedDate.getDate(),
          this.end.getHours(),
          this.end.getMinutes(),
          0, 0)
      } else {
        var time = this.timeSlots[this.selectedSlot]['end']
        return new Date(this.selectedDate.getFullYear(),
          this.selectedDate.getMonth(),
          this.selectedDate.getDate(),
          time.getHours(),
          time.getMinutes(),
          0, 0)
      }
    }
  },
  methods: {
    saveForm () {
      const startDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate(), this.startTime.getHours(), this.startTime.getMinutes())
      const endDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate(), this.endTime.getHours(), this.endTime.getMinutes())

      const reservationProps = {
        PoolID: this.PoolID,
        Count: this.machinesCount,
        StartDate: startDate,
        EndDate: endDate,
        ReservationID: this.ReservationID,
        Email: this.$store.getters.getUserData.email
      }

      this.$emit('saveReservation', reservationProps)
      this.$emit('close')
    },
    printTimeSlot (slot) {
      return slot['start'].toLocaleTimeString('pl-PL').split(':').slice(0, 2).join(':') + ' - ' + slot['end'].toLocaleTimeString('pl-PL').split(':').slice(0, 2).join(':')
    },
    maxAvailableMachines () {
      if (this.selectedSlot !== null && this.startTime !== null && this.endTime !== null) {
        getPoolAvailabilityReq(this.PoolID, this.startTime, this.endTime)
          .then(result => {
            this.maxCount = result.data.availability
          })
          .catch(error => {
            console.log(error) // todo replace this with proper error handling
            this.maxCount = 0
          })
      } else this.maxCount = 0
    }
  },
  watch: {
    selectedSlot: function () {
      this.maxAvailableMachines()
    },
    start: function () {
      this.maxAvailableMachines()
    },
    end: function () {
      this.maxAvailableMachines()
    },
    selectedDate: function () {
      this.maxAvailableMachines()
    }
  }
}
</script>
<style lang="scss">
.slot>label {
  width: 60% !important
}
</style>
