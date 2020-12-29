<template>
    <a-card :bordered="false">
        <div class="table-page-search-wrapper">
            <a-form layout="inline">
                <a-row :gutter="48">
                    <a-col
                        :md="8"
                        :sm="24"
                    >
                        <a-form-item label="产品线">
                            <a-select
                                v-model="queryParam.productLine"
                                placeholder="请选择"
                                default-value="0"
                            >
                                <a-select-option value="testGroup">testGroup</a-select-option>
                                <a-select-option value="xstp">xstp</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col
                        :md="8"
                        :sm="24"
                    >
                        <a-form-item label="任务ID">
                            <a-input
                                v-model="queryParam.id"
                                placeholder=""
                            />
                        </a-form-item>
                    </a-col>

                    <template v-if="advanced">
                        <a-col
                            :md="8"
                            :sm="24"
                        >
                            <a-form-item label="任务状态">
                                <a-select
                                    v-model="queryParam.status"
                                    placeholder="请选择"
                                    default-value="0"
                                >
                                    <a-select-option value="">全部</a-select-option>
                                    <a-select-option value="1">运行中</a-select-option>
                                    <a-select-option value="2">已停止</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col
                            :md="8"
                            :sm="24"
                        >
                            <a-form-item label="任务描述">
                               <a-input
                                v-model="queryParam.info"
                                placeholder=""
                               />
                            </a-form-item>
                        </a-col>
                         <a-col
                            :md="8"
                            :sm="24"
                        >
                            <a-form-item label="任务优先级">
                                <a-input-number
                                    v-model="queryParam.priority"
                                    style="width: 100%"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col
                            :md="8"
                            :sm="24"
                        >
                            <a-form-item label="创建日期">
                                <a-date-picker
                                    v-model="queryParam.date"
                                    style="width: 100%"
                                    placeholder="请输入创建日期"
                                />
                            </a-form-item>
                        </a-col>
                    </template>
                    <a-col
                        :md="!advanced && 8 || 24"
                        :sm="24"
                    >
                        <span
                            class="table-page-search-submitButtons"
                            :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
                        >
                            <a-button
                                type="primary"
                                @click="$refs.mainTable.refresh(true)"
                            >查询</a-button>
                            <a-button
                                style="margin-left: 8px"
                                @click="() => queryParam = {}"
                            >重置</a-button>
                            <a
                                @click="toggleAdvanced"
                                style="margin-left: 8px"
                            >
                                {{ advanced ? '收起' : '展开' }}
                                <a-icon :type="advanced ? 'up' : 'down'" />
                            </a>
                        </span>
                    </a-col>
                </a-row>
            </a-form>
        </div>

        <div class="table-operator">
            <a-button
                type="primary"
                icon="plus"
                @click="$refs.createModal.add()"
            >新建</a-button>
            <a-button
                type="dashed"
                @click="tableOption"
            >{{ optionAlertShow && '关闭' || '开启' }} alert</a-button>
            <a-dropdown
                v-action:edit
                v-if="selectedRowKeys.length > 0"
            >
                <a-menu slot="overlay">
                    <a-menu-item key="1">
                        <a-icon type="delete" />删除</a-menu-item>
                    <!-- lock | unlock -->
                    <a-menu-item key="2">
                        <a-icon type="lock" />锁定</a-menu-item>
                </a-menu>
                <a-button style="margin-left: 8px">
                    批量操作
                    <a-icon type="down" />
                </a-button>
            </a-dropdown>
        </div>

        <s-table
            ref="mainTable"
            size="default"
            rowKey="key"
            :columns="columns"
            :data="loadData"
            :alert="options.alert"
            :rowSelection="options.rowSelection"
            showPagination="auto"
        >
            <span
                slot="serial"
                slot-scope="text, record, index"
            >
                {{ index + 1 }}
            </span>
            <span
                slot="status"
                slot-scope="text"
            >
                <a-badge
                    :status="text | statusTypeFilter"
                    :text="text | statusFilter"
                />
            </span>
            <span
                slot="description"
                slot-scope="text"
            >
                <ellipsis
                    :length="4"
                    tooltip
                >{{ text }}</ellipsis>
            </span>

            <span
                slot="action"
                slot-scope="text, record"
            >
                <template>
                    <a @click="handleEdit(record)">修改</a>
                    <a-divider type="vertical" />
                    <a @click="handleDelete(record)">删除</a>
                    <a-divider type="vertical" />
                    <a @click="handleStatus(record)">{{ record.status === 1 && '暂停' || '运行' }}</a>
                </template>
            </span>
        </s-table>
        <createForm
            ref="createModal"
            @ok="handleOk"
        />
        <UpdateForm
            ref="editModal"
            @ok="handleOk"
        />
    </a-card>
</template>

<script>
import moment from 'moment';
import { STable, Ellipsis } from '@/components';
import UpdateForm from './UpdateForm';
import CreateForm from './CreateForm';
import { getRoleList, getServiceList, delCrontabJob, updateCrontabJob } from '@/api/crontabJob';

const statusMap = {
    0: {
        status: 'default',
        text: '关闭'
    },
    1: {
        status: 'processing',
        text: '运行中'
    },
    2: {
        status: 'success',
        text: '已停止'
    },
    3: {
        status: 'error',
        text: '异常'
    }
};

export default {
    name: 'ListForm',
    components: {
        STable,
        Ellipsis,
        CreateForm,
        UpdateForm
    },
    data() {
        return {
            mdl: {},
            // 高级搜索 展开/关闭
            advanced: false,
            // 查询参数
            queryParam: {},
            // 表头
            columns: [
                {
                    title: '#',
                    scopedSlots: { customRender: 'serial' }
                },
                {
                    title: '任务id',
                    dataIndex: 'id'
                },
                {
                    title: '描述',
                    dataIndex: 'info',
                    scopedSlots: { customRender: 'info' }
                },
                {
                    title: 'crontab',
                    dataIndex: 'crontab',
                    scopedSlots: { customRender: 'crontab' }
                },
                {
                    title: '执行参数',
                    dataIndex: 'extParams',
                    scopedSlots: { customRender: 'extParams' }
                },
                 {
                    title: '优先级',
                    dataIndex: 'priority',
                    scopedSlots: { customRender: 'priority' }
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    scopedSlots: { customRender: 'status' }
                },
                {
                    title: '更新时间',
                    dataIndex: 'updateTime',
                    customRender: (text, row) => {
                        return row.updateTime;
                    },
                    sorter: true
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    width: '150px',
                    scopedSlots: { customRender: 'action' }
                }
            ],
            // 加载数据方法 必须为 Promise 对象
            loadData: parameter => {
                console.log('loadData.parameter', parameter);
                return getServiceList(Object.assign(parameter, this.queryParam)).then(res => {
                    console.log('loadData.get result', res);
                    return res;
                });
            },
            selectedRowKeys: [],
            selectedRows: [],

            // custom table alert & rowSelection
            options: {
                alert: {
                    show: true,
                    clear: () => {
                        this.selectedRowKeys = [];
                    }
                },
                rowSelection: {
                    selectedRowKeys: this.selectedRowKeys,
                    onChange: this.onSelectChange
                }
            },
            optionAlertShow: false
        };
    },
    filters: {
        statusFilter(type) {
            return statusMap[type].text;
        },
        statusTypeFilter(type) {
            return statusMap[type].status;
        }
    },
    created() {
        this.tableOption();
        getRoleList({ t: new Date() });
    },
    methods: {
        tableOption() {
            if (!this.optionAlertShow) {
                this.options = {
                    alert: {
                        show: true,
                        clear: () => {
                            this.selectedRowKeys = [];
                        }
                    },
                    rowSelection: {
                        selectedRowKeys: this.selectedRowKeys,
                        onChange: this.onSelectChange,
                        getCheckboxProps: record => ({
                            props: {
                                disabled: record.no === 'No 2', // Column configuration not to be checked
                                name: record.no
                            }
                        })
                    }
                };
                this.optionAlertShow = true;
            } else {
                this.options = {
                    alert: false,
                    rowSelection: null
                };
                this.optionAlertShow = false;
            }
        },

        handleEdit(record) {
            this.$refs.editModal.edit(record);
        },

        handleStatus(record) {
            var curStatus = record.status;
            this.$confirm({
                title: '提示',
                content: '真的要更新状态?',
                onOk: () => {
                    record.status = curStatus === 1 ? 2 : 1
                    console.log('update status:', status);
                    return updateCrontabJob(record).then(res => {
                        this.$refs.mainTable.refresh();
                        this.$message.info('更新状态成功');
                    });
                },
                onCancel() {}
            });
        },

        handleDelete(record) {
            this.$confirm({
                title: '提示',
                content: '真的要删除吗?',
                onOk: () => {
                    console.log('delete record:', record);
                    return delCrontabJob({ 'id': record.id }).then(res => {
                        this.$refs.mainTable.refresh();
                        this.$message.info('删除成功');
                    });
                },
                onCancel() {}
            });
        },
        handleOk() {
            this.$refs.mainTable.refresh();
        },
        onSelectChange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys;
            this.selectedRows = selectedRows;
        },
        toggleAdvanced() {
            this.advanced = !this.advanced;
        },
        resetSearchForm() {
            this.queryParam = {
                date: moment(new Date())
            };
        }
    }
};
</script>
