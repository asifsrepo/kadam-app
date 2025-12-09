# Implement base plan restrictions
_Exported on 08/12/2025 at 14:17:46 GMT+5:30 from Cursor (2.1.50)_

---

**User**

@constants/index.tsx:1-38 if the user is not in a plan we need to make sure that user have the restrictions which is on the base plan, 

we need to add the limits one by one @hooks/queries/useSubscription.ts:1-87 in modules@app 

---

**Cursor**

Reviewing the codebase to understand the subscription system and identify where to enforce Basic plan limits for users without a subscription.


Checking how the subscription plan name is determined:


Clarifying a few points before creating the plan:


---

**User**

continue

---

**Cursor**

Creating the plan to enforce Basic plan limits for users without a subscription.


---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

I'll implement the plan step by step, starting with the first todo.

---

**User**

continue

---

**Cursor**

I'll continue implementing the plan. Let me start by reading the subscriptions utility file and adding the plan limits functions.

Now I'll add the plan limits utility functions:

```typescript
import type { ISubscription, SubscriptionName, SubscriptionStatus } from "@/types/subscription";

/**
 * Gets the plan display name
 */
export const getPlanDisplayName = (planName: SubscriptionName): string => {
	const planNames: Record<SubscriptionName, string> = {
		basic: "Basic",
		pro: "Pro",
		enterprise: "Enterprise",
	};
	return planNames[planName] || planName;
};

/**
 * Formats subscription status for display
 */
export const formatSubscriptionStatus = (status: SubscriptionStatus): string => {
	const statusMap: Record<SubscriptionStatus, string> = {
		active: "Active",
		cancelled: "Cancelled",
		expired: "Expired",
		on_hold: "On Hold",
		past_due: "Past Due",
		trialing: "Trial",
		upgraded: "Upgraded",
		downgraded: "Downgraded",
	};
	return statusMap[status] || status;
};

/**
 * Checks if a subscription is currently active
 */
export const isSubscriptionActive = (subscription: ISubscription | null): boolean => {
	if (!subscription) return false;
	return subscription.status === "active" || subscription.status === "trialing";
};

/**
 * Checks if subscription is cancelled but still active until period end
 */
export const isCancellingAtPeriodEnd = (subscription: ISubscription | null): boolean => {
	if (!subscription) return false;
	return subscription.cancelAtPeriodEnd && subscription.status === "active";
};

/**
 * Plan limits interface
 */
export interface PlanLimits {
	maxCustomers: number | null; // null means unlimited
	maxBranches: number | null; // null means unlimited
}

/**
 * Gets the effective plan name for a user
 * Returns "basic" if no active subscription, otherwise returns the subscription plan name
 */
export const getEffectivePlanName = (subscription: ISubscription | null): SubscriptionName => {
	if (!subscription || !isSubscriptionActive(subscription)) {
		return "basic";
	}
	return subscription.planName;
};

/**
 * Gets plan limits based on the subscription
 */
export const getPlanLimits = (subscription: ISubscription | null): PlanLimits => {
	const effectivePlan = getEffectivePlanName(subscription);

	const limits: Record<SubscriptionName, PlanLimits> = {
		basic: {
			maxCustomers: 10,
			maxBranches: 1,
		},
		pro: {
			maxCustomers: null, // unlimited
			maxBranches: null, // unlimited
		},
		enterprise: {
			maxCustomers: null, // unlimited
			maxBranches: null, // unlimited
		},
	};

	return limits[effectivePlan];
};

/**
 * Checks if user can create a new customer based on their plan limits
 */
export const canCreateCustomer = (
	subscription: ISubscription | null,
	currentCustomerCount: number,
): boolean => {
	const limits = getPlanLimits(subscription);

	// If maxCustomers is null, it's unlimited
	if (limits.maxCustomers === null) {
		return true;
	}

	return currentCustomerCount < limits.maxCustomers;
};

/**
 * Checks if user can create a new branch based on their plan limits
 */
export const canCreateBranch = (
	subscription: ISubscription | null,
	currentBranchCount: number,
): boolean => {
	const limits = getPlanLimits(subscription);

	// If maxBranches is null, it's unlimited
	if (limits.maxBranches === null) {
		return true;
	}

	return currentBranchCount < limits.maxBranches;
};

```

Good! Now let me check for lints and then move to the next todo:

Now I'll update the useSubscription hook to include plan limits and helpers:

```typescript
import { useEffect } from "react";
import { create } from "zustand";
import { BASE_URL } from "@/config";
import {
    canCreateBranch,
    canCreateCustomer,
    getEffectivePlanName,
    getPlanLimits,
    isCancellingAtPeriodEnd,
    isSubscriptionActive,
} from "@/lib/utils/subscriptions";
import type { ISubscription } from "@/types/subscription";

interface SubscriptionState {
	subscription: ISubscription | null;
	isLoading: boolean;
	error: Error | null;
	isInitialized: boolean;

	fetchSubscription: (force?: boolean) => Promise<void>;
	refetch: () => Promise<void>;
}

const initialState: Omit<SubscriptionState, "fetchSubscription" | "refetch"> = {
	subscription: null,
	isLoading: false,
	error: null,
	isInitialized: false,
};

const useSubscriptionStore = create<SubscriptionState>()((set, get) => ({
	...initialState,

	fetchSubscription: async (force = false) => {
		if (get().isInitialized && !force) {
			return;
		}

		set({ isLoading: true, error: null });

		try {
			const url = `${BASE_URL}/api/subscriptions`;
			const response = await fetch(url);

			if (!response.ok) {
				set({
					subscription: null,
					isInitialized: true,
					error: new Error(`Failed to fetch subscription: ${response.statusText}`),
				});
				return;
			}

			const data = await response.json();
			set({
				subscription: data || null,
				isInitialized: true,
				error: null,
			});
		} catch (error) {
			set({
				subscription: null,
				isInitialized: true,
				error: error instanceof Error ? error : new Error("Failed to fetch subscription"),
			});
		} finally {
			set({ isLoading: false });
		}
	},

	refetch: async () => {
		await get().fetchSubscription(true);
	},
}));

export const useSubscription = () => {
	const store = useSubscriptionStore();

	useEffect(() => {
		store.fetchSubscription();
	}, [store.fetchSubscription]);

	const subscriptionData = store.subscription || null;

	return {
		subscription: subscriptionData,
		isLoading: store.isLoading,
		error: store.error,
		isActive: isSubscriptionActive(subscriptionData),
		isCancellingAtPeriodEnd: isCancellingAtPeriodEnd(subscriptionData),
		refetch: store.refetch,
	};
};

```

```typescript
import { useEffect } from "react";
import { create } from "zustand";
import { BASE_URL } from "@/config";
import {
    canCreateBranch,
    canCreateCustomer,
    getEffectivePlanName,
    getPlanLimits,
    isCancellingAtPeriodEnd,
    isSubscriptionActive,
} from "@/lib/utils/subscriptions";
import type { ISubscription } from "@/types/subscription";

interface SubscriptionState {
	subscription: ISubscription | null;
	isLoading: boolean;
	error: Error | null;
	isInitialized: boolean;

	fetchSubscription: (force?: boolean) => Promise<void>;
	refetch: () => Promise<void>;
}

const initialState: Omit<SubscriptionState, "fetchSubscription" | "refetch"> = {
	subscription: null,
	isLoading: false,
	error: null,
	isInitialized: false,
};

const useSubscriptionStore = create<SubscriptionState>()((set, get) => ({
	...initialState,

	fetchSubscription: async (force = false) => {
		if (get().isInitialized && !force) {
			return;
		}

		set({ isLoading: true, error: null });

		try {
			const url = `${BASE_URL}/api/subscriptions`;
			const response = await fetch(url);

			if (!response.ok) {
				set({
					subscription: null,
					isInitialized: true,
					error: new Error(`Failed to fetch subscription: ${response.statusText}`),
				});
				return;
			}

			const data = await response.json();
			set({
				subscription: data || null,
				isInitialized: true,
				error: null,
			});
		} catch (error) {
			set({
				subscription: null,
				isInitialized: true,
				error: error instanceof Error ? error : new Error("Failed to fetch subscription"),
			});
		} finally {
			set({ isLoading: false });
		}
	},

	refetch: async () => {
		await get().fetchSubscription(true);
	},
}));

export const useSubscription = () => {
	const store = useSubscriptionStore();

	useEffect(() => {
		store.fetchSubscription();
	}, [store.fetchSubscription]);

	const subscriptionData = store.subscription || null;
	const effectivePlanName = getEffectivePlanName(subscriptionData);
	const planLimits = getPlanLimits(subscriptionData);

	return {
		subscription: subscriptionData,
		isLoading: store.isLoading,
		error: store.error,
		isActive: isSubscriptionActive(subscriptionData),
		isCancellingAtPeriodEnd: isCancellingAtPeriodEnd(subscriptionData),
		effectivePlanName,
		planLimits,
		canCreateCustomer: (currentCount: number) =>
			canCreateCustomer(subscriptionData, currentCount),
		canCreateBranch: (currentCount: number) => canCreateBranch(subscriptionData, currentCount),
		refetch: store.refetch,
	};
};

```

Now I'll create a hook to count total customers. Let me check the hooks directory structure:

```typescript
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/hooks/store/useAuth";
import { createClient } from "@/lib/supabase/client";
import { QueryKeys, Tables } from "@/types";

export const useCustomerCount = () => {
    const { user } = useAuth();
    const supabase = createClient();

    return useQuery({
        queryKey: [QueryKeys.CustomersList, "count", user?.id],
        queryFn: async () => {
            const { count, error } = await supabase
                .from(Tables.Customers)
                .select("*", { count: "exact", head: true })
                .eq("createdBy", user?.id);

            if (error) throw error;

            return count || 0;
        },
        enabled: !!user?.id,
    });
};

```

Now I'll add customer limit validation to the new customer page:

```typescriptreact
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/store/useAuth";
import { useCustomerCount } from "@/hooks/queries/useCustomerCount";
import { useSubscription } from "@/hooks/queries/useSubscription";
import useStores from "@/hooks/store/useStores";
import type { CustomerFormData } from "@/lib/schema/customer";
import { customerSchema } from "@/lib/schema/customer";
import { createClient } from "@/lib/supabase/client";
import { QueryKeys, Tables } from "@/types";
import { ICustomer } from "@/types/customers";
import CustomInput from "~/form-elements/CustomInput";
import CustomSelect from "~/form-elements/CustomSelect";
import CustomTextArea from "~/form-elements/CustomTextArea";
import SubmitButton from "~/form-elements/SubmitButton";

const STATUS_OPTIONS = [
	{ value: "active", label: "Active" },
	{ value: "inactive", label: "Inactive" },
];

const NewCustomerPage = () => {
	const router = useRouter();
	const supabase = createClient();
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const { activeBranch, debtLimit } = useStores();

	const { mutate, isPending } = useMutation({
		mutationFn: async (data: CustomerFormData) => {
			const { error } = await supabase.from(Tables.Customers).insert({
				name: data.name,
				email: data.email,
				phone: data.phone,
				address: data.address,
				idNumber: data.idNumber,
				status: data.status,
				limit: data.limit,
				createdAt: new Date().toISOString(),
				createdBy: user?.id,
				branchId: activeBranch?.id,
			} as ICustomer);
			if (error) throw error;

			return data;
		},
		onSuccess: async () => {
			toast.success("Customer created successfully!");
			router.back();
			setTimeout(async () => {
				await queryClient.invalidateQueries({
					queryKey: [QueryKeys.CustomersList],
				});
			}, 100);
		},
		onError: () => {
			toast.error("Failed to create customer. Please try again.");
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<CustomerFormData>({
		resolver: zodResolver(customerSchema),
		defaultValues: {
			status: "active",
			limit: debtLimit,
			email: "",
		},
	});
	const watchedLimit = watch("limit");

	useEffect(() => {
		setValue("limit", debtLimit);
	}, [debtLimit, setValue]);

	const onSubmit = async (data: CustomerFormData) => {
		mutate(data);
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="sticky top-0 z-10 border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="flex items-center gap-4 px-4 py-3 md:px-6">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => router.back()}
						className="h-9 w-9"
					>
						<ArrowLeft className="h-5 w-5" />
						<span className="sr-only">Go back</span>
					</Button>
					<h1 className="font-semibold text-lg">New Customer</h1>
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl p-4 md:p-6">
				<div className="space-y-6">
					<div className="space-y-4">
						<CustomInput
							label="Full Name"
							placeholder="Enter customer name"
							required
							error={errors.name?.message}
							{...register("name")}
						/>

						<CustomInput
							label="Email"
							type="email"
							placeholder="customer@example.com"
							error={errors.email?.message}
							{...register("email")}
						/>

						<CustomInput
							label="Phone Number"
							type="tel"
							placeholder="+1 (555) 000-0000"
							required
							error={errors.phone?.message}
							{...register("phone")}
						/>

						<CustomInput
							label="ID Number"
							placeholder="Enter ID/Passport number"
							error={errors.idNumber?.message}
							{...register("idNumber")}
						/>
					</div>

					<div className="space-y-4">
						<CustomTextArea
							label="Address"
							placeholder="Enter full address"
							rows={3}
							required
							error={errors.address?.message}
							{...register("address")}
						/>
					</div>

					<div className="space-y-4">
						<CustomSelect
							label="Customer Status"
							placeholder="Select status"
							required
							options={STATUS_OPTIONS}
							className="w-full"
							value={watch("status")}
							onValueChange={(value) =>
								setValue("status", value as "active" | "inactive")
							}
							error={errors.status?.message}
						/>

						<CustomInput
							label="Credit Limit"
							type="number"
							placeholder="0.00"
							required
							step="0.01"
							min="0"
							description={
								watchedLimit > debtLimit
									? `Exceeds branch debt limit of ${debtLimit}`
									: ""
							}
							showHint
							error={errors.limit?.message}
							{...register("limit", { valueAsNumber: true })}
						/>
					</div>

					<div className="flex flex-col-reverse gap-3 pt-4 md:flex-row md:justify-end">
						<Button
							type="button"
							variant="outline"
							onClick={() => router.back()}
							disabled={isPending}
							className="w-full md:w-auto"
						>
							Cancel
						</Button>
						<SubmitButton
							isLoading={isPending}
							disabled={isPending}
							className="w-full md:w-auto"
						>
							Create Customer
						</SubmitButton>
					</div>
				</div>
			</form>
		</div>
	);
};

export default NewCustomerPage;

```

```typescriptreact
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/store/useAuth";
import { useCustomerCount } from "@/hooks/queries/useCustomerCount";
import { useSubscription } from "@/hooks/queries/useSubscription";
import useStores from "@/hooks/store/useStores";
import type { CustomerFormData } from "@/lib/schema/customer";
import { customerSchema } from "@/lib/schema/customer";
import { createClient } from "@/lib/supabase/client";
import { QueryKeys, Tables } from "@/types";
import { ICustomer } from "@/types/customers";
import CustomInput from "~/form-elements/CustomInput";
import CustomSelect from "~/form-elements/CustomSelect";
import CustomTextArea from "~/form-elements/CustomTextArea";
import SubmitButton from "~/form-elements/SubmitButton";

const STATUS_OPTIONS = [
	{ value: "active", label: "Active" },
	{ value: "inactive", label: "Inactive" },
];

const NewCustomerPage = () => {
	const router = useRouter();
	const supabase = createClient();
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const { activeBranch, debtLimit } = useStores();
	const { data: customerCount = 0 } = useCustomerCount();
	const { canCreateCustomer, planLimits } = useSubscription();

	const { mutate, isPending } = useMutation({
		mutationFn: async (data: CustomerFormData) => {
			const { error } = await supabase.from(Tables.Customers).insert({
				name: data.name,
				email: data.email,
				phone: data.phone,
				address: data.address,
				idNumber: data.idNumber,
				status: data.status,
				limit: data.limit,
				createdAt: new Date().toISOString(),
				createdBy: user?.id,
				branchId: activeBranch?.id,
			} as ICustomer);
			if (error) throw error;

			return data;
		},
		onSuccess: async () => {
			toast.success("Customer created successfully!");
			router.back();
			setTimeout(async () => {
				await queryClient.invalidateQueries({
					queryKey: [QueryKeys.CustomersList],
				});
			}, 100);
		},
		onError: () => {
			toast.error("Failed to create customer. Please try again.");
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<CustomerFormData>({
		resolver: zodResolver(customerSchema),
		defaultValues: {
			status: "active",
			limit: debtLimit,
			email: "",
		},
	});
	const watchedLimit = watch("limit");

	useEffect(() => {
		setValue("limit", debtLimit);
	}, [debtLimit, setValue]);

	const onSubmit = async (data: CustomerFormData) => {
		mutate(data);
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="sticky top-0 z-10 border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="flex items-center gap-4 px-4 py-3 md:px-6">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => router.back()}
						className="h-9 w-9"
					>
						<ArrowLeft className="h-5 w-5" />
						<span className="sr-only">Go back</span>
					</Button>
					<h1 className="font-semibold text-lg">New Customer</h1>
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl p-4 md:p-6">
				<div className="space-y-6">
					<div className="space-y-4">
						<CustomInput
							label="Full Name"
							placeholder="Enter customer name"
							required
							error={errors.name?.message}
							{...register("name")}
						/>

						<CustomInput
							label="Email"
							type="email"
							placeholder="customer@example.com"
							error={errors.email?.message}
							{...register("email")}
						/>

						<CustomInput
							label="Phone Number"
							type="tel"
							placeholder="+1 (555) 000-0000"
							required
							error={errors.phone?.message}
							{...register("phone")}
						/>

						<CustomInput
							label="ID Number"
							placeholder="Enter ID/Passport number"
							error={errors.idNumber?.message}
							{...register("idNumber")}
						/>
					</div>

					<div className="space-y-4">
						<CustomTextArea
							label="Address"
							placeholder="Enter full address"
							rows={3}
							required
							error={errors.address?.message}
							{...register("address")}
						/>
					</div>

					<div className="space-y-4">
						<CustomSelect
							label="Customer Status"
							placeholder="Select status"
							required
							options={STATUS_OPTIONS}
							className="w-full"
							value={watch("status")}
							onValueChange={(value) =>
								setValue("status", value as "active" | "inactive")
							}
							error={errors.status?.message}
						/>

						<CustomInput
							label="Credit Limit"
							type="number"
							placeholder="0.00"
							required
							step="0.01"
							min="0"
							description={
								watchedLimit > debtLimit
									? `Exceeds branch debt limit of ${debtLimit}`
									: ""
							}
							showHint
							error={errors.limit?.message}
							{...register("limit", { valueAsNumber: true })}
						/>
					</div>

					<div className="flex flex-col-reverse gap-3 pt-4 md:flex-row md:justify-end">
						<Button
							type="button"
							variant="outline"
							onClick={() => router.back()}
							disabled={isPending}
							className="w-full md:w-auto"
						>
							Cancel
						</Button>
						<SubmitButton
							isLoading={isPending}
							disabled={isPending}
							className="w-full md:w-auto"
						>
							Create Customer
						</SubmitButton>
					</div>
				</div>
			</form>
		</div>
	);
};

export default NewCustomerPage;

```

```typescriptreact
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/store/useAuth";
import { useCustomerCount } from "@/hooks/queries/useCustomerCount";
import { useSubscription } from "@/hooks/queries/useSubscription";
import useStores from "@/hooks/store/useStores";
import type { CustomerFormData } from "@/lib/schema/customer";
import { customerSchema } from "@/lib/schema/customer";
import { createClient } from "@/lib/supabase/client";
import { QueryKeys, Tables } from "@/types";
import { ICustomer } from "@/types/customers";
import CustomInput from "~/form-elements/CustomInput";
import CustomSelect from "~/form-elements/CustomSelect";
import CustomTextArea from "~/form-elements/CustomTextArea";
import SubmitButton from "~/form-elements/SubmitButton";

const STATUS_OPTIONS = [
	{ value: "active", label: "Active" },
	{ value: "inactive", label: "Inactive" },
];

const NewCustomerPage = () => {
	const router = useRouter();
	const supabase = createClient();
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const { activeBranch, debtLimit } = useStores();
	const { data: customerCount = 0 } = useCustomerCount();
	const { canCreateCustomer, planLimits } = useSubscription();

	const { mutate, isPending } = useMutation({
		mutationFn: async (data: CustomerFormData) => {
			const { error } = await supabase.from(Tables.Customers).insert({
				name: data.name,
				email: data.email,
				phone: data.phone,
				address: data.address,
				idNumber: data.idNumber,
				status: data.status,
				limit: data.limit,
				createdAt: new Date().toISOString(),
				createdBy: user?.id,
				branchId: activeBranch?.id,
			} as ICustomer);
			if (error) throw error;

			return data;
		},
		onSuccess: async () => {
			toast.success("Customer created successfully!");
			router.back();
			setTimeout(async () => {
				await queryClient.invalidateQueries({
					queryKey: [QueryKeys.CustomersList],
				});
			}, 100);
		},
		onError: () => {
			toast.error("Failed to create customer. Please try again.");
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<CustomerFormData>({
		resolver: zodResolver(customerSchema),
		defaultValues: {
			status: "active",
			limit: debtLimit,
			email: "",
		},
	});
	const watchedLimit = watch("limit");

	useEffect(() => {
		setValue("limit", debtLimit);
	}, [debtLimit, setValue]);

	const onSubmit = async (data: CustomerFormData) => {
		// Check if user can create a customer based on plan limits
		if (!canCreateCustomer(customerCount)) {
			toast.error(
				`You've reached the customer limit (${planLimits.maxCustomers}) for your plan. Upgrade to Pro for unlimited customers.`,
			);
			return;
		}

		mutate(data);
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="sticky top-0 z-10 border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="flex items-center gap-4 px-4 py-3 md:px-6">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => router.back()}
						className="h-9 w-9"
					>
						<ArrowLeft className="h-5 w-5" />
						<span className="sr-only">Go back</span>
					</Button>
					<h1 className="font-semibold text-lg">New Customer</h1>
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl p-4 md:p-6">
				<div className="space-y-6">
					<div className="space-y-4">
						<CustomInput
							label="Full Name"
							placeholder="Enter customer name"
							required
							error={errors.name?.message}
							{...register("name")}
						/>

						<CustomInput
							label="Email"
							type="email"
							placeholder="customer@example.com"
							error={errors.email?.message}
							{...register("email")}
						/>

						<CustomInput
							label="Phone Number"
							type="tel"
							placeholder="+1 (555) 000-0000"
							required
							error={errors.phone?.message}
							{...register("phone")}
						/>

						<CustomInput
							label="ID Number"
							placeholder="Enter ID/Passport number"
							error={errors.idNumber?.message}
							{...register("idNumber")}
						/>
					</div>

					<div className="space-y-4">
						<CustomTextArea
							label="Address"
							placeholder="Enter full address"
							rows={3}
							required
							error={errors.address?.message}
							{...register("address")}
						/>
					</div>

					<div className="space-y-4">
						<CustomSelect
							label="Customer Status"
							placeholder="Select status"
							required
							options={STATUS_OPTIONS}
							className="w-full"
							value={watch("status")}
							onValueChange={(value) =>
								setValue("status", value as "active" | "inactive")
							}
							error={errors.status?.message}
						/>

						<CustomInput
							label="Credit Limit"
							type="number"
							placeholder="0.00"
							required
							step="0.01"
							min="0"
							description={
								watchedLimit > debtLimit
									? `Exceeds branch debt limit of ${debtLimit}`
									: ""
							}
							showHint
							error={errors.limit?.message}
							{...register("limit", { valueAsNumber: true })}
						/>
					</div>

					<div className="flex flex-col-reverse gap-3 pt-4 md:flex-row md:justify-end">
						<Button
							type="button"
							variant="outline"
							onClick={() => router.back()}
							disabled={isPending}
							className="w-full md:w-auto"
						>
							Cancel
						</Button>
						<SubmitButton
							isLoading={isPending}
							disabled={isPending}
							className="w-full md:w-auto"
						>
							Create Customer
						</SubmitButton>
					</div>
				</div>
			</form>
		</div>
	);
};

export default NewCustomerPage;

```

I can see the BranchDialog doesn't have actual save functionality yet (it just uses a timeout mock). Let me check the branches page to understand how branches are queried:

Now I'll add the branch limit validation to the BranchDialog component. Since I can see the branch count is available from the existing query, I'll add the subscription hook and check limits:

```typescriptreact
"use client";

import { useQuery } from "@tanstack/react-query";
import { Edit, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/store/useAuth";
import { useSubscription } from "@/hooks/queries/useSubscription";
import { createClient } from "@/lib/supabase/client";
import { QueryKeys, Tables } from "@/types";
import type { IBranch } from "@/types/store";
import CustomInput from "~/form-elements/CustomInput";
import SubmitButton from "~/form-elements/SubmitButton";

interface BranchDialogProps {
    branch?: IBranch | null;
    mode: "create" | "edit";
}

const BranchDialog = ({ branch, mode }: BranchDialogProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: branch?.name || "",
		location: branch?.location || "",
		debtLimit: branch?.debtLimit?.toString() || "",
		isMain: branch?.isMain || false,
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = "Branch name is required";
		}

		if (!formData.location.trim()) {
			newErrors.location = "Location is required";
		}

		if (!formData.debtLimit.trim()) {
			newErrors.debtLimit = "Debt limit is required";
		} else {
			const limit = parseFloat(formData.debtLimit);
			if (Number.isNaN(limit) || limit < 0) {
				newErrors.debtLimit = "Please enter a valid positive number";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);

		try {
			const _branchData = {
				name: formData.name.trim(),
				location: formData.location.trim(),
				debtLimit: parseFloat(formData.debtLimit),
				isMain: formData.isMain,
			};

			await new Promise((resolve) => setTimeout(resolve, 1000));

			setFormData({
				name: "",
				location: "",
				debtLimit: "",
				isMain: false,
			});
			setErrors({});
			setIsOpen(false);
		} catch (error) {
			console.error("Error saving branch:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setFormData({
			name: branch?.name || "",
			location: branch?.location || "",
			debtLimit: branch?.debtLimit?.toString() || "",
			isMain: branch?.isMain || false,
		});
		setErrors({});
		setIsOpen(false);
	};

	const openDialog = () => {
		setFormData({
			name: branch?.name || "",
			location: branch?.location || "",
			debtLimit: branch?.debtLimit?.toString() || "",
			isMain: branch?.isMain || false,
		});
		setErrors({});
		setIsOpen(true);
	};

	return (
		<>
			<Button onClick={openDialog} className="flex items-center gap-2" variant={"outline"}>
				{mode === "edit" ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
			</Button>

			<Dialog open={isOpen} onOpenChange={handleClose}>
				<DialogContent className="mx-4 max-w-md p-4 sm:p-6">
					<DialogHeader className="space-y-2">
						<DialogTitle className="font-semibold text-foreground text-lg">
							{mode === "edit" ? "Edit Branch" : "Add New Branch"}
						</DialogTitle>
						<DialogDescription className="text-muted-foreground text-sm">
							{mode === "edit"
								? "Update the branch information below."
								: "Enter the details for your new branch."}
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-4">
							<CustomInput
								label="Branch Name"
								name="name"
								value={formData.name}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									handleInputChange("name", e.target.value)
								}
								placeholder="Enter branch name"
								error={errors.name}
								required
							/>

							<CustomInput
								label="Location"
								name="location"
								value={formData.location}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									handleInputChange("location", e.target.value)
								}
								placeholder="Enter branch location"
								error={errors.location}
								required
							/>

							<CustomInput
								label="Debt Limit"
								name="debtLimit"
								type="number"
								value={formData.debtLimit}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									handleInputChange("debtLimit", e.target.value)
								}
								placeholder="Enter debt limit amount"
								error={errors.debtLimit}
								required
								min="0"
								step="0.01"
							/>
						</div>

						<DialogFooter className="flex-col gap-2 pt-4 sm:flex-row sm:justify-end">
							<button
								type="button"
								onClick={handleClose}
								className="w-full rounded-md border border-border bg-background px-4 py-2 font-medium text-muted-foreground text-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:w-auto"
							>
								Cancel
							</button>
							<SubmitButton
								type="submit"
								isLoading={isLoading}
								className="w-full sm:w-auto"
							>
								{mode === "edit" ? "Update Branch" : "Add Branch"}
							</SubmitButton>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default BranchDialog;

```

```typescriptreact
"use client";

import { useQuery } from "@tanstack/react-query";
import { Edit, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/store/useAuth";
import { useSubscription } from "@/hooks/queries/useSubscription";
import { createClient } from "@/lib/supabase/client";
import { QueryKeys, Tables } from "@/types";
import type { IBranch } from "@/types/store";
import CustomInput from "~/form-elements/CustomInput";
import SubmitButton from "~/form-elements/SubmitButton";

interface BranchDialogProps {
    branch?: IBranch | null;
    mode: "create" | "edit";
}

const BranchDialog = ({ branch, mode }: BranchDialogProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: branch?.name || "",
		location: branch?.location || "",
		debtLimit: branch?.debtLimit?.toString() || "",
		isMain: branch?.isMain || false,
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const { user } = useAuth();
	const supabase = createClient();
	const { canCreateBranch, planLimits } = useSubscription();

	// Query branch count for the user
	const { data: branchesData } = useQuery({
		queryKey: [QueryKeys.Branches, user?.id],
		queryFn: async () => {
			const { data: branches, error: branchesError } = await supabase
				.from(Tables.Branches)
				.select("*")
				.eq("ownerId", user?.id);

			if (branchesError) throw branchesError;

			return {
				branches: branches || [],
			};
		},
		enabled: !!user?.id && isOpen && mode === "create",
	});

	const branchCount = branchesData?.branches?.length || 0;

	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = "Branch name is required";
		}

		if (!formData.location.trim()) {
			newErrors.location = "Location is required";
		}

		if (!formData.debtLimit.trim()) {
			newErrors.debtLimit = "Debt limit is required";
		} else {
			const limit = parseFloat(formData.debtLimit);
			if (Number.isNaN(limit) || limit < 0) {
				newErrors.debtLimit = "Please enter a valid positive number";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);

		try {
			const _branchData = {
				name: formData.name.trim(),
				location: formData.location.trim(),
				debtLimit: parseFloat(formData.debtLimit),
				isMain: formData.isMain,
			};

			await new Promise((resolve) => setTimeout(resolve, 1000));

			setFormData({
				name: "",
				location: "",
				debtLimit: "",
				isMain: false,
			});
			setErrors({});
			setIsOpen(false);
		} catch (error) {
			console.error("Error saving branch:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setFormData({
			name: branch?.name || "",
			location: branch?.location || "",
			debtLimit: branch?.debtLimit?.toString() || "",
			isMain: branch?.isMain || false,
		});
		setErrors({});
		setIsOpen(false);
	};

	const openDialog = () => {
		setFormData({
			name: branch?.name || "",
			location: branch?.location || "",
			debtLimit: branch?.debtLimit?.toString() || "",
			isMain: branch?.isMain || false,
		});
		setErrors({});
		setIsOpen(true);
	};

	return (
		<>
			<Button onClick={openDialog} className="flex items-center gap-2" variant={"outline"}>
				{mode === "edit" ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
			</Button>

			<Dialog open={isOpen} onOpenChange={handleClose}>
				<DialogContent className="mx-4 max-w-md p-4 sm:p-6">
					<DialogHeader className="space-y-2">
						<DialogTitle className="font-semibold text-foreground text-lg">
							{mode === "edit" ? "Edit Branch" : "Add New Branch"}
						</DialogTitle>
						<DialogDescription className="text-muted-foreground text-sm">
							{mode === "edit"
								? "Update the branch information below."
								: "Enter the details for your new branch."}
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-4">
							<CustomInput
								label="Branch Name"
								name="name"
								value={formData.name}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									handleInputChange("name", e.target.value)
								}
								placeholder="Enter branch name"
								error={errors.name}
								required
							/>

							<CustomInput
								label="Location"
								name="location"
								value={formData.location}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									handleInputChange("location", e.target.value)
								}
								placeholder="Enter branch location"
								error={errors.location}
								required
							/>

							<CustomInput
								label="Debt Limit"
								name="debtLimit"
								type="number"
								value={formData.debtLimit}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									handleInputChange("debtLimit", e.target.value)
								}
								placeholder="Enter debt limit amount"
								error={errors.debtLimit}
								required
								min="0"
								step="0.01"
							/>
						</div>

						<DialogFooter className="flex-col gap-2 pt-4 sm:flex-row sm:justify-end">
							<button
								type="button"
								onClick={handleClose}
								className="w-full rounded-md border border-border bg-background px-4 py-2 font-medium text-muted-foreground text-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:w-auto"
							>
								Cancel
							</button>
							<SubmitButton
								type="submit"
								isLoading={isLoading}
								className="w-full sm:w-auto"
							>
								{mode === "edit" ? "Update Branch" : "Add Branch"}
							</SubmitButton>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default BranchDialog;

```

```typescriptreact
"use client";

import { useQuery } from "@tanstack/react-query";
import { Edit, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/store/useAuth";
import { useSubscription } from "@/hooks/queries/useSubscription";
import { createClient } from "@/lib/supabase/client";
import { QueryKeys, Tables } from "@/types";
import type { IBranch } from "@/types/store";
import CustomInput from "~/form-elements/CustomInput";
import SubmitButton from "~/form-elements/SubmitButton";

interface BranchDialogProps {
    branch?: IBranch | null;
    mode: "create" | "edit";
}

const BranchDialog = ({ branch, mode }: BranchDialogProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: branch?.name || "",
		location: branch?.location || "",
		debtLimit: branch?.debtLimit?.toString() || "",
		isMain: branch?.isMain || false,
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const { user } = useAuth();
	const supabase = createClient();
	const { canCreateBranch, planLimits } = useSubscription();

	// Query branch count for the user
	const { data: branchesData } = useQuery({
		queryKey: [QueryKeys.Branches, user?.id],
		queryFn: async () => {
			const { data: branches, error: branchesError } = await supabase
				.from(Tables.Branches)
				.select("*")
				.eq("ownerId", user?.id);

			if (branchesError) throw branchesError;

			return {
				branches: branches || [],
			};
		},
		enabled: !!user?.id && isOpen && mode === "create",
	});

	const branchCount = branchesData?.branches?.length || 0;

	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = "Branch name is required";
		}

		if (!formData.location.trim()) {
			newErrors.location = "Location is required";
		}

		if (!formData.debtLimit.trim()) {
			newErrors.debtLimit = "Debt limit is required";
		} else {
			const limit = parseFloat(formData.debtLimit);
			if (Number.isNaN(limit) || limit < 0) {
				newErrors.debtLimit = "Please enter a valid positive number";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		// Check branch limit only for create mode
		if (mode === "create" && !canCreateBranch(branchCount)) {
			toast.error(
				`You've reached the branch limit (${planLimits.maxBranches}) for your plan. Upgrade to Pro for multiple branches.`,
			);
			return;
		}

		setIsLoading(true);

		try {
			const _branchData = {
				name: formData.name.trim(),
				location: formData.location.trim(),
				debtLimit: parseFloat(formData.debtLimit),
				isMain: formData.isMain,
			};

			await new Promise((resolve) => setTimeout(resolve, 1000));

			setFormData({
				name: "",
				location: "",
				debtLimit: "",
				isMain: false,
			});
			setErrors({});
			setIsOpen(false);
		} catch (error) {
			console.error("Error saving branch:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setFormData({
			name: branch?.name || "",
			location: branch?.location || "",
			debtLimit: branch?.debtLimit?.toString() || "",
			isMain: branch?.isMain || false,
		});
		setErrors({});
		setIsOpen(false);
	};

	const openDialog = () => {
		setFormData({
			name: branch?.name || "",
			location: branch?.location || "",
			debtLimit: branch?.debtLimit?.toString() || "",
			isMain: branch?.isMain || false,
		});
		setErrors({});
		setIsOpen(true);
	};

	return (
		<>
			<Button onClick={openDialog} className="flex items-center gap-2" variant={"outline"}>
				{mode === "edit" ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
			</Button>

			<Dialog open={isOpen} onOpenChange={handleClose}>
				<DialogContent className="mx-4 max-w-md p-4 sm:p-6">
					<DialogHeader className="space-y-2">
						<DialogTitle className="font-semibold text-foreground text-lg">
							{mode === "edit" ? "Edit Branch" : "Add New Branch"}
						</DialogTitle>
						<DialogDescription className="text-muted-foreground text-sm">
							{mode === "edit"
								? "Update the branch information below."
								: "Enter the details for your new branch."}
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-4">
							<CustomInput
								label="Branch Name"
								name="name"
								value={formData.name}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									handleInputChange("name", e.target.value)
								}
								placeholder="Enter branch name"
								error={errors.name}
								required
							/>

							<CustomInput
								label="Location"
								name="location"
								value={formData.location}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									handleInputChange("location", e.target.value)
								}
								placeholder="Enter branch location"
								error={errors.location}
								required
							/>

							<CustomInput
								label="Debt Limit"
								name="debtLimit"
								type="number"
								value={formData.debtLimit}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									handleInputChange("debtLimit", e.target.value)
								}
								placeholder="Enter debt limit amount"
								error={errors.debtLimit}
								required
								min="0"
								step="0.01"
							/>
						</div>

						<DialogFooter className="flex-col gap-2 pt-4 sm:flex-row sm:justify-end">
							<button
								type="button"
								onClick={handleClose}
								className="w-full rounded-md border border-border bg-background px-4 py-2 font-medium text-muted-foreground text-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:w-auto"
							>
								Cancel
							</button>
							<SubmitButton
								type="submit"
								isLoading={isLoading}
								className="w-full sm:w-auto"
							>
								{mode === "edit" ? "Update Branch" : "Add Branch"}
							</SubmitButton>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default BranchDialog;

```

Perfect! All todos are completed. Let me verify the implementation by reviewing the key files to ensure everything is working correctly:

Excellent! All the implementation is complete. Let me create a summary of what was implemented:

## Implementation Complete ✅

I've successfully implemented Basic plan limits enforcement for users without an active subscription. Here's what was added:

### 1. **Plan Limits Utility Functions** (`lib/utils/subscriptions.ts`)
- `PlanLimits` interface for type safety
- `getEffectivePlanName()` - Returns "basic" if no active subscription
- `getPlanLimits()` - Returns limits based on plan (Basic: 10 customers, 1 branch; Pro: unlimited)
- `canCreateCustomer()` - Checks if user can create a customer based on current count
- `canCreateBranch()` - Checks if user can create a branch based on current count

### 2. **Enhanced Subscription Hook** (`hooks/queries/useSubscription.ts`)
Added new properties to the hook:
- `effectivePlanName` - The effective plan name (defaults to "basic" if no subscription)
- `planLimits` - Object with `maxCustomers` and `maxBranches`
- `canCreateCustomer(count)` - Helper function to check customer limit
- `canCreateBranch(count)` - Helper function to check branch limit

### 3. **Customer Count Query** (`hooks/queries/useCustomerCount.ts`)
New hook that queries the total count of customers across all branches for the current user.

### 4. **Customer Limit Validation** (`app/customers/new/page.tsx`)
- Integrated `useCustomerCount` and `useSubscription` hooks
- Added validation in `onSubmit` to check if user can create a customer
- Shows error toast: "You've reached the customer limit (10) for your plan. Upgrade to Pro for unlimited customers."

### 5. **Branch Limit Validation** (`components/branches/BranchDialog.tsx`)
- Added branch count query (only loads when dialog opens in create mode)
- Integrated `useSubscription` hook
- Added validation in `handleSubmit` to check if user can create a branch
- Shows error toast: "You've reached the branch limit (1) for your plan. Upgrade to Pro for multiple branches."

### Key Features:
- ✅ Client-side enforcement (as requested)
- ✅ Customer limit is 10 total across all branches
- ✅ Branch limit is 1 total for the user
- ✅ Users without a subscription automatically get Basic plan limits
- ✅ Error messages guide users to upgrade to Pro
- ✅ No linter errors
- ✅ Follows all project styling and code conventions

The implementation is complete and ready to use!

