"use client";

import { Calendar } from "lucide-react";
import { memo, useState } from "react";
import type { DropdownNavProps, DropdownProps } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps } from "@/types";
import CustomSelect from "./CustomSelect";
import FormFieldWrapper from "./FormFieldWrapper";

interface CustomDatePickerProps extends BaseFormFieldProps {
	/**
	 * @property value - The controlled selected date.
	 */
	value?: Date;
	/**
	 * @property defaultValue - The initial selected date when uncontrolled.
	 */
	defaultValue?: Date;
	/**
	 * @property onSelect - Callback function invoked when a date is selected.
	 */
	onSelect?: (date: Date | undefined) => void;
	/**
	 * @property placeholder - Placeholder text when no date is selected.
	 */
	placeholder?: string;
	/**
	 * @property startMonth - The earliest month to display (e.g., new Date(1980, 6)).
	 */
	startMonth?: Date;
	/**
	 * @property endMonth - The latest month to display.
	 */
	endMonth?: Date;
	/**
	 * @property disabledDates - Function to determine if a date should be disabled.
	 */
	disabledDates?: (date: Date) => boolean;
	/**
	 * @property includeTime - Whether to include time selection. Default: false.
	 */
	includeTime?: boolean;
	/**
	 * @property minuteStep - Step for minute selection (1, 5, 15, 30). Default: 1.
	 */
	minuteStep?: 1 | 5 | 15 | 30;
}

const DropdownNav = (props: DropdownNavProps) => {
	return <div className="flex w-full items-center gap-2">{props.children}</div>;
};

const Dropdown = (props: DropdownProps) => {
	const handleCalendarChange = (
		_value: string | number,
		_e: React.ChangeEventHandler<HTMLSelectElement>,
	) => {
		const _event = {
			target: {
				value: String(_value),
			},
		} as React.ChangeEvent<HTMLSelectElement>;
		_e(_event);
	};
	return (
		<CustomSelect
			options={
				props.options?.map((option) => ({
					value: String(option.value),
					label: option.label,
					disabled: option.disabled,
				})) || []
			}
			value={String(props.value)}
			onValueChange={(value) => {
				if (props.onChange) {
					handleCalendarChange(value, props.onChange);
				}
			}}
			className="h-9 max-h-9 w-28 text-xs"
		/>
	);
};

const CustomDatePicker = ({
	value,
	defaultValue,
	onSelect,
	placeholder = "Select a date",
	startMonth = new Date(1980, 0),
	endMonth = new Date(2050, 11),
	disabledDates,
	includeTime = false,
	minuteStep = 1,
	...props
}: CustomDatePickerProps) => {
	const [internalDate, setInternalDate] = useState<Date | undefined>(defaultValue);
	const [open, setOpen] = useState(false);

	// Use controlled value if provided, otherwise use internal state
	const selectedDate = value !== undefined ? value : internalDate;

	const handleDateSelect = (date: Date | undefined) => {
		if (!includeTime) {
			// If time is not included, behave as before
			if (value === undefined) {
				setInternalDate(date);
			}
			onSelect?.(date);
			setOpen(false);
			return;
		}

		// If time is included, preserve existing time when selecting a new date
		if (date) {
			const newDate = new Date(date);
			if (selectedDate) {
				newDate.setHours(selectedDate.getHours());
				newDate.setMinutes(selectedDate.getMinutes());
			} else {
				// Set default time to current time if no previous selection
				const now = new Date();
				newDate.setHours(now.getHours());
				newDate.setMinutes(now.getMinutes());
			}

			if (value === undefined) {
				setInternalDate(newDate);
			}
			onSelect?.(newDate);
		} else {
			if (value === undefined) {
				setInternalDate(undefined);
			}
			onSelect?.(undefined);
		}
	};

	const handleTimeChange = (hours: number, minutes: number) => {
		if (!selectedDate) return;

		const newDate = new Date(selectedDate);
		newDate.setHours(hours);
		newDate.setMinutes(minutes);

		if (value === undefined) {
			setInternalDate(newDate);
		}
		onSelect?.(newDate);
	};

	// Generate hour options based on format
	const generateHourOptions = () => {
		return Array.from({ length: 12 }, (_, i) => ({
			value: (i === 0 ? 12 : i).toString(),
			label: (i === 0 ? 12 : i).toString(),
		}));
	};

	// Generate minute options based on step
	const generateMinuteOptions = () => {
		const options = [];
		for (let i = 0; i < 60; i += minuteStep) {
			options.push({
				value: i.toString(),
				label: i.toString().padStart(2, "0"),
			});
		}
		return options;
	};

	// Format selected date for display
	const formatSelectedDate = (date: Date) => {
		if (!includeTime) {
			return date.toLocaleDateString();
		}

		const dateStr = date.toLocaleDateString();
		const timeStr = date.toLocaleTimeString("en-US", {
			hour12: true,
			hour: "numeric",
			minute: "2-digit",
		});
		return `${dateStr} ${timeStr}`;
	};

	// Get current time values for selectors
	const getCurrentHour = () => {
		if (!selectedDate) return "12";
		const hour = selectedDate.getHours();
		return (hour === 0 ? 12 : hour > 12 ? hour - 12 : hour).toString();
	};

	const getCurrentMinute = () => {
		if (!selectedDate) return "0";
		return selectedDate.getMinutes().toString();
	};

	const getCurrentPeriod = () => {
		if (!selectedDate) return "AM";
		return selectedDate.getHours() >= 12 ? "PM" : "AM";
	};

	const { error, className } = props;

	return (
		<FormFieldWrapper {...props}>
			{(id, describedBy) => (
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							id={id}
							variant="outline"
							className={cn(
								"w-full justify-start text-left font-normal",
								!selectedDate && "text-muted-foreground",
								error && "border-destructive focus-visible:ring-destructive",
								className,
							)}
							disabled={props.disabled}
							aria-describedby={describedBy}
							aria-invalid={!!error}
							aria-expanded={open}
							aria-haspopup="dialog"
						>
							<Calendar className="mr-2 h-4 w-4" />
							{selectedDate ? (
								formatSelectedDate(selectedDate)
							) : (
								<span>{placeholder}</span>
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<div className="space-y-3">
							<CalendarComponent
								mode="single"
								selected={selectedDate}
								onSelect={handleDateSelect}
								className="rounded-2xl border-0 p-3"
								captionLayout="dropdown"
								defaultMonth={selectedDate || new Date()}
								startMonth={startMonth}
								endMonth={endMonth}
								hideNavigation
								disabled={disabledDates}
								classNames={{
									month_caption: "justify-stretch",
									day: "x-0 px-0",
								}}
								components={{
									DropdownNav,
									Dropdown,
								}}
							/>

							{includeTime && selectedDate && (
								<div className="border-t p-3">
									<div className="flex items-center gap-2">
										{/*  */}
										<CustomSelect
											options={generateHourOptions()}
											value={getCurrentHour()}
											onValueChange={(value) => {
												let hour = +value;
												const period = getCurrentPeriod();
												if (period === "PM" && hour !== 12) hour += 12;
												if (period === "AM" && hour === 12) hour = 0;
												handleTimeChange(
													hour,
													getCurrentMinute() ? +getCurrentMinute() : 0,
												);
											}}
											className="h-9 max-h-9 w-16 text-xs"
										/>

										<span className="text-muted-foreground">:</span>
										{/*  */}
										<CustomSelect
											options={generateMinuteOptions()}
											value={getCurrentMinute()}
											onValueChange={(value) => {
												const minute = +value;
												const hour = selectedDate.getHours();
												handleTimeChange(hour, minute);
											}}
											className="h-9 max-h-9 w-16 text-xs"
										/>

										{/* AM/PM selector */}
										<CustomSelect
											options={[
												{ value: "AM", label: "AM" },
												{ value: "PM", label: "PM" },
											]}
											value={getCurrentPeriod()}
											onValueChange={(value) => {
												let hour = +getCurrentHour();
												if (value === "PM" && hour !== 12) hour += 12;
												if (value === "AM" && hour === 12) hour = 0;
												if (
													value === "AM" &&
													getCurrentPeriod() === "PM" &&
													hour > 12
												)
													hour -= 12;
												handleTimeChange(hour, +getCurrentMinute());
											}}
											className="h-9 max-h-9 w-16 text-xs"
										/>
									</div>
								</div>
							)}
						</div>
					</PopoverContent>
				</Popover>
			)}
		</FormFieldWrapper>
	);
};

export default memo(CustomDatePicker);
