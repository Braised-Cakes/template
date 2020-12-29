import _ from 'lodash'

function evil(fn) {
    var Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
    return new Fn('return ' + fn)()
}

export default {
    name: 'MyForm',
    props: {
        descriptors: [Object],
        data: [Object]
    },
    created() {
        _.forEach(this.descriptors, (item, key) => {
            this.$set(this.data, key, item.value)

            // 是否展示相关逻辑
            if (typeof item.show === 'function') {
                item.show = item.show.bind(this, this.data)
            } else if (typeof item.show === 'boolean') {
                item.show = function() {
                    return item.show
                }
            } else {
                item.show = function() {
                    return true
                }
            }

            // 禁用相关逻辑
            if (typeof item.disabled === 'function') {
                item.disabled = item.disabled.bind(this, this.data)
            } else if (typeof item.disabled === 'boolean') {
                item.disabled = function() {
                    return item.disabled
                }
            } else {
                item.disabled = function() {
                    return false
                }
            }

            // change相关逻辑
            if (item.change) {
                this.$watch('data.' + key, function(newVal, oldVal) {
                    // item.change(newVal, oldVal, this.data, this.descriptors)
                    evil(item.change)(this.data)
                })
            }
        })
    },
    render() {
        return (
            <a-form-model
                ref="ruleForm"
                v-model={this.data}
                rules={this.rules}
                label-col={this.labelCol}
                wrapper-col={this.wrapperCol}
            >
                {_.map(this.descriptors, item => {
                    if (item.show()) {
                        return (
                            <a-form-model-item label={item.label}>
                                {item.type === 'input' ? (
                                    <a-input
                                        disabled={item.disabled()}
                                        placeholder={item.placeholder}
                                        v-model={this.data[item.prop]}
                                    >
                                        <template slot="prefix">{item.prefix}</template>
                                        <template slot="suffix">{item.suffix}</template>
                                    </a-input>
                                ) : null}

                                {item.type === 'select' ? (
                                    <a-select
                                        placeholder={item.placeholder}
                                        v-model={this.data[item.prop]}
                                        disabled={item.disabled()}
                                    >
                                        {_.map(item.option, option => {
                                            return (
                                                <a-select-option key={option.value} value={option.value}>
                                                    {option.label}
                                                </a-select-option>
                                            )
                                        })}
                                    </a-select>
                                ) : null}
                            </a-form-model-item>
                        )
                    } else {
                        return ''
                    }
                })}
            </a-form-model>
        )
    },
    data() {
        return {
            rules: {
                info: [{ required: true, message: '请输入至少一个字符的描述！' }]
            },
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 13 }
            }
        }
    }
}
