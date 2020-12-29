import T from 'ant-design-vue/es/col/index'

export default {
    data() {
        return {}
    },
    props: Object.assign({}, T.props, {
        md: {
            type: [Number, Object],
            default: 12
        },
        sm: {
            type: [Number, Object],
            default: 24
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
            <a-col {...{ props, scopedSlots: { ...this.$scopedSlots } }}>
                {Object.keys(this.$slots).map(name => (
                    <template slot={name}>{this.$slots[name]}</template>
                ))}
            </a-col>
        )

        return template
    }
}
