import { parseAsInteger, useQueryState } from "nuqs";

interface UsePaginationStateOptions {
	defaultPageSize?: number;
	defaultPage?: number;
}

const usePaginationState = ({
	defaultPageSize = 12,
	defaultPage = 1,
}: UsePaginationStateOptions = {}) => {
	const [currentPage, setCurrentPage] = useQueryState(
		"page",
		parseAsInteger.withDefault(defaultPage),
	);

	const [pageSize, setPageSize] = useQueryState(
		"pageSize",
		parseAsInteger.withDefault(defaultPageSize),
	);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handlePageSizeChange = (newPageSize: number) => {
		setPageSize(newPageSize);
		// Reset to first page when changing page size
		if (currentPage > 1) {
			setCurrentPage(1);
		}
	};

	const resetPagination = () => {
		setCurrentPage(defaultPage);
		setPageSize(defaultPageSize);
	};

	return {
		currentPage,
		pageSize,
		handlePageChange,
		handlePageSizeChange,
		resetPagination,
		setCurrentPage,
		setPageSize,
	};
};

export default usePaginationState;
