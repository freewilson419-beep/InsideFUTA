import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Upload, X, Camera } from 'lucide-react'

const categories = [
  { value: 'books', label: 'Books & Notes' },
  { value: 'gadgets', label: 'Gadgets & Electronics' },
  { value: 'services', label: 'Services' },
  { value: 'others', label: 'Others' },
]

const conditions = [
  { value: 'new', label: 'Brand New' },
  { value: 'used', label: 'Used' },
  { value: 'refurbished', label: 'Refurbished' },
]

export default function SellItem() {
  const navigate = useNavigate()
  const { addProduct, user } = useStore()
  const [images, setImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    condition: '',
    location: '',
  })

  const handleImageUpload = () => {
    // Mock image upload
    const mockImages = ['/images/product-laptop.png', '/images/product-textbook.png']
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)]
    setImages([...images, randomImage])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!formData.title || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    addProduct({
      title: formData.title,
      description: formData.description,
      price: parseInt(formData.price),
      originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : undefined,
      category: formData.category as any,
      images,
      condition: formData.condition as any,
      sellerId: user?.id || '',
      sellerName: user?.name || '',
      sellerAvatar: user?.avatar,
      status: 'available',
      location: formData.location || 'School Gate',
    })

    toast.success('Item listed successfully!')
    navigate('/marketplace')
  }

  return (
    <DashboardLayout title="Sell Item">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-[#1A1A1A] border-white/5">
          <CardHeader>
            <CardTitle className="text-white">List Your Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Images */}
            <div className="space-y-2">
              <Label className="text-white">Photos</Label>
              <div className="flex flex-wrap gap-3">
                {images.map((img, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleImageUpload}
                  className="w-24 h-24 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center text-white/60 hover:border-[#8B5CF6] hover:text-[#8B5CF6] transition-colors"
                >
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-xs">Add Photo</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label className="text-white">Title *</Label>
              <Input
                placeholder="What are you selling?"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-white">Description</Label>
              <textarea
                placeholder="Describe your item..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white min-h-[100px] resize-none"
              />
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Price (₦) *</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Original Price (₦)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            {/* Category & Condition */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Category *</Label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="">Select category...</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Condition</Label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="">Select condition...</option>
                  {conditions.map((cond) => (
                    <option key={cond.value} value={cond.value}>{cond.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label className="text-white">Location</Label>
              <Input
                placeholder="e.g., Hostel A, School Gate"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white py-6"
            >
              <Upload className="w-5 h-5 mr-2" /> List Item for Sale
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
