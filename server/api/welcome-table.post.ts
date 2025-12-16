import { defineHandler, readBody } from "nitro/h3";
import { mockWelcomeTableData, type WelcomeTableItem } from "./welcome-table-mock-data";

/**
 * @file 欢迎表格数据接口
 * @description Welcome table data API
 * http://localhost:8080/api/welcome-table
 */

interface JsonVO<T> {
	/** 状态码 */
	code: number;

	/** 提示消息 */

	message: string;

	/** 数据对象 */
	data: T;
}

/**
 * 分页数据传输对象
 * Page data transfer object
 */
interface PageDTO<T> {
	/** 数据列表 Data list */
	list: T[];
	/** 总记录数 Total count */
	total: number;
	/** 当前页码 Current page */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
	/** 总页数 Total pages */
	totalPages: number;
}

/**
 * 基础分页查询参数
 * Base pagination query parameters
 */
interface BaseListQueryParams {
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/** 默认每页大小 Default page size */
const DEFAULT_PAGE_SIZE = 10;

/** 默认页码 Default page index */
const DEFAULT_PAGE_INDEX = 1;

export default defineHandler(async (event): Promise<JsonVO<PageDTO<WelcomeTableItem>>> => {
	const body = await readBody<BaseListQueryParams>(event);
	const defaultParams: BaseListQueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};

	const mergedParams = Object.assign({}, defaultParams, body);
	const { pageIndex, pageSize } = mergedParams;

	/** 分页处理 */
	const total = mockWelcomeTableData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = mockWelcomeTableData.slice(startIndex, startIndex + pageSize);

	/** 返回标准格式 */
	const response: JsonVO<PageDTO<WelcomeTableItem>> = {
		code: 200,
		message: "success",
		data: {
			list: pageData,
			total,
			pageIndex,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		},
	};

	return response;
});
