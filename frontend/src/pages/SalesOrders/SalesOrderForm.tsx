import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import { Customer, InventoryItem } from '../../types';
import { customersAPI, inventoryAPI, salesOrderAPI } from '../../services/api';

interface SalesOrderItem {
  inventoryItemId: string;
  inventoryItem?: InventoryItem;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  hsnOrSacCode: string;
  amount: number;
}

const SalesOrderForm: React.FC = () => {
  const navigate = useNavigate();
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [searchResults, setSearchResults] = useState<InventoryItem[]>([]);
  
  const [formData, setFormData] = useState({
    customerId: '',
    notes: '',
    terms: '',
    placeOfSupply: '',
  });
  
  const [items, setItems] = useState<SalesOrderItem[]>([]);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // New customer form
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // New inventory item form
  const [newInventoryItem, setNewInventoryItem] = useState({
    name: '',
    description: '',
    unitPrice: 0,
    taxRate: 0,
    hsnOrSacCode: '',
  });

  useEffect(() => {
    fetchCustomers();
    fetchInventoryItems();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customersAPI.getAll();
      setCustomers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const response = await inventoryAPI.getAll();
      setInventoryItems(response.data.data || []);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    }
  };

  const searchInventoryItems = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      const response = await inventoryAPI.search(query);
      setSearchResults(response.data.data || []);
    } catch (error) {
      console.error('Error searching inventory items:', error);
    }
  };

  const addItem = (inventoryItem: InventoryItem) => {
    const newItem: SalesOrderItem = {
      inventoryItemId: inventoryItem.id,
      inventoryItem,
      quantity: 1,
      unitPrice: inventoryItem.unitPrice,
      taxRate: inventoryItem.taxRate || 0,
      hsnOrSacCode: inventoryItem.hsnOrSacCode || '',
      amount: inventoryItem.unitPrice,
    };
    
    setItems([...items, newItem]);
    setShowItemModal(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const updateItem = (index: number, field: keyof SalesOrderItem, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Recalculate amount when quantity or unitPrice changes
    if (field === 'quantity' || field === 'unitPrice') {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].unitPrice;
    }
    
    setItems(updatedItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subTotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = items.reduce((sum, item) => sum + (item.amount * (item.taxRate / 100)), 0);
    const total = subTotal + taxAmount;
    
    return { subTotal, taxAmount, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError('Please add at least one item');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const salesOrderData = {
        ...formData,
        items: items.map(item => ({
          inventoryItemId: item.inventoryItemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate,
          hsnOrSacCode: item.hsnOrSacCode,
        })),
      };
      
      await salesOrderAPI.create(salesOrderData);
      navigate('/sales-orders');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create sales order');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async () => {
    try {
      const response = await customersAPI.create(newCustomer);
      const createdCustomer = response.data.data;
      setCustomers([...customers, createdCustomer]);
      setFormData({ ...formData, customerId: createdCustomer.id });
      setShowCustomerModal(false);
      setNewCustomer({ name: '', email: '', phone: '', address: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create customer');
    }
  };

  const handleCreateInventoryItem = async () => {
    try {
      const response = await inventoryAPI.create(newInventoryItem);
      const createdItem = response.data.data;
      setInventoryItems([...inventoryItems, createdItem]);
      addItem(createdItem);
      setNewInventoryItem({
        name: '',
        description: '',
        unitPrice: 0,
        taxRate: 0,
        hsnOrSacCode: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create inventory item');
    }
  };

  const { subTotal, taxAmount, total } = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Create Sales Order</h1>
        <Button variant="secondary" onClick={() => navigate('/sales-orders')}>
          Cancel
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Selection */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer *
              </label>
              <div className="flex space-x-2">
                <select
                  required
                  className="input-field flex-1"
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} - {customer.email}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="success"
                  onClick={() => setShowCustomerModal(true)}
                >
                  <PlusIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Place of Supply
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.placeOfSupply}
                onChange={(e) => setFormData({ ...formData, placeOfSupply: e.target.value })}
                placeholder="e.g., Rajasthan (08)"
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Items</h2>
            <Button
              type="button"
              variant="success"
              onClick={() => setShowItemModal(true)}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Item
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No items added yet</p>
              <p className="text-sm">Click "Add Item" to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="table-header">Item</th>
                    <th className="table-header">HSN/SAC</th>
                    <th className="table-header">Qty</th>
                    <th className="table-header">Price</th>
                    <th className="table-header">Tax %</th>
                    <th className="table-header">Amount</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td className="table-cell">
                        <div>
                          <div className="font-medium">{item.inventoryItem?.name}</div>
                          <div className="text-sm text-gray-500">{item.inventoryItem?.description}</div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <input
                          type="text"
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          value={item.hsnOrSacCode}
                          onChange={(e) => updateItem(index, 'hsnOrSacCode', e.target.value)}
                        />
                      </td>
                      <td className="table-cell">
                        <input
                          type="number"
                          min="1"
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </td>
                      <td className="table-cell">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        />
                      </td>
                      <td className="table-cell">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                          value={item.taxRate}
                          onChange={(e) => updateItem(index, 'taxRate', parseFloat(e.target.value) || 0)}
                        />
                      </td>
                      <td className="table-cell font-medium">
                        ₹{item.amount.toFixed(2)}
                      </td>
                      <td className="table-cell">
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => removeItem(index)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Totals */}
          {items.length > 0 && (
            <div className="mt-6 flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span>Sub Total:</span>
                  <span>₹{subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notes and Terms */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                rows={3}
                className="input-field"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional notes..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Terms & Conditions
              </label>
              <textarea
                rows={3}
                className="input-field"
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                placeholder="Terms and conditions..."
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/sales-orders')}
          >
            Cancel
          </Button>
          <Button type="submit" variant="success" loading={loading}>
            Create Sales Order
          </Button>
        </div>
      </form>

      {/* Add Item Modal */}
      <Modal
        isOpen={showItemModal}
        onClose={() => setShowItemModal(false)}
        title="Add Item"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Items
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                searchInventoryItems(e.target.value);
              }}
            />
          </div>

          {searchResults.length > 0 && (
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
              {searchResults.map((item) => (
                <div
                  key={item.id}
                  className="p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => addItem(item)}
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.description}</div>
                  <div className="text-sm text-gray-600">Price: ₹{item.unitPrice}</div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Or create a new item:</h3>
            <div className="space-y-3">
              <input
                type="text"
                className="input-field"
                placeholder="Item name"
                value={newInventoryItem.name}
                onChange={(e) => setNewInventoryItem({ ...newInventoryItem, name: e.target.value })}
              />
              <input
                type="text"
                className="input-field"
                placeholder="Description"
                value={newInventoryItem.description}
                onChange={(e) => setNewInventoryItem({ ...newInventoryItem, description: e.target.value })}
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  className="input-field"
                  placeholder="Price"
                  value={newInventoryItem.unitPrice || ''}
                  onChange={(e) => setNewInventoryItem({ ...newInventoryItem, unitPrice: parseFloat(e.target.value) || 0 })}
                />
                <input
                  type="number"
                  className="input-field"
                  placeholder="Tax %"
                  value={newInventoryItem.taxRate || ''}
                  onChange={(e) => setNewInventoryItem({ ...newInventoryItem, taxRate: parseFloat(e.target.value) || 0 })}
                />
                <input
                  type="text"
                  className="input-field"
                  placeholder="HSN/SAC"
                  value={newInventoryItem.hsnOrSacCode}
                  onChange={(e) => setNewInventoryItem({ ...newInventoryItem, hsnOrSacCode: e.target.value })}
                />
              </div>
              <Button
                type="button"
                variant="success"
                onClick={handleCreateInventoryItem}
                disabled={!newInventoryItem.name || !newInventoryItem.unitPrice}
                className="w-full"
              >
                Create & Add Item
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Add Customer Modal */}
      <Modal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        title="Add Customer"
      >
        <div className="space-y-4">
          <input
            type="text"
            className="input-field"
            placeholder="Customer name"
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
          />
          <input
            type="email"
            className="input-field"
            placeholder="Email"
            value={newCustomer.email}
            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
          />
          <input
            type="tel"
            className="input-field"
            placeholder="Phone"
            value={newCustomer.phone}
            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
          />
          <textarea
            className="input-field"
            placeholder="Address"
            value={newCustomer.address}
            onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
          />
          <Button
            type="button"
            variant="success"
            onClick={handleCreateCustomer}
            disabled={!newCustomer.name || !newCustomer.email}
            className="w-full"
          >
            Create Customer
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default SalesOrderForm;