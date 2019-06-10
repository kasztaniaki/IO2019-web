<template>
  <form action="">
    <div class="modal-card" style="width: 600px;height:800px">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ ID === '' ? 'Add New Pool' : 'Edit Pool'}}</p>
      </header>
      <section class="modal-card-body">
        <b-field label="ID">
          <b-input
            value="newID"
            v-model="newID"
            maxlength="80"
            has-counter
            required>
          </b-input>
        </b-field>

        <b-field label="Name">
          <b-input
            value="newName"
            v-model="newName"
            maxlength="80"
            has-counter
            required>
          </b-input>
        </b-field>
        <b-field label="OS">
          <b-input
            value="newOSName"
            v-model="newOSName"
            maxlength="80"
            has-counter>
          </b-input>
        </b-field>

        <b-field label="Maximum Count">
          <b-numberinput
            value="newMaximumCount"
            controls-position="compact"
            type="is-light"
            min="0"
            v-model="newMaximumCount"
            expanded>
          </b-numberinput>
        </b-field>

        <b-field label="Enabled">
          <b-switch v-model="newEnabled"
            type="is-success">
            </b-switch>
        </b-field>

        <label class="label">Description</label>
        <b-field grouped group-multiline>
            <div class="control" v-for="(program, index) in newInstalledSoftware" :key="index">
              <div>
                <b-taglist v-if="program[0]" attached>
                  <b-tag type="is-dark">{{ program[0] }}</b-tag>
                  <b-tag type="is-info" closable @close="newInstalledSoftware.splice(index, 1)">{{ program[1] }}</b-tag>
                </b-taglist>
              </div>
            </div>
        </b-field>
        <br>
        <b-field>
          <b-input
            value="newSofwareName"
            placeholder="Program"
            v-model="newSoftwareName">
          </b-input>

          <b-input
            value="newSofwareVersion"
            placeholder="Version"
            v-model="newSoftwareVersion">
          </b-input>

          <b-button
            icon-right="plus"
            @click.native="addNewSofware">
          </b-button>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <b-button
        class="button"
        type="is-success"
        icon-left="check"
        :disabled="newID === '' || newName === ''"
        @click="saveForm()">
          Save
        </b-button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    ID: {
      type: String,
      default: ''
    },
    OSName: {
      type: String,
      default: ''
    },
    MaximumCount: {
      type: Number,
      default: 0
    },
    InstalledSoftware: {
      type: Array,
      default: () => []
    },
    Enabled: {
      type: Boolean,
      default: false
    },
    Name: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      newID: JSON.parse(JSON.stringify(this.ID)),
      newOSName: JSON.parse(JSON.stringify(this.OSName)),
      newMaximumCount: JSON.parse(JSON.stringify(this.MaximumCount)),
      newInstalledSoftware: JSON.parse(JSON.stringify(this.InstalledSoftware)),
      newEnabled: JSON.parse(JSON.stringify(this.Enabled)),
      newName: JSON.parse(JSON.stringify(this.Name)),
      newSoftwareName: null,
      newSoftwareVersion: null
    }
  },
  methods: {
    toggleEnabled () {
      this.newEnabled = !this.newEnabled
    },
    addNewSofware () {
      if (this.newSoftwareName === null) {
        return
      }

      let program = [this.newSoftwareName, this.newSoftwareVersion]
      this.newInstalledSoftware.push(program)

      this.newSoftwareName = null
      this.newSoftwareVersion = null
    },
    saveForm () {
      const newPoolProps = {
        ID: this.newID,
        OSName: this.newOSName,
        MaximumCount: this.newMaximumCount,
        InstalledSoftware: this.newInstalledSoftware,
        Enabled: this.newEnabled,
        Name: this.newName
      }
      this.$emit('poolRequest', newPoolProps)
      this.$emit('close')
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
