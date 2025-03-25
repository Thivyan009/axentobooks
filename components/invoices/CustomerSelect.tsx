'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface CustomerSelectProps {
  businessId: string;
  value: string;
  onChange: (value: string) => void;
}

export function CustomerSelect({ businessId, value, onChange }: CustomerSelectProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, [businessId]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`/api/businesses/${businessId}/customers`);
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to load customers');
    }
  };

  const handleCreateCustomer = async () => {
    try {
      setError(null);
      const response = await fetch(`/api/businesses/${businessId}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create customer');
      }

      const customer = await response.json();
      setCustomers([...customers, customer]);
      onChange(customer.id);
      setIsOpen(false);
      setNewCustomer({ name: '', email: '' });
    } catch (error) {
      console.error('Error creating customer:', error);
      setError(error instanceof Error ? error.message : 'Failed to create customer');
    }
  };

  return (
    <div className="flex gap-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a customer" />
        </SelectTrigger>
        <SelectContent>
          {customers.map((customer) => (
            <SelectItem key={customer.id} value={customer.id}>
              {customer.name} ({customer.email})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newCustomer.name}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, name: e.target.value })
                }
                placeholder="Enter customer name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, email: e.target.value })
                }
                placeholder="Enter customer email"
              />
            </div>
            {error && (
              <div className="text-sm text-red-500">
                {error}
              </div>
            )}
            <Button 
              onClick={handleCreateCustomer}
              disabled={!newCustomer.name || !newCustomer.email}
            >
              Create Customer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 