<template>
    <a-modal
        title="新建规则"
        :width="640"
        :visible="visible"
        :confirmLoading="confirmLoading"
        @ok="handleSubmit"
        @cancel="handleCancel"
    >
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">
                <a-form-item
                    label="描述"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                >
                    {{ doc }}
                    <a-input v-decorator="['desc', {rules: [{required: true, min: 5, message: '请输入至少五个字符的规则描述！'}]}]" />
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
export default {
    props: {
        doc: {
            type: Object,
            default: function() {
                return '';
            }
        }
    },
    data() {
        return {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 13 }
            },
            visible: false,
            confirmLoading: false,

            form: this.$form.createForm(this)
        };
    },
    methods: {
        add() {
            this.visible = true;
        },
        handleSubmit() {
            // this.title = '2222';
            this.doc.title = '2';
            // this.$emit('update:title', 'bb');
            // return;
            // const {
            //     form: { validateFields }
            // } = this;
            // this.confirmLoading = true;
            // validateFields((errors, values) => {
            //     if (!errors) {
            //         console.log('values', values);
            //         // setTimeout(() => {
            //         //     this.visible = false;
            //         //     this.confirmLoading = false;
            //         //     this.$emit('ok', values);
            //         // }, 1500);
            //     } else {
            //         this.confirmLoading = false;
            //     }
            // });
        },
        handleCancel() {
            this.visible = false;
        }
    }
};
</script>
