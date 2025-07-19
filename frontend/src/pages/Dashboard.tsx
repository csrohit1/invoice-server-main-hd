import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UsersIcon,
  CubeIcon,
  DocumentTextIcon,
  ReceiptPercentIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { customersAPI, inventoryAPI, salesOrderAPI, invoiceAPI } from '../services/api';

interface DashboardStats {
  customers: number;
  inventory: number;
  salesOrders: number;
  invoices: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    customers: 0,
    inventory: 0,
    salesOrders: 0,
    invoices: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [customersRes, inventoryRes, salesOrdersRes, invoicesRes] = await Promise.all([
          customersAPI.getAll(),
          inventoryAPI.getAll(),
          salesOrderAPI.getAll(),
          invoiceAPI.getAll(),
        ]);

        setStats({
          customers: customersRes.data.data?.length || 0,
          inventory: inventoryRes.data.data?.length || 0,
          salesOrders: salesOrdersRes.data.data?.length || 0,
          invoices: invoicesRes.data.data?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      name: 'Total Customers',
      value: stats.customers,
      icon: UsersIcon,
      color: 'bg-blue-500',
      link: '/customers',
    },
    {
      name: 'Inventory Items',
      value: stats.inventory,
      icon: CubeIcon,
      color: 'bg-green-500',
      link: '/inventory',
    },
    {
      name: 'Sales Orders',
      value: stats.salesOrders,
      icon: DocumentTextIcon,
      color: 'bg-yellow-500',
      link: '/sales-orders',
    },
    {
      name: 'Invoices',
      value: stats.invoices,
      icon: ReceiptPercentIcon,
      color: 'bg-purple-500',
      link: '/invoices',
    },
  ];

  const quickActions = [
    {
      name: 'Create Sales Order',
      description: 'Generate a new sales order for customers',
      icon: DocumentTextIcon,
      link: '/sales-orders/create',
      color: 'bg-primary-600',
    },
    {
      name: 'Add Customer',
      description: 'Add a new customer to your database',
      icon: UsersIcon,
      link: '/customers/create',
      color: 'bg-green-600',
    },
    {
      name: 'Add Inventory Item',
      description: 'Add new products to your inventory',
      icon: CubeIcon,
      link: '/inventory/create',
      color: 'bg-blue-600',
    },
    {
      name: 'Create Invoice',
      description: 'Generate invoice from sales order',
      icon: ReceiptPercentIcon,
      link: '/invoices/create',
      color: 'bg-purple-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/sales-orders/create">
          <Button variant="success" className="flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            New Sales Order
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link key={card.name} to={card.link}>
            <div className="card hover:shadow-md transition-shadow duration-200 cursor-pointer">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${card.color}`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{card.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.name} to={action.link}>
              <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all duration-200 cursor-pointer">
                <div className={`inline-flex p-2 rounded-lg ${action.color} mb-3`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">{action.name}</h3>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8 text-gray-500">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p>No recent activity to display</p>
          <p className="text-sm">Start by creating your first sales order</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;