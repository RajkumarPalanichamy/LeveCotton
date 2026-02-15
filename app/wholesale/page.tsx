'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Package, Send, CheckCircle, Loader2 } from 'lucide-react';

export default function WholesalePage() {
    const [formData, setFormData] = useState({
        businessName: '',
        contactPerson: '',
        email: '',
        phone: '',
        gstNumber: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        productCategories: [] as string[],
        estimatedQuantity: '',
        message: ''
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);





    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // First, send email
            const response = await fetch('/api/wholesale', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                alert('Failed to send email. Please try again.');
                setSubmitting(false);
                return;
            }

            setSubmitted(true);
        } catch (error) {
            alert('Failed to send inquiry. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
                <Navbar />
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Thank You!</h1>
                        <p className="text-lg text-gray-600 mb-8">
                            We've received your wholesale inquiry. Our team will review your requirements and get back to you within 24 hours.
                        </p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-8 py-3 text-white rounded-lg font-semibold transition-all"
                            style={{ backgroundColor: '#6D3B2C' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a2f23'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6D3B2C'}
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
            <Navbar />

            {/* Hero Section */}
            <div className="text-white py-16" style={{ background: '#6D3B2C' }}>
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Package className="w-16 h-16 mx-auto mb-4" />
                        <p className="text-lg md:text-xl opacity-90">
                            Partner with LeveCotton for bulk orders and exclusive wholesale pricing
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                        <form onSubmit={handleSubmit}>
                            {/* Business Information */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6D3B2C' }}>
                                        <span className="text-white font-bold">1</span>
                                    </div>
                                    Business Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Business Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.businessName}
                                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none"
                                            style={{ borderColor: formData.businessName ? '#6D3B2C' : '' }}
                                            placeholder="Your Business Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Contact Person *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.contactPerson}
                                            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none"
                                            style={{ borderColor: formData.contactPerson ? '#6D3B2C' : '' }}
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none"
                                            style={{ borderColor: formData.email ? '#6D3B2C' : '' }}
                                            placeholder="business@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none"
                                            style={{ borderColor: formData.phone ? '#6D3B2C' : '' }}
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            GST Number (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.gstNumber}
                                            onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none"
                                            style={{ borderColor: formData.gstNumber ? '#6D3B2C' : '' }}
                                            placeholder="22AAAAA0000A1Z5"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address Information */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6D3B2C' }}>
                                        <span className="text-white font-bold">2</span>
                                    </div>
                                    Business Address
                                </h2>
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Street Address *
                                        </label>
                                        <textarea
                                            required
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none resize-none"
                                            style={{ borderColor: formData.address ? '#6D3B2C' : '' }}
                                            placeholder="Enter your complete business address"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none"
                                                style={{ borderColor: formData.city ? '#6D3B2C' : '' }}
                                                placeholder="City"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                State *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.state}
                                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none"
                                                style={{ borderColor: formData.state ? '#6D3B2C' : '' }}
                                                placeholder="State"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Pincode *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.pincode}
                                                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none"
                                                style={{ borderColor: formData.pincode ? '#6D3B2C' : '' }}
                                                placeholder="600001"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Product Requirements */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6D3B2C' }}>
                                        <span className="text-white font-bold">3</span>
                                    </div>
                                    Product Requirements
                                </h2>
                                <div className="space-y-6">

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Estimated Monthly Quantity *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.estimatedQuantity}
                                            onChange={(e) => setFormData({ ...formData, estimatedQuantity: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none"
                                            style={{ borderColor: formData.estimatedQuantity ? '#6D3B2C' : '' }}
                                            placeholder="e.g., 500 pieces, 100 dozens"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Additional Message
                                        </label>
                                        <textarea
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none resize-none"
                                            style={{ borderColor: formData.message ? '#6D3B2C' : '' }}
                                            placeholder="Tell us more about your requirements, preferred delivery schedule, or any specific questions..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="border-t-2 border-gray-100 pt-8">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                    style={{ backgroundColor: submitting ? '#9ca3af' : '#6D3B2C' }}
                                    onMouseEnter={(e) => {
                                        if (!submitting) {
                                            e.currentTarget.style.backgroundColor = '#5a2f23';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!submitting) {
                                            e.currentTarget.style.backgroundColor = '#6D3B2C';
                                        }
                                    }}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            <span>Submit Wholesale Inquiry</span>
                                        </>
                                    )}
                                </button>

                                <p className="text-sm text-gray-500 mt-3 text-center">
                                    Your inquiry will be sent to our wholesale team via email
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Benefits Section */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#E5D5C8' }}>
                                <Package className="w-6 h-6" style={{ color: '#6D3B2C' }} />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Bulk Pricing</h3>
                            <p className="text-sm text-gray-600">Competitive wholesale rates for bulk orders</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#E5D5C8' }}>
                                <Send className="w-6 h-6" style={{ color: '#6D3B2C' }} />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Fast Delivery</h3>
                            <p className="text-sm text-gray-600">Reliable and timely delivery across India</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#E5D5C8' }}>
                                <CheckCircle className="w-6 h-6" style={{ color: '#6D3B2C' }} />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Quality Assured</h3>
                            <p className="text-sm text-gray-600">Premium quality products guaranteed</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
