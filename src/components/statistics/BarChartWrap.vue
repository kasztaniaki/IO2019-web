<template>
  <div>
    <section class="hero">
      <div class="hero-body">
        <div class="columns">
          <div class="column is-3">
            <b-tooltip label="Hours * machine count for reservation">
              <h1 class="title">
                {{chartTitle}}
              </h1>
            </b-tooltip>
          </div>
          <div class="column is-4">
            <div class="level">
              <b-button class="level-item my-button"
                icon-left="minus"
                @click.native="weekChange(-1)" >
              </b-button>
              <div class="level-item">
                3 pools
              </div>
              <b-button class="level-item my-button"
                icon-left="plus"
                @click.native="weekChange(1)" >
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <BarChart :styles='chartStyles' :chartdata='chartData(labels,data)' />
  </div>
</template>

<script>
import BarChart from '@/components/statistics/BarChart.vue'

export default {
  props: {
    labels: Array,
    data: Array,
    chartTitle: String
  },
  computed: {
    chartStyles () {
      return {
        position: 'relative',
        height: '200px'
      }
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
    }
  },
  components: {
    BarChart
  }
}
</script>

<style lang="scss">
@import "@/variables.scss";

.chart {
  height: 300px;
}
.my-button {
  border-color: transparent !important;
}
</style>
