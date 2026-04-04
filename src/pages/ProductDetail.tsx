import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStore } from '@/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Eye,
  MessageCircle,
  Share2,
  Flag,
  CheckCircle,
} from 'lucide-react'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { products } = useStore()
  const [currentImage, setCurrentImage] = useState(0)

  const product = products.find((p) => p.id === id)

  if (!product) {
    return (
      <DashboardLayout title="Product Not Found">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
          <Link to="/marketplace">
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const handleContact = () => {
    toast.success('Contact info copied!')
  }

  const handleShare = () => {
    toast.success('Link copied to clipboard!')
  }

  return (
    <DashboardLayout title="Product Details">
      <Link to="/marketplace">
        <Button variant="ghost" className="text-white/60 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace
        </Button>
      </Link>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden">
            {product.images.length > 0 ? (
              <img
                src={product.images[currentImage]}
                alt={product.title}
                className="w-full h-full object-contain p-8"
              />
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📦</span>
                </div>
                <p className="text-white/60">No images available</p>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    currentImage === index ? 'border-[#8B5CF6]' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-white/10 text-white/70">{product.category}</Badge>
              {product.condition && (
                <Badge className="bg-[#8B5CF6]/20 text-[#8B5CF6]">{product.condition}</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{product.title}</h1>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {product.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(product.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" /> {product.views} views
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-[#8B5CF6]">
              ₦{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-white/40 line-through">
                ₦{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <Card className="bg-[#1A1A1A] border-white/5">
            <CardContent className="p-5">
              <h3 className="text-white font-medium mb-2">Description</h3>
              <p className="text-white/70 leading-relaxed">{product.description}</p>
            </CardContent>
          </Card>

          {/* Seller Info */}
          <Card className="bg-[#1A1A1A] border-white/5">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={product.sellerAvatar} />
                    <AvatarFallback className="bg-[#8B5CF6] text-white">
                      {product.sellerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-medium">{product.sellerName}</p>
                    <p className="text-white/60 text-sm flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" /> Verified Seller
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5"
                  onClick={handleContact}
                >
                  <MessageCircle className="w-4 h-4 mr-2" /> Contact
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              className="flex-1 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white py-6"
              onClick={() => toast.success('Purchase request sent!')}
            >
              Buy Now
            </Button>
            <Button
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5"
            >
              <Flag className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
