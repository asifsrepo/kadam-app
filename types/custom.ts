import type { ReactNode } from "react";
import type { ButtonVariants } from "@/components/ui/button";

export interface BaseFormFieldProps {
	/** The label text displayed for the form field. */
	label?: string;
	/** Indicates whether the form field is a required input. */
	required?: boolean;
	/** Controls the visibility of the hint text. */
	showHint?: boolean;
	/** A short hint or placeholder text for the input. */
	hint?: string;
	/** Additional classes for hint */
	hintclass?: string;
	/** A detailed description or helper text for the form field. */
	description?: string;
	/** If true, the form field will be disabled and uneditable. */
	disabled?: boolean;
	/** Additional CSS classes to apply to the form field. */
	className?: string;
	/** An error message to display if the field validation fails. */
	error?: string;
	/** Additional CSS classes to apply to the form field's container. */
	wrapperClass?: string;
	/** The id for the label element. */
	labelId?: string;
}

export interface FormFieldWrapperProps extends BaseFormFieldProps {
	/** A render prop function that receives `id` and `describedBy` for accessibility. */
	children: (id: string, describedBy: string | undefined) => React.ReactNode;
}

export interface TooltipWrapperProps {
	/** The element(s) that will trigger the tooltip. */
	children: ReactNode;
	/** Text to show as tooltip content. */
	content: string;
	/**
	 *  Delay before showing the tooltip (in ms).
	 * @default 500ms
	 */
	duration?: number;
	/** Click handler for the trigger element. */
	onClick?: () => void;
	/**
	 *  Prevent propagation of the child element
	 * @default false
	 */
	preventdefault?: boolean;
}

export interface LoadingOverLayProps {
	/** Whether the overlay should be visible (true) or hidden (false). Default is false. */
	isLoading: boolean;
}

export interface ConfirmationDialogProps {
	/** Controls whether the dialog is open or closed */
	isOpen: boolean;
	/** Callback function called when the dialog should be closed (cancel button, escape key, overlay click) */
	onClose: () => void;
	/** Callback function called when the user confirms the action */
	onConfirm: (reason?: string) => void;
	/** The title text displayed in the dialog header
	 * @default "Confirm Action"
	 */
	title?: string;
	/** The description text explaining what will happen if the user confirms
	 * @default "Are you sure you want to proceed? This action cannot be undone."
	 */
	description?: string;
	/** Text displayed on the confirm button
	 * @default "Confirm"
	 */
	confirmText?: string;
	/** Text displayed on the cancel button
	 * @default "Cancel"
	 */
	cancelText?: string;
	/** Visual variant for the confirm button
	 * @default "default"
	 */
	confirmVariant?: ButtonVariants;
	/** Visual variant for the cancel button
	 * @default "outline"
	 */
	cancelVariant?: ButtonVariants;
	/** When true, shows loading state on confirm button and disables both buttons
	 * @default false
	 */
	loading?: boolean;
	/** When true, shows a text input field for the user to provide a reason
	 * @default false
	 */
	requireReason?: boolean;
	/** Placeholder text for the reason input field
	 * @default "Enter reason..."
	 */
	reasonPlaceholder?: string;
	/** Label text displayed above the reason input field
	 * @default "Reason"
	 */
	reasonLabel?: string;
}

export interface CustomPaginationProps {
	/** The total number of pages available for pagination. */
	totalPages: number;
	/** The maximum number of page links to display in the pagination bar.
	 * @default 5
	 */
	paginationItemsToDisplay?: number;
	/** An array of numbers representing the available page size options in the dropdown.
	 * @default [5, 10, 25, 50]
	 */
	pageSizeOptions?: number[];
	/** If true, displays the current page and total pages information (e.g., "Page 1 of 10").
	 * @default true
	 */
	showPageInfo?: boolean;
	/** If true, displays the dropdown for selecting the number of items per page.
	 * @default true
	 */
	showPageSizeSelector?: boolean;
	/** If true, disables all pagination controls and interactions.
	 * @default false
	 */
	disabled?: boolean;
	/** Additional CSS classes to apply to the pagination container. */
	className?: string;
}

export interface BreadcrumbItemType {
	/** The display text for the breadcrumb item */
	label: string;
	/** The link URL for navigation */
	href?: string;
	/** Marks this item as the current page */
	isCurrentPage?: boolean;
}

export interface CustomBreadcrumbProps {
	/**
	 *  An array of objects, where each object represents a breadcrumb link.
	 * @type {BreadcrumbItemType}
	 */
	items: BreadcrumbItemType[];
	/** When true, displays a skeleton loader instead of the breadcrumb.
	 * @default false
	 */
	isLoading?: boolean;
	/** Additional CSS classes to apply to the current page item.
	 * @default "text-2xl font-bold"
	 */
	currentClassName?: string;
	/** Additional CSS classes to apply to the root breadcrumb container. */
	className?: string;
	/** The number of items at which the breadcrumb should collapse into a dropdown.
	 * @default 6
	 */
	collapseAt?: number;
	/** The 0-based index from which to start collapsing items into the dropdown.
	 * @default 1
	 */
	dropdownStartIndex?: number;
	/** The number of items to always keep visible at the end of the breadcrumb.
	 * @default 2
	 */
	keepVisibleAtEnd?: number;
}
