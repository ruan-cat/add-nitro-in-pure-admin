/**
 * @file 配置中心列表接口
 * @description Configuration center list API
 * http://localhost:8080/api/dev-team/config-manage/center/list
 */

import { mockConfigCenterData } from "./mock-data";
import { defineHandler, readBody } from "nitro/h3";

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

/**
 * 配置中心列表数据
 * Configuration center list item
 */
interface ConfigCenterListItem {
	/** 配置项ID Config item ID */
	configId: string;
	/** 配置项名称 Config item name */
	configName: string;
	/** 配置类型 Config type */
	configType: string;
	/** 配置键名 Config key */
	configKey: string;
	/** 配置值 Config value */
	configValue: string;
	/** 默认值 Default value */
	defaultValue: string;
	/** 配置描述 Config description */
	configDescription: string;
	/** 状态 Status */
	status: string;
	/** 排序号 Sort order */
	sortOrder: number;
	/** 备注 Remark */
	remark: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 创建人 Creator */
	creator: string;
	/** 更新人 Updater */
	updater: string;
}

/**
 * 配置中心查询参数
 * Configuration center query parameters
 */
interface ConfigCenterQueryParams extends BaseListQueryParams {
	/** 配置项名称 Config item name */
	configName?: string;
	/** 配置类型 Config type */
	configType?: string;
	/** 状态 Status */
	status?: string;
	/** 配置键名 Config key */
	configKey?: string;
}

/** 默认每页大小 Default page size */
const DEFAULT_PAGE_SIZE = 10;

/** 默认页码 Default page index */
const DEFAULT_PAGE_INDEX = 1;

// Promise<JsonVO<PageDTO<ConfigCenterListItem>>>
export default defineHandler(async (event): Promise<JsonVO<PageDTO<ConfigCenterListItem>>> => {
	const body = await readBody<ConfigCenterQueryParams>(event);
	const defaultParams: ConfigCenterQueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};

	const mergedParams = Object.assign({}, defaultParams, body);
	const { pageIndex, pageSize } = mergedParams;

	/** 数据筛选 */
	let filteredData = [...mockConfigCenterData];

	if (mergedParams?.configName) {
		filteredData = filteredData.filter((item) => item.configName.includes(mergedParams.configName!));
	}
	if (mergedParams?.configType) {
		filteredData = filteredData.filter((item) => item.configType === mergedParams.configType);
	}
	if (mergedParams?.status) {
		filteredData = filteredData.filter((item) => item.status === mergedParams.status);
	}
	if (mergedParams?.configKey) {
		filteredData = filteredData.filter((item) => item.configKey.includes(mergedParams.configKey!));
	}

	/** 分页处理 */
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	/** 返回标准格式 */
	const response: JsonVO<PageDTO<ConfigCenterListItem>> = {
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
