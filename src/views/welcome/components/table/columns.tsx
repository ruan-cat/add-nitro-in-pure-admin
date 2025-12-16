import { tableData } from "../../data";
import { delay } from "@pureadmin/utils";
import { ref, onMounted, reactive } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import ThumbUp from "~icons/ri/thumb-up-line";
import Hearts from "~icons/ri/hearts-line";
import Empty from "./empty.svg?component";

import { useWelcomeTableListQuery } from "@/api/welcome-table";

export function useColumns() {
	const {
		tableData,
		total,
		pageIndex,
		pageSize,
		totalPages,
		queryParams,
		isLoading,
		isFetching,
		error,
		refetch,
		updateParams,
		resetParams,
		query,
	} = useWelcomeTableListQuery({
		pageIndex: 1,
		pageSize: 10,
	});

	const dataList = tableData;
	const loading = isLoading;

	const columns: TableColumnList = [
		{
			sortable: true,
			label: "序号",
			prop: "id",
		},
		{
			sortable: true,
			label: "需求人数",
			prop: "requiredNumber",
			filterMultiple: false,
			filterClassName: "pure-table-filter",
			filters: [
				{ text: "≥16000", value: "more" },
				{ text: "<16000", value: "less" },
			],
			filterMethod: (value, { requiredNumber }) => {
				return value === "more" ? requiredNumber >= 16000 : requiredNumber < 16000;
			},
		},
		{
			sortable: true,
			label: "提问数量",
			prop: "questionNumber",
		},
		{
			sortable: true,
			label: "解决数量",
			prop: "resolveNumber",
		},
		{
			sortable: true,
			label: "用户满意度",
			minWidth: 100,
			prop: "satisfaction",
			cellRenderer: ({ row }) => (
				<div class='flex justify-center w-full'>
					<span class='flex items-center w-[60px]'>
						<span class='ml-auto mr-2'>{row.satisfaction}%</span>
						<iconifyIconOffline icon={row.satisfaction > 98 ? Hearts : ThumbUp} color='#e85f33' />
					</span>
				</div>
			),
		},
		{
			sortable: true,
			label: "统计日期",
			prop: "date",
		},
		{
			label: "操作",
			fixed: "right",
			slot: "operation",
		},
	];

	/** 分页配置 */
	const pagination = reactive<PaginationProps>({
		pageSize: pageSize.value,
		currentPage: pageIndex.value,
		layout: "prev, pager, next",
		total: total.value,
		align: "center",
	});

	function onCurrentChange(page: number) {
		console.log("onCurrentChange", page);
		updateParams({ pageIndex: page });
		refetch();
	}

	onMounted(() => {
		pagination.total = total.value;
	});

	return {
		Empty,
		loading,
		columns,
		dataList,
		pagination,
		onCurrentChange,
	};
}
