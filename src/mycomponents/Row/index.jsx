import T from 'ant-design-vue/es/row/index'

export default {
    data() {
        return {}
    },
    props: Object.assign({}, T.props, {
        gutter: {
            type: [Number, Object, Array],
            default: 48
        }
    }),
    created() {},
    methods: {},
    render() {
        const props = {}
        Object.keys(T.props).forEach(k => {
            this[k] && (props[k] = this[k])
            return props[k]
        })

        const template = (
            <a-row {...{ props, scopedSlots: { ...this.$scopedSlots } }}>
                {Object.keys(this.$slots).map(name => (
                    <template slot={name}>{this.$slots[name]}</template>
                ))}
            </a-row>
        )

        return template
    }
}
