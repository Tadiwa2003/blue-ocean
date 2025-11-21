import { Product } from '../types';

interface ProductTableProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
}

export function ProductTable({ products, onSelectProduct }: ProductTableProps) {
  if (!products.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
        <p className="text-base font-semibold">No products yet</p>
        <p className="mt-1 text-sm text-white/60">Start by adding your first product to publish in the online store.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <table className="min-w-full divide-y divide-white/5 text-left">
        <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-white/40">
          <tr>
            <th className="px-6 py-4">Product</th>
            <th className="px-6 py-4">Inventory</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-sm text-white/80">
          {products.map((product) => (
            <tr
              key={product.id}
              className="cursor-pointer transition hover:bg-white/5"
              onClick={() => onSelectProduct?.(product)}
            >
              <td className="px-6 py-4">
                <p className="font-medium text-white">{product.title}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">{product.handle}</p>
              </td>
              <td className="px-6 py-4">
                <p className="font-semibold">{product.inventory}</p>
                <p className="text-xs text-white/50">{product.inventoryStatus.replace('_', ' ')}</p>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    product.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-300'
                      : 'bg-amber-500/10 text-amber-200'
                  }`}
                >
                  {product.status === 'active' ? 'Published' : 'Draft'}
                </span>
              </td>
              <td className="px-6 py-4 font-semibold">${product.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
