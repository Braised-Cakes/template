import T from 'ant-design-vue/es/form-model/FormItem'

export default {
    data() {
        return {}
    },
    props: Object.assign({}, T.props, {}),
    created() {},
    methods: {},
    render() {
        const props = {}
        Object.keys(T.props).forEach(k => {
            this[k] && (props[k] = this[k])
            return props[k]
        })

        const template = (
            <a-form-model-item {...{ props, scopedSlots: { ...this.$scopedSlots } }}>
                {Object.keys(this.$slots).map(name => (
                    <template slot={name}>{this.$slots[name]}</template>
                ))}
            </a-form-model-item>
        )

        return template
    }
}
