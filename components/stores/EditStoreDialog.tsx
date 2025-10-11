"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/store/useAuth";
import { createClient } from "@/lib/supabase/client";
import { QueryKeys, Tables } from "@/types";
import CustomInput from "~/form-elements/CustomInput";
import SubmitButton from "~/form-elements/SubmitButton";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

interface EditStoreDialogProps {
    storeName?: string;
    storePhone?: string;
    storeId?: string;
}

const EditStoreDialog = ({ storeName = "", storePhone = "", storeId }: EditStoreDialogProps) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(storeName);
    const [phone, setPhone] = useState(storePhone);
    const [isLoading, setIsLoading] = useState(false);

    const { user } = useAuth();
    const supabase = createClient();
    const queryClient = useQueryClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!storeId || !user?.id) return;

        setIsLoading(true);

        try {
            const { error } = await supabase
                .from(Tables.Stores)
                .update({
                    name: name.trim(),
                    phone: phone.trim()
                })
                .eq("id", storeId)
                .eq("ownerId", user.id);

            if (error) throw error;

            await queryClient.invalidateQueries({
                queryKey: [QueryKeys.StoreWithBranches, user.id],
            });

            toast.success("Store updated successfully");
            setOpen(false);
        } catch (error) {
            console.error("Error updating store:", error);
            toast.error("Failed to update store. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setName(storeName);
            setPhone(storePhone);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0 border-primary/20 hover:bg-primary/10"
                >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit store</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="mx-4 w-[calc(100vw-2rem)] max-w-sm sm:mx-auto sm:w-full">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-lg">Edit Store</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <CustomInput
                        label="Store Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter store name"
                        required
                        className="text-sm"
                    />
                    <CustomInput
                        label="Phone Number"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number"
                        required
                        className="text-sm"
                    />
                    <div className="flex gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="h-9 flex-1 text-sm"
                        >
                            Cancel
                        </Button>
                        <SubmitButton isLoading={isLoading} className="h-9 flex-1 text-sm">
                            Save
                        </SubmitButton>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditStoreDialog;