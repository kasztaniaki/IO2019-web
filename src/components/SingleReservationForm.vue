<template>
  <div class="modal-card" style="width:800px;height:800px">
    <header class="modal-card-head">
      <p class="modal-card-title">Reservation for <b>{{ this.poolID }}</b></p>
    </header>
    <section class="modal-card-body">
      <b-tabs expanded>
        <b-tab-item label="Start">
          <b-field>
            <div class="box">
              <div class="columns">
                <div class="column">
                  <b-datepicker
                    inline
                    v-model="startDate">
                  </b-datepicker>
                </div>

                <div class="column is-narrow">
                  <b-clockpicker
                    inline
                    rounded
                    v-model="startTime"
                    hour-format="24">
                  </b-clockpicker>
                </div>
              </div>
            </div>
          </b-field>
        </b-tab-item>

        <b-tab-item label="End">
          <b-field>
            <div class="box">
              <div class="columns">
              <div class="column is-narrow">
                <b-datepicker
                  inline
                  v-model="endDate">
                </b-datepicker>
              </div>

              <div class="column is-half">
                <b-clockpicker
                  inline
                  rounded
                  v-model="endTime"
                  hour-format="24">
                </b-clockpicker>
              </div>
            </div>
            </div>
          </b-field>
        </b-tab-item>
      </b-tabs>
      <div class="columns is-centered">
        <div class="column is-7">
          <b-field label="Machines Count">
            <b-numberinput
              value="machinesCount"
              v-model="machinesCount"
              :min=0
              :max="poolMaxCount"
              expanded>
            </b-numberinput>
          </b-field>
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <b-button
        class="button"
        type="is-success"
        icon-left="check"
        :disabled="startDate === null || endDate === null"
        @click="saveForm()">
          Save
      </b-button>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    poolID: {
      type: String
    },
    poolMaxCount: {
      type: Number
    }
  },
  data () {
    return {
      startDate: new Date(),
      startTime: new Date(),
      endDate: new Date(),
      endTime: new Date(),
      machinesCount: 0
    }
  },
  methods: {
    saveForm () {
      const reservationProps = {
        poolID: this.poolID,
        poolMaxCount: this.poolMaxCount,
        startDate: this.startDate,
        startTime: this.startTime,
        endDate: this.endDate,
        endTime: this.endTime
      }

      this.$emit('saveReservation', reservationProps)
      this.$emit('close')
    }
  }
}
</script>
