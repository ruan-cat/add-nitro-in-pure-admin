import { useListQuery } from "@/composables/use-list-query";

export interface WelcomeTableItem {
	id: number;
	requiredNumber: number;
	questionNumber: number;
	resolveNumber: number;
	satisfaction: number;
	date: string;
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

/** API 路径 */
const API_URL = "/api/welcome-table";

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "welcome-table";

/**
 * 配置中心列表查询 Hook
 * Configuration center list query hook
 */
export function useWelcomeTableListQuery(queryParams: BaseListQueryParams) {
	return useListQuery<WelcomeTableItem, BaseListQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: API_URL,
		initialParams: queryParams,
	});
}
