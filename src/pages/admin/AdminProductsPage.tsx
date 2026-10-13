import { useState, type FormEvent } from 'react';
import {
  Edit3,
  Filter,
  Plus,
  Search,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { categories, money, type Product } from '../../data/products';
import { useShop } from '../../store/shop';

export default function AdminProductsPage() {
  const products = useShop((s) => s.adminProducts);
  const addProduct = useShop((s) => s.addProduct);
  const updateProduct = useShop((s) => s.updateProduct);
  const deleteProduct = useShop((s) => s.deleteProduct);

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCat, setFormCat] = useState(categories[0].slug);
  const [formPrice, setFormPrice] = useState(2499);
  const [formOldPrice, setFormOldPrice] = useState<number | ''>('');
  const [formTag, setFormTag] = useState<'new' | 'featured' | 'bestseller' | ''>('new');
  const [formImage, setFormImage] = useState('https://images.pexels.com/photos/12955710/pexels-photo-12955710.jpeg?auto=compress&cs=tinysrgb&h=650&w=940');
  const [formDesc, setFormDesc] = useState('Hand-crafted premium piece designed for timeless versatility and all-day comfort.');

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCat(categories[0].slug);
    setFormPrice(2499);
    setFormOldPrice('');
    setFormTag('new');
    setFormImage('https://images.pexels.com/photos/12955710/pexels-photo-12955710.jpeg?auto=compress&cs=tinysrgb&h=650&w=940');
    setFormDesc('Hand-crafted premium piece designed for timeless versatility and all-day comfort.');
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCat(p.category);
    setFormPrice(p.price);
    setFormOldPrice(p.oldPrice || '');
    setFormTag(p.tags[0] || '');
    setFormImage(p.image);
    setFormDesc(p.description);
    setModalOpen(true);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.slug, {
        name: formName.trim(),
        category: formCat,
        price: Number(formPrice),
        oldPrice: formOldPrice ? Number(formOldPrice) : undefined,
        tags: formTag ? [formTag] : [],
        image: formImage,
        description: formDesc,
      });
    } else {
      const slug = formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newProduct: Product = {
        id: Date.now(),
        slug: slug || `prod-${Date.now()}`,
        name: formName.trim(),
        category: formCat,
        price: Number(formPrice),
        oldPrice: formOldPrice ? Number(formOldPrice) : undefined,
        rating: 4.8,
        reviews: 14,
        colors: [{ name: 'Black', hex: '#111111' }],
        sizes: ['S', 'M', 'L', 'XL'],
        description: formDesc,
        benefits: ['Premium quality construction', 'Breathable materials', 'Tailored contemporary fit'],
        care: ['Dry clean or delicate cycle', 'Do not bleach'],
        details: { reference: `PRD-${Date.now().toString().slice(-4)}`, weight: '0.6 kg', material: 'Premium Cotton / Wool' },
        tags: formTag ? [formTag] : ['new'],
        tint: '#3b2a22',
        image: formImage,
        wearingImage: formImage,
      };
      addProduct(newProduct);
    }

    setModalOpen(false);
  };

  const filtered = products.filter((p) => {
    const matchesCat = selectedCat === 'all' || p.category === selectedCat;
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div>
      <div className="adm-header">
        <div>
          <h1 className="adm-title">Products Catalogue</h1>
          <p className="adm-subtitle">Add, edit, or remove store garments, apparel & accessories ({products.length} total).</p>
        </div>
        <button
          type="button"
          className="adm-btn-primary"
          onClick={openAddModal}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <Search size={16} className="adm-search-icon" />
          <input
            type="text"
            className="adm-search-input"
            placeholder="Search products by title, tag or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="adm-filter-tabs">
          <button
            type="button"
            className={`adm-tab${selectedCat === 'all' ? ' active' : ''}`}
            onClick={() => setSelectedCat('all')}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              className={`adm-tab${selectedCat === c.slug ? ' active' : ''}`}
              onClick={() => setSelectedCat(c.slug)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="adm-table-card">
        <div className="adm-table-scroll">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Tags</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.slug}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div
                        style={{
                          width: 44,
                          height: 52,
                          borderRadius: 8,
                          overflow: 'hidden',
                          background: 'var(--st-card2)',
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.pexels.com/photos/12955710/pexels-photo-12955710.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
                          }}
                        />
                      </div>
                      <div>
                        <strong style={{ fontSize: 14 }} className="adm-break">{p.name}</strong>
                        <div style={{ fontSize: 11, color: 'var(--st-mute)', fontFamily: 'monospace' }} className="adm-break">
                          /{p.slug}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span style={{ textTransform: 'capitalize', color: 'var(--st-mute)' }}>
                      {categories.find((c) => c.slug === p.category)?.name ?? p.category}
                    </span>
                  </td>

                  <td>
                    <strong>{money(p.price)}</strong>
                    {p.oldPrice && (
                      <span style={{ fontSize: 12, color: 'var(--st-mute)', textDecoration: 'line-through', marginLeft: 6 }}>
                        {money(p.oldPrice)}
                      </span>
                    )}
                  </td>

                  <td>
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          background: 'rgba(217, 133, 69, 0.15)',
                          color: 'var(--st-accent)',
                          padding: '3px 8px',
                          borderRadius: 99,
                          fontSize: 11,
                          fontWeight: 600,
                          marginRight: 4,
                          textTransform: 'uppercase',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </td>

                  <td>
                    <span style={{ color: '#facc15' }}>★</span> {p.rating.toFixed(1)}
                  </td>

                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        type="button"
                        className="adm-tool-btn"
                        style={{ padding: '6px 10px', fontSize: 12 }}
                        onClick={() => openEditModal(p)}
                        title="Edit product"
                      >
                        <Edit3 size={13} /> Edit
                      </button>
                      <button
                        type="button"
                        className="adm-tool-btn"
                        style={{ padding: '6px 10px', fontSize: 12, color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.3)' }}
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                            deleteProduct(p.slug);
                          }
                        }}
                        title="Delete product"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="adm-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2 className="adm-modal-title">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button
                type="button"
                className="adm-modal-close"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="adm-form-group">
                <label className="adm-label">Product Name</label>
                <input
                  type="text"
                  required
                  className="adm-input"
                  placeholder="e.g. Italian Wool Blazer"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>

              <div className="adm-form-row">
                <div className="adm-form-group">
                  <label className="adm-label">Category</label>
                  <select
                    className="adm-select"
                    value={formCat}
                    onChange={(e) => setFormCat(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="adm-form-group">
                  <label className="adm-label">Tag Badge</label>
                  <select
                    className="adm-select"
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value as any)}
                  >
                    <option value="">None</option>
                    <option value="new">NEW</option>
                    <option value="bestseller">BESTSELLER</option>
                    <option value="featured">FEATURED</option>
                  </select>
                </div>
              </div>

              <div className="adm-form-row">
                <div className="adm-form-group">
                  <label className="adm-label">Price (INR)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    className="adm-input"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-label">Old / Strikethrough Price (Optional)</label>
                  <input
                    type="number"
                    min={0}
                    className="adm-input"
                    placeholder="e.g. 3499"
                    value={formOldPrice}
                    onChange={(e) => setFormOldPrice(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
              </div>

              <div className="adm-form-group">
                <label className="adm-label">Image URL</label>
                <input
                  type="url"
                  required
                  className="adm-input"
                  placeholder="https://..."
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-label">Product Description</label>
                <textarea
                  rows={3}
                  className="adm-textarea"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                />
              </div>

              <div className="adm-header-actions" style={{ justifyContent: 'flex-end', marginTop: 24 }}>
                <button
                  type="button"
                  className="adm-btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="adm-btn-primary">
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

