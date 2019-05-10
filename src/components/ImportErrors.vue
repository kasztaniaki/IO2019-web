<template>
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">Errors</p>
        </header>
        <section>
            <b-table :data="errors"
                    :row-class="(row,index) => row.error">
                <template slot-scope="props">
                    <b-table-column field="line" label="#">{{props.row.line}}</b-table-column>
                    <b-table-column field="pool" label="Line">{{props.row.pool}}</b-table-column>
                    <b-table-column field="info" label="Info">{{props.row.info}}</b-table-column>
                </template>
            </b-table>
        </section>
        <footer class="modal-card-foot">
                <b-button class="button is-warning" type="button">Force</b-button>
                <b-button class="button " type="button">Close</b-button>
        </footer>
    </div>
</template>

<script>
export default {
    props: {
        errors: Array
    }    
}
</script>

<style>
    tr.warning {
        background: #ffdd57;
        color: black;
    }
    tr.error {
        background: #ff3860;
        color: black;
    }
</style>
