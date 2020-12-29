import T from 'ant-design-vue/es/input/Input'

export default {
    data() {
        return {}
    },
    props: Object.assign({}, T.props, {
        value: {
            type: [String, Number],
            required: true
        }
    }),
    created() {},
    methods: {},
    render() {
        const props = {}
        console.log(T.props)
        Object.keys(T.props).forEach(k => {
            this[k] && (props[k] = this[k])
            return props[k]
        })

        const template = (
            <a-input {...{ props, scopedSlots: { ...this.$scopedSlots } }}>
                {Object.keys(this.$slots).map(name => (
                    <template slot={name}>{this.$slots[name]}</template>
                ))}
            </a-input>
        )

        return template
    }
}
