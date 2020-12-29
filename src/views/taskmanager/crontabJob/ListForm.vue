<template>
    <a-card :bordered="false">
        <div class="table-page-search-wrapper">
            <a-form-model layout="inline">
                <my-row>
                    <my-col>
                        <a-form-model-item label="产品线">
                            <a-select
                                showArrow
                                :showSearch="true"
                                v-model="queryParam.productLine"
                                mode="multiple"
                                placeholder="请选择"
                            >
                                <a-select-option value="">全部</a-select-option>
                                <a-select-option value="1">xstp</a-select-option>
                                <a-select-option value="2">平台2</a-select-option>
                                <a-select-option value="3">平台3</a-select-option>
                                <a-select-option value="4">平台4</a-select-option>
                                <a-select-option value="5">平台5</a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </my-col>
                    <my-col>
                        <a-form-model-item label="任务ID">
                            <a-input
                                v-model="queryParam.id"
                                placeholder=""
                            />
                        </a-form-model-item>
                    </my-col>
                </my-row>
            </a-form-model>
        </div>
        <div
            class="table-operator"
            id="table-operator"
        >
            <a-button
                type="primary"
                class="bbbbbb"
                @click="$refs.table.refresh(true)"
            >搜索</a-button>
            <a-button
                type="primary"
                icon="plus"
                @click="$refs.createModal.add()"
            >新建</a-button>
            <a-button
                type="primary"
                icon="plus"
                @click="$router.push({name:'CreateCrontabJob'})"
            >新建</a-button>
            <my-ellipsis :length="10" tooltip>文字文字文字文字文字文字文字文字文字文字</my-ellipsis>
            <a-dropdown
                v-action:edit
                v-if="selectedRowKeys.length > 0"
            >
                <a-menu slot="overlay">
                    <a-menu-item key="1">
                        <a-icon type="delete" />删除
                    </a-menu-item>
                    <!-- lock | unlock -->
                    <a-menu-item key="2">
                        <a-icon type="lock" />重启
                    </a-menu-item>
                </a-menu>
                <a-button style="margin-left: 8px">
                    批量操作
                    <a-icon type="down" />
                </a-button>
            </a-dropdown>
        </div>
        <s-table
            ref="table"
            size="default"
            :pageURI="queryParam"
            :rowKey="row => row.login.uuid"
            :columns="columns"
            :data="loadData"
            :rowSelection="rowSelection"
        >
            <span
                slot="action"
                class="my-table-operation"
                slot-scope="text, record"
            >
                <template>
                    <a @click="handleEdit(record)">修改</a>
                    <a @click="handleDelete(record)">删除</a>
                    <a
                        @click="handleStatus(record)"
                        class="aaaaa"
                    >{{ record.status === 1 && '暂停' || '运行' }}</a>
                </template>
            </span>
        </s-table>
        <CreateForm
            ref="createModal"
            @ok="handleOk"
        />
    </a-card>
</template>

<script>
import Item from './Item'
import _ from 'lodash'
import { axios } from '@/utils/request'
import moment from 'moment'
import { AutoRefreshQueryParam } from '@/mixin/index'
import { STable } from '@/components'
import { MyRow, MyCol, MyEllipsis } from '@/mycomponents'
import CreateForm from './CreateForm'
import { getServiceList, delCrontabJob } from '@/api/crontabJob'
import dayjs from 'dayjs'
export default {
    name: 'ListForm',
    mixins: [new AutoRefreshQueryParam()],
    components: {
        MyRow,
        MyCol,
        MyEllipsis,
        STable,
        CreateForm,
    },
    created() {
        this.options = _.map(new Array(10), (item, index) => {
            return {
                value: index,
                label: '参数' + index,
            }
        })
    },
    mounted() {
        setTimeout(() => {
            new IntersectionObserver(
                ([change]) => {
                    console.log(change)
                    console.log(change.isVisible) // 被覆盖就是false，反之true
                },
                {
                    threshold: [1.0],
                    delay: 1000,
                    trackVisibility: true,
                }
            ).observe(document.querySelectorAll('.bbbbbb')[0])
        }, 0)
    },
    data() {
        return {
            itemComponent: Item,
            options: [],
            // 高级搜索 展开/关闭
            advanced: false,
            // 查询参数
            queryParam: {
                productLine: ['1'],
                id: '',
            },
            // 所有产品线
            allProducts: {},
            // 表头
            columns: [
                {
                    title: 'uuid',
                    dataIndex: 'login.uuid',
                },
                {
                    title: 'email',
                    dataIndex: 'email',
                },
                {
                    title: 'city',
                    dataIndex: 'location.city',
                },
                {
                    title: 'registered',
                    dataIndex: 'registered.date',
                    customRender: (text, row) => {
                        return dayjs(row.registered.date).format('YYYY-MM-DD HH:mm:ss')
                    },
                },
                {
                    title: '更新时间',
                    dataIndex: 'updateTime',
                    customRender: (text, row) => {
                        return dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss')
                    },
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    width: '160px',
                    ellipsis: false,
                    scopedSlots: { customRender: 'action' },
                },
            ],
            // 加载数据方法 必须为 Promise 对象
            loadData: (parameter) => {
                console.log(this.queryParam)
                return getServiceList(
                    Object.assign(parameter, this.queryParam, {
                        results: 10,
                    })
                ).then((res) => {
                    res.info.total = 20
                    return res
                    // return res.results
                })
            },
            selectedRowKeys: [],
            selectedRows: [],
        }
    },
    computed: {
        rowSelection() {
            return {
                onChange: (selectedRowKeys, selectedRows) => {
                    this.selectedRowKeys = selectedRowKeys
                    this.selectedRows = selectedRows
                },
                getCheckboxProps: (record) => ({
                    props: {
                        // disabled: record.name === 'Disabled User', // Column configuration not to be checked
                        // name: record.name
                    },
                }),
            }
        },
    },
    methods: {
        refreshData() {
            this.$refs.table.refresh()
        },
        handleEdit(record) {
            this.$refs.createModal.edit(record)
        },

        showExecutablejob(record) {
            console.log(this.$refs.executablejobModal)
            this.$refs.executablejobModal.show(record)
        },

        handleStatus(record) {
            var curStatus = record.status
            this.$confirm({
                title: '提示',
                content: '真的要更新状态?',
                onOk: () => {
                    record.status = curStatus === 1 ? 0 : 1
                    console.log('update status:', status)
                    axios({
                        url: '/crontabJob/updateCrontabJobStatus',
                        method: 'post',
                        params: record,
                    }).then((res) => {
                        this.$refs.table.refresh()
                        this.$message.info('更新状态成功')
                    })
                },
                onCancel() {},
            })
        },

        handleDelete(record) {
            this.$confirm({
                title: '提示',
                content: '真的要删除吗?',
                onOk: () => {
                    console.log('delete record:', record)
                    return delCrontabJob({ id: record.id }).then((res) => {
                        this.$refs.table.refresh()
                        this.$message.info('删除成功')
                    })
                },
                onCancel() {},
            })
        },
        handleOk() {
            this.$refs.table.refresh()
        },
        toggleAdvanced() {
            this.advanced = !this.advanced
        },
        resetSearchForm() {
            this.queryParam = {
                date: moment(new Date()),
            }
        },
    },
}
</script>
<style scoped>
</style>