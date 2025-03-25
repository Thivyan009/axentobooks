'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { CustomerSelect } from './CustomerSelect';
import { Plus, Trash2 } from 'lucide-react';

const invoiceItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  description: z.string().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  rate: z.number().min(0, 'Rate must be positive'),
  amount: z.number().min(0, 'Amount must be positive'),
});

const invoiceFormSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  issueDate: z.date(),
  dueDate: z.date(),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  notes: z.string().optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

interface InvoiceFormProps {
  onSubmit: (data: InvoiceFormValues) => Promise<void>;
  businessId: string;
}

export function InvoiceForm({ onSubmit, businessId }: InvoiceFormProps) {
  const [items, setItems] = useState<Array<{ id: string; name: string; description: string; quantity: number; rate: number; amount: number }>>([
    { id: '1', name: '', description: '', quantity: 1, rate: 0, amount: 0 }
  ]);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      issueDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      items: [{ name: '', description: '', quantity: 1, rate: 0, amount: 0 }],
      notes: '',
    },
  });

  const addItem = () => {
    const newItem = {
      id: String(items.length + 1),
      name: '',
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setItems([...items, newItem]);
    const currentItems = form.getValues('items');
    form.setValue('items', [...currentItems, { name: '', description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    const currentItems = form.getValues('items');
    form.setValue('items', currentItems.filter((_, i) => i !== index));
  };

  const updateItemAmount = (index: number) => {
    const item = items[index];
    const amount = item.quantity * item.rate;
    const newItems = [...items];
    newItems[index] = { ...item, amount };
    setItems(newItems);
    
    const currentItems = form.getValues('items');
    currentItems[index] = { ...currentItems[index], amount };
    form.setValue('items', currentItems);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer</FormLabel>
                <FormControl>
                  <CustomerSelect
                    businessId={businessId}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Date</FormLabel>
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          {items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-6 gap-4 items-start">
              <FormField
                control={form.control}
                name={`items.${index}.name`}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Input placeholder="Item name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`items.${index}.description`}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Input placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`items.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          field.onChange(value);
                          const newItems = [...items];
                          newItems[index] = { ...newItems[index], quantity: value };
                          setItems(newItems);
                          updateItemAmount(index);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`items.${index}.rate`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(value);
                          const newItems = [...items];
                          newItems[index] = { ...newItems[index], rate: value };
                          setItems(newItems);
                          updateItemAmount(index);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-6 flex justify-between items-center">
                <div className="text-sm font-medium">
                  Amount: ${item.amount.toFixed(2)}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

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

        <Button type="submit">Create Invoice</Button>
      </form>
    </Form>
  );
} 