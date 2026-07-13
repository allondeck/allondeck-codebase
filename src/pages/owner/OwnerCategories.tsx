import { Link, useNavigate } from 'react-router-dom'
import { useCategoriesAdmin } from '../../hooks/useCategoriesAdmin'

export default function OwnerCategories() {
  const navigate = useNavigate()
  const { categories, loading, error } = useCategoriesAdmin()

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#066175]/35 border-t-[#e38622]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-950/40 border border-red-900/55 p-4 text-red-400">
        Failed to load categories: {error.message}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-[#f6ebd4]">Categories</h2>
        <Link
          to="/account/owner/categories/new"
          className="w-full rounded-lg bg-[#e38622] px-4 py-2 text-center text-sm font-medium text-white hover:bg-[#e38622]/80 sm:w-auto"
        >
          Add category
        </Link>
      </div>
      <div className="overflow-x-auto rounded-lg border border-[#066175]/35 bg-[#052631]">
        <table className="w-full min-w-[320px] table-fixed divide-y divide-[#066175]/35">
          <thead className="bg-[#066175]/30">
            <tr>
              <th className="w-[40%] px-4 py-2.5 text-left text-xs font-medium uppercase text-[#76abbf]">
                Name
              </th>
              <th className="w-[40%] px-4 py-2.5 text-left text-xs font-medium uppercase text-[#76abbf]">
                Slug
              </th>
              <th className="w-[20%] px-4 py-2.5 text-center text-xs font-medium uppercase text-[#76abbf]">
                Visible
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#066175]/35 bg-[#052631]">
            {categories.map((cat) => (
              <tr
                key={cat.id}
                onClick={() => navigate(`/account/owner/categories/${cat.id}`)}
                className="cursor-pointer hover:bg-[#066175]/20"
              >
                <td className="px-4 py-2.5 font-medium text-white">{cat.name}</td>
                <td className="px-4 py-2.5 text-sm text-[#76abbf]">{cat.slug}</td>
                <td className="px-4 py-2.5 text-center">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      cat.is_visible
                        ? 'bg-green-950/40 text-green-400 border border-green-900/30'
                        : 'bg-[#066175]/30 text-[#76abbf] border border-[#066175]/35'
                    }`}
                  >
                    {cat.is_visible ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {categories.length === 0 && (
        <p className="mt-6 text-center text-[#76abbf]">No categories yet.</p>
      )}
    </div>
  )
}

