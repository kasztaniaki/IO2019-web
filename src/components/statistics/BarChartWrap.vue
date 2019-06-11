<template>
  <div>
    <section class="hero">
      <div class="hero-body">
        <div class="columns">
          <div class="column is-3">
            <b-tooltip :label="tooltip" position='is-right'>
              <h1 class="title">
                {{chartTitle}}
              </h1>
            </b-tooltip>
          </div>
          <div class="column is-4">
            <div class="level">
              <b-button class="level-item my-button"
                icon-left="minus"
                @click.native="updateNumber(-1)" >
              </b-button>
              <div class="level-item expanded">
                Rows: {{number}}
              </div>
              <b-button class="level-item my-button"
                icon-left="plus"
                @click.native="updateNumber(1)" >
              </b-button>
            </div>
          </div>
          <div v-if="threshold" class="column is-4">
            <div class="level">
              <b-button class="level-item my-button"
                icon-left="minus"
                @click.native="updateThreshold(-0.05)" >
              </b-button>
              <div class="level-item">
                Threshold: {{threshold}}
              </div>
              <b-button class="level-item my-button"
                icon-left="plus"
                @click.native="updateThreshold(0.05)" >
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div>
      <BarChart ref='chart' :chart-data='chartData(labels,dataPoints)' />
    </div>
  </div>
</template>

<script>
import BarChart from '@/components/statistics/BarChart.vue'

export default {
  props: {
    labels: Array,
    dataPoints: Array,
    chartTitle: String,
    loading: Boolean,
    number: Number,
    threshold: Number,
    tooltip: String
  },
  data () {
    return {
      loadingComponent: null
    }
  },
  methods: {
    chartData (dataLabels, dataPoints) {
      var colors = []
      for (const label of dataLabels) {
        colors.push(this.generateColor(label))
      }
      return { labels: dataLabels, datasets: [{ backgroundColor: colors, data: dataPoints }] }
    },
    generateColor (value) {
      var hash = 0
      for (var i = 0; i < value.length; i++) {
        hash = value.charCodeAt(i) * 34 + hash
      }
      return 'hsl(' + hash % 360 + ', 50%, 30%)'
    },
    updateNumber (offset) {
      this.number += offset
      this.$emit('update:number', this.number)
    },
    updateThreshold (offset) {
      this.threshold = Number((this.threshold + offset).toFixed(2))
      this.$emit('update:threshold', this.threshold)
    }
  },
  components: {
    BarChart
  }
}
</script>

<style lang="scss">
@import "@/variables.scss";

.my-button {
  border-color: transparent !important;
}
</style>
