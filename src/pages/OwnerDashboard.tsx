import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function OwnerDashboard() {
  const { user, loading, isOwner } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login?redirect=/account/owner" replace />;
  }

  if (!isOwner) {
    return <Navigate to="/account" replace />;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">Store dashboard</h1>
      <p className="mt-1 text-gray-600">
        Owner CMS — manage your store. More features coming soon.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-gray-900">Products</h2>
          <p className="mt-1 text-sm text-gray-600">
            Add, edit, and manage products.
          </p>
          <span className="mt-2 inline-block text-xs text-gray-400">Coming soon</span>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-gray-900">Orders</h2>
          <p className="mt-1 text-sm text-gray-600">
            View and fulfill orders.
          </p>
          <span className="mt-2 inline-block text-xs text-gray-400">Coming soon</span>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-gray-900">Homepage</h2>
          <p className="mt-1 text-sm text-gray-600">
            Configure sections, feeds, and special offers.
          </p>
          <span className="mt-2 inline-block text-xs text-gray-400">Coming soon</span>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-gray-900">Categories</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage product categories.
          </p>
          <span className="mt-2 inline-block text-xs text-gray-400">Coming soon</span>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-gray-900">Store settings</h2>
          <p className="mt-1 text-sm text-gray-600">
            Logo, name, contact info, checkout options.
          </p>
          <span className="mt-2 inline-block text-xs text-gray-400">Coming soon</span>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-gray-900">Analytics</h2>
          <p className="mt-1 text-sm text-gray-600">
            Sales, traffic, and performance.
          </p>
          <span className="mt-2 inline-block text-xs text-gray-400">Coming soon</span>
        </div>
      </div>
    </div>
  )
}
