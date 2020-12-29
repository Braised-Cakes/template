import _ from 'lodash'

/**
 * @param {*} config
 */
export default function (config = {}) {
    config.wait = _.get(config, 'wait', 500);
    config.name = _.get(config, 'name', 'queryParam');
    config.tableRef = _.get(config, 'tableRef', 'table');

    return {
        mounted() {
            this.searchRefresh = _.debounce(this.$refs[config.tableRef].refresh.bind(this, true), config.wait)
        },
        created() {
            _.forEach(this.$route.query, (value, key) => {
                if (_.keys(this[config.name]).includes(key)) {
                    this[config.name][key] = this.$route.query[key]
                }
            })
            this.$watch(config.name, function () {
                this.searchRefresh()
            }, {
                deep: true
            })
        }
    }
}