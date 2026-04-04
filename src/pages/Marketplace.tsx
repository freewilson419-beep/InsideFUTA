import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  ShoppingBag,
  Search,
  Plus,
  Filter,
  MapPin,
  Eye,
  Zap,
  BookOpen,
  Laptop,
  Wrench,
} from 'lucide-react'

const categories = [
  { id: 'all', label: 'All Items', icon: ShoppingBag },
  { id: 'books', label: 'Books', icon: BookOpen },
  { id: 'gadgets', label: 'Gadgets', icon: Laptop },
  { id: 'services', label: 'Services', icon: Wrench },
  { id: 'data', label: 'Data', icon: Zap },
]

export default function Marketplace() {
  const { products, dataBundles } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <DashboardLayout title="Marketplace">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
        </div>
        <Link to="/sell">
          <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
            <Plus className="w-4 h-4 mr-2" /> Sell Item
          </Button>
        </Link>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#8B5CF6] text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Link key={product.id} to={`/marketplace/${product.id}`}>
            <Card className="bg-[#1A1A1A] border-white/5 card-hover h-full">
              <div className="relative h-48 bg-white/5 flex items-center justify-center overflow-hidden">
                {product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <ShoppingBag className="w-16 h-16 text-white/20" />
                )}
                {product.condition && (
                  <Badge className="absolute top-3 right-3 bg-white/10 text-white">
                    {product.condition}
                  </Badge>
                )}
                {product.originalPrice && (
                  <Badge className="absolute top-3 left-3 bg-green-500/20 text-green-500">
                    Sale
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                  {product.category}
                </p>
                <h3 className="text-white font-medium mb-2 line-clamp-1">{product.title}</h3>
                <p className="text-white/60 text-sm line-clamp-2 mb-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[#8B5CF6] font-bold text-lg">
                      ₦{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-white/40 text-sm line-through ml-2">
                        ₦{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-white/40 text-sm">
                    <MapPin className="w-3 h-3" />
                    {product.location}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Data Bundles Section */}
      {selectedCategory === 'all' || selectedCategory === 'data' ? (
        <div className="mt-12">
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#8B5CF6]" />
            Data Bundles
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dataBundles.map((bundle) => (
              <Card key={bundle.id} className="bg-[#1A1A1A] border-white/5">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        bundle.network === 'mtn'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : bundle.network === 'airtel'
                          ? 'bg-red-500/20 text-red-500'
                          : bundle.network === 'glo'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-teal-500/20 text-teal-500'
                      }`}
                    >
                      {bundle.network[0].toUpperCase()}
                    </div>
                    <span className="text-white font-medium">{bundle.name}</span>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">{bundle.size}</p>
                  <p className="text-white/60 text-sm mb-4">{bundle.validity}</p>
                  <Button
                    className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                    onClick={() => toast.success(`Purchased ${bundle.name}!`)}
                  >
                    ₦{bundle.price}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  )
}
