'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { LogOut, Package, Filter, Search, RefreshCw, Eye, CheckCircle, XCircle, Clock, Truck, Mail, FileText, Printer } from 'lucide-react';

interface Order {
    id: string;
    customer_name: string;
    customer_email: string | null;
    customer_phone: string;
    shipping_address: string;
    items: any[];
    total_amount: number;
    razorpay_order_id: string | null;
    razorpay_payment_id: string | null;
    payment_status: string;
    order_status: string;
    order_type: string;
    created_at: string;
}

export default function OrdersPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [adminUser, setAdminUser] = useState<any>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [sendingEmail, setSendingEmail] = useState(false);

    // Authentication check
    useEffect(() => {
        const checkAuth = () => {
            const isAdmin = localStorage.getItem('isAdmin');
            const user = localStorage.getItem('adminUser');

            if (!isAdmin || isAdmin !== 'true' || !user) {
                router.push('/login');
                return;
            }

            try {
                setAdminUser(JSON.parse(user));
                setIsAuthenticated(true);
            } catch (error) {
                router.push('/login');
            } finally {
                setCheckingAuth(false);
            }
        };

        checkAuth();
    }, [router]);

    // Fetch orders
    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated, statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const url = statusFilter === 'all'
                ? '/api/orders'
                : `/api/orders?status=${statusFilter}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.orders) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminUser');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('adminLoginTime');
        router.push('/login');
    };

    const updateOrderStatus = async (orderId: string, orderStatus: string, paymentStatus?: string) => {
        try {
            const response = await fetch('/api/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: orderId,
                    orderStatus,
                    ...(paymentStatus && { paymentStatus })
                })
            });

            if (response.ok) {
                fetchOrders(); // Refresh orders
                // Update selected order if it's still open
                if (selectedOrder && selectedOrder.id === orderId) {
                    const updatedOrder = { ...selectedOrder, order_status: orderStatus };
                    if (paymentStatus) updatedOrder.payment_status = paymentStatus;
                    setSelectedOrder(updatedOrder);
                }
            }
        } catch (error) {
            console.error('Failed to update order:', error);
        }
    };

    const sendStatusUpdateEmail = async (order: Order) => {
        if (!order.customer_email) {
            alert('Customer email not available');
            return;
        }

        setSendingEmail(true);
        try {
            const response = await fetch('/api/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'status_update',
                    orderData: {
                        orderId: order.id,
                        customerName: order.customer_name,
                        customerEmail: order.customer_email,
                        orderStatus: order.order_status,
                    }
                })
            });

            if (response.ok) {
                alert('✅ Status update email sent successfully!');
            } else {
                alert('❌ Failed to send email');
            }
        } catch (error) {
            console.error('Error sending status update email:', error);
            alert('❌ Failed to send email');
        } finally {
            setSendingEmail(false);
        }
    };

    const sendInvoiceEmail = async (order: Order) => {
        if (!order.customer_email) {
            alert('Customer email not available');
            return;
        }

        setSendingEmail(true);
        try {
            const response = await fetch('/api/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'invoice',
                    orderData: {
                        orderId: order.id,
                        customerName: order.customer_name,
                        customerEmail: order.customer_email,
                        customerPhone: order.customer_phone,
                        items: order.items,
                        totalAmount: order.total_amount,
                        shippingAddress: order.shipping_address,
                        orderDate: order.created_at,
                        paymentMethod: order.order_type === 'online' ? 'Online Payment (Razorpay)' : 'Cash on Delivery',
                    }
                })
            });

            if (response.ok) {
                alert('✅ Invoice email sent successfully!');
            } else {
                alert('❌ Failed to send invoice');
            }
        } catch (error) {
            console.error('Error sending invoice email:', error);
            alert('❌ Failed to send invoice');
        } finally {
            setSendingEmail(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const getStatusBadge = (status: string, type: 'order' | 'payment') => {
        const styles = {
            order: {
                pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                processing: 'bg-blue-100 text-blue-800 border-blue-300',
                shipped: 'bg-purple-100 text-purple-800 border-purple-300',
                delivered: 'bg-green-100 text-green-800 border-green-300',
                cancelled: 'bg-red-100 text-red-800 border-red-300',
            },
            payment: {
                pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                paid: 'bg-green-100 text-green-800 border-green-300',
                failed: 'bg-red-100 text-red-800 border-red-300',
            }
        };

        const icons = {
            order: {
                pending: <Clock className="w-3 h-3" />,
                processing: <RefreshCw className="w-3 h-3" />,
                shipped: <Truck className="w-3 h-3" />,
                delivered: <CheckCircle className="w-3 h-3" />,
                cancelled: <XCircle className="w-3 h-3" />,
            },
            payment: {
                pending: <Clock className="w-3 h-3" />,
                paid: <CheckCircle className="w-3 h-3" />,
                failed: <XCircle className="w-3 h-3" />,
            }
        };

        const style = type === 'order' ? styles.order[status as keyof typeof styles.order] : styles.payment[status as keyof typeof styles.payment];
        const icon = type === 'order' ? icons.order[status as keyof typeof icons.order] : icons.payment[status as keyof typeof icons.payment];

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${style}`}>
                {icon}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer_phone.includes(searchQuery);

        return matchesSearch;
    });

    // Show loading while checking authentication
    if (checkingAuth) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, don't render anything (will redirect)
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
            <Navbar />

            <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
                {/* Admin Info Bar */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">{adminUser?.name?.charAt(0) || 'A'}</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Logged in as</p>
                            <p className="font-semibold text-gray-900">{adminUser?.name || 'Admin'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => router.push('/admin')}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                        >
                            <Package className="w-4 h-4" />
                            <span className="hidden sm:inline">Products</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4 shadow-2xl">
                        <Package className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Orders Management
                    </h1>
                    <p className="text-gray-600 text-lg">Track and manage all customer orders</p>
                    <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by order ID, customer name, or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                            >
                                <option value="all">All Orders</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                                onClick={fetchOrders}
                                className="p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                            >
                                <RefreshCw className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-600 font-semibold">Total Orders</p>
                            <p className="text-2xl font-bold text-blue-900">{orders.length}</p>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                            <p className="text-sm text-yellow-600 font-semibold">Pending</p>
                            <p className="text-2xl font-bold text-yellow-900">
                                {orders.filter(o => o.order_status === 'pending').length}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                            <p className="text-sm text-purple-600 font-semibold">Processing</p>
                            <p className="text-2xl font-bold text-purple-900">
                                {orders.filter(o => o.order_status === 'processing').length}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                            <p className="text-sm text-green-600 font-semibold">Delivered</p>
                            <p className="text-2xl font-bold text-green-900">
                                {orders.filter(o => o.order_status === 'delivered').length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading orders...</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="p-12 text-center">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No orders found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                                    <tr>
                                        <th className="px-4 py-4 text-left text-sm font-bold">Order ID</th>
                                        <th className="px-4 py-4 text-left text-sm font-bold">Customer</th>
                                        <th className="px-4 py-4 text-left text-sm font-bold">Phone</th>
                                        <th className="px-4 py-4 text-left text-sm font-bold">Amount</th>
                                        <th className="px-4 py-4 text-left text-sm font-bold">Type</th>
                                        <th className="px-4 py-4 text-left text-sm font-bold">Payment</th>
                                        <th className="px-4 py-4 text-left text-sm font-bold">Status</th>
                                        <th className="px-4 py-4 text-left text-sm font-bold">Date</th>
                                        <th className="px-4 py-4 text-left text-sm font-bold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredOrders.map((order, index) => (
                                        <tr key={order.id} className={`hover:bg-purple-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                            <td className="px-4 py-4">
                                                <span className="font-mono text-sm font-semibold text-purple-600">{order.id}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{order.customer_name}</p>
                                                    {order.customer_email && (
                                                        <p className="text-xs text-gray-500">{order.customer_email}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600">{order.customer_phone}</td>
                                            <td className="px-4 py-4">
                                                <span className="font-bold text-gray-900">₹{order.total_amount.toLocaleString()}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.order_type === 'online'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {order.order_type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">{getStatusBadge(order.payment_status, 'payment')}</td>
                                            <td className="px-4 py-4">{getStatusBadge(order.order_status, 'order')}</td>
                                            <td className="px-4 py-4 text-sm text-gray-600">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">Order Details</h2>
                                    <p className="text-purple-100 font-mono">{selectedOrder.id}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Email Actions */}
                            {selectedOrder.customer_email && (
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                                    <h3 className="font-bold text-sm mb-3 text-gray-900">📧 Email Actions</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => sendStatusUpdateEmail(selectedOrder)}
                                            disabled={sendingEmail}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Mail className="w-4 h-4" />
                                            <span className="text-sm">Send Status Update</span>
                                        </button>
                                        <button
                                            onClick={() => sendInvoiceEmail(selectedOrder)}
                                            disabled={sendingEmail}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FileText className="w-4 h-4" />
                                            <span className="text-sm">Send Invoice</span>
                                        </button>
                                        <button
                                            onClick={handlePrint}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors shadow-md"
                                        >
                                            <Printer className="w-4 h-4" />
                                            <span className="text-sm">Print Receipt</span>
                                        </button>
                                    </div>
                                    {sendingEmail && (
                                        <p className="text-sm text-blue-600 mt-2 flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            Sending email...
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Customer Info */}
                            <div>
                                <h3 className="font-bold text-lg mb-3 text-gray-900">Customer Information</h3>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    <p><span className="font-semibold">Name:</span> {selectedOrder.customer_name}</p>
                                    {selectedOrder.customer_email && (
                                        <p><span className="font-semibold">Email:</span> {selectedOrder.customer_email}</p>
                                    )}
                                    <p><span className="font-semibold">Phone:</span> {selectedOrder.customer_phone}</p>
                                    <p><span className="font-semibold">Address:</span> {selectedOrder.shipping_address}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="font-bold text-lg mb-3 text-gray-900">Order Items</h3>
                                <div className="space-y-2">
                                    {selectedOrder.items.map((item: any, index: number) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                            </div>
                                            <p className="font-bold">₹{item.price * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-lg">Total Amount:</span>
                                        <span className="font-bold text-2xl text-purple-600">₹{selectedOrder.total_amount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Update Status */}
                            <div>
                                <h3 className="font-bold text-lg mb-3 text-gray-900">Update Status</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Order Status</label>
                                        <select
                                            className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                            value={selectedOrder.order_status}
                                            onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Payment Status</label>
                                        <select
                                            className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                            value={selectedOrder.payment_status}
                                            onChange={(e) => updateOrderStatus(selectedOrder.id, selectedOrder.order_status, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="paid">Paid</option>
                                            <option value="failed">Failed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            {selectedOrder.razorpay_payment_id && (
                                <div>
                                    <h3 className="font-bold text-lg mb-3 text-gray-900">Payment Information</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                        <p className="text-sm"><span className="font-semibold">Razorpay Order ID:</span> {selectedOrder.razorpay_order_id}</p>
                                        <p className="text-sm"><span className="font-semibold">Razorpay Payment ID:</span> {selectedOrder.razorpay_payment_id}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Receipt Print Component (Hidden from UI) */}
            {selectedOrder && (
                <div className="hidden print:block print:w-[80mm] print:p-0 print:m-0 bg-white text-black font-mono">
                    <style jsx global>{`
                        @media print {
                            body * {
                                visibility: hidden;
                            }
                            #receipt-print, #receipt-print * {
                                visibility: visible;
                            }
                            #receipt-print {
                                position: absolute;
                                left: 0;
                                top: 0;
                                width: 80mm;
                                padding: 5mm;
                            }
                            @page {
                                size: 80mm auto;
                                margin: 0;
                            }
                        }
                    `}</style>
                    <div id="receipt-print" className="text-sm">
                        <div className="text-center mb-4 border-b pb-2 border-black border-dashed">
                            <h1 className="text-xl font-bold uppercase">LEVE COTTONS</h1>
                            <p className="text-[10px]">where tradition meets trend</p>
                            <p className="text-[10px] mt-1">Visit: www.levecotton.com</p>
                            <p className="text-[10px]">Phone: +91 93458 68005</p>
                        </div>

                        <div className="mb-4 border-b pb-2 border-black border-dashed text-[10px]">
                            <p><strong>ORDER ID:</strong> {selectedOrder.id}</p>
                            <p><strong>DATE:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                            <p><strong>TYPE:</strong> {selectedOrder.order_type.toUpperCase()}</p>
                        </div>

                        <div className="mb-4 border-b pb-2 border-black border-dashed text-[10px]">
                            <p className="font-bold">CUSTOMER DETAILS:</p>
                            <p>{selectedOrder.customer_name}</p>
                            <p>{selectedOrder.customer_phone}</p>
                            <p className="whitespace-pre-wrap">{selectedOrder.shipping_address}</p>
                        </div>

                        <div className="mb-4 text-[10px]">
                            <table className="w-full text-left">
                                <thead className="border-b border-black border-dashed">
                                    <tr>
                                        <th className="pb-1">ITEM</th>
                                        <th className="pb-1 text-center">QTY</th>
                                        <th className="pb-1 text-right">PRICE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items.map((item: any, idx: number) => (
                                        <tr key={idx} className="border-b border-gray-200 border-dotted">
                                            <td className="py-1 leading-tight">{item.name}</td>
                                            <td className="py-1 text-center font-bold">x{item.quantity}</td>
                                            <td className="py-1 text-right">₹{item.price * item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mb-4 space-y-1 text-[11px] border-t pt-2 border-black border-dashed">
                            <div className="flex justify-between font-bold text-lg">
                                <span>TOTAL:</span>
                                <span>₹{selectedOrder.total_amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>PAYMENT:</span>
                                <span className="uppercase">{selectedOrder.payment_status}</span>
                            </div>
                        </div>

                        <div className="text-center mt-6 border-t pt-4 border-black border-dashed">
                            <p className="text-[11px] font-bold">THANK YOU FOR SHOPPING!</p>
                            <p className="text-[9px] mt-1 italic">Please keep this receipt for your records.</p>
                            <div className="mt-4 flex flex-col items-center">
                                <div className="w-24 h-4 bg-black mb-1"></div>
                                <p className="text-[8px] tracking-widest">{selectedOrder.id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
