import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { CustomerSelect } from "./customer-select";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { createInvoice } from "@/lib/actions/invoice";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";

const formSchema = z.object({
  customerId: z.string().min(1, "Please select a customer"),
  dueDate: z.date(),
  items: z.array(
    z.object({
      name: z.string().min(1, "Item name is required"),
      description: z.string().optional(),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      rate: z.number().min(0, "Rate must be positive"),
    })
  ).min(1, "At least one item is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateInvoiceForm() {
  const router = useRouter();
  const [items, setItems] = useState([{ id: 1 }]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [{ name: "", description: "", quantity: 1, rate: 0 }],
      notes: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createInvoice(data);
      router.push("/invoices");
    } catch (error) {
      console.error("Failed to create invoice:", error);
    }
  };

  const addItem = () => {
    setItems([...items, { id: items.length + 1 }]);
    form.setValue("items", [
      ...form.getValues("items"),
      { name: "", description: "", quantity: 1, rate: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    const currentItems = form.getValues("items");
    form.setValue(
      "items",
      currentItems.filter((_, i) => i !== index)
    );
  };

  const calculateSubtotal = () => {
    const items = form.getValues("items");
    return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <FormControl>
                    <CustomerSelect onValueChange={field.onChange} value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Items</h3>
            <Button type="button" onClick={addItem}>
              Add Item
            </Button>
          </div>

          {items.map((item, index) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qty</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.rate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rate</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-1 flex items-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeItem(index)}
                      className="mb-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="text-lg font-medium">
            Total: ${calculateSubtotal().toFixed(2)}
          </div>
          <Button type="submit">Create Invoice</Button>
        </div>
      </form>
    </Form>
  );
} 