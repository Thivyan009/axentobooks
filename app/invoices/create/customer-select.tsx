import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomerForm } from "./customer-form";
import { useCustomers } from "@/hooks/use-customers";

interface CustomerSelectProps {
  onValueChange: (value: string) => void;
  value?: string;
}

export function CustomerSelect({ onValueChange, value }: CustomerSelectProps) {
  const [open, setOpen] = useState(false);
  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false);
  const { customers, isLoading, mutate } = useCustomers();

  const selectedCustomer = customers?.find((customer) => customer.id === value);

  const handleNewCustomerCreated = () => {
    setShowNewCustomerDialog(false);
    mutate();
  };

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value && selectedCustomer
              ? selectedCustomer.name
              : "Select customer..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput placeholder="Search customers..." />
            <CommandEmpty>No customer found.</CommandEmpty>
            <CommandGroup>
              {customers?.map((customer) => (
                <CommandItem
                  key={customer.id}
                  value={customer.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === customer.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {customer.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={showNewCustomerDialog} onOpenChange={setShowNewCustomerDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <CustomerForm onSuccess={handleNewCustomerCreated} />
        </DialogContent>
      </Dialog>
    </div>
  );
} 