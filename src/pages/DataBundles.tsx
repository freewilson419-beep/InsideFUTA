import { useStore } from '@/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Wifi, Smartphone } from 'lucide-react'

const networks = [
  { id: 'mtn', name: 'MTN', color: 'bg-yellow-500', textColor: 'text-yellow-500' },
  { id: 'airtel', name: 'Airtel', color: 'bg-red-500', textColor: 'text-red-500' },
  { id: 'glo', name: 'GLO', color: 'bg-green-500', textColor: 'text-green-500' },
  { id: '9mobile', name: '9mobile', color: 'bg-teal-500', textColor: 'text-teal-500' },
]

export default function DataBundles() {
  const { dataBundles } = useStore()

  const handlePurchase = (bundleName: string) => {
    toast.success(`Purchased ${bundleName}! Data will be credited shortly.`)
  }

  return (
    <DashboardLayout title="Data Bundles">
      {/* Hero */}
      <Card className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] border-none mb-8">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Wifi className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Cheap Data Bundles</h2>
              <p className="text-white/80">Get affordable data for all networks</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">30%</p>
              <p className="text-white/70 text-sm">Cheaper</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">Instant</p>
              <p className="text-white/70 text-sm">Delivery</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="text-white/70 text-sm">Support</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">100%</p>
              <p className="text-white/70 text-sm">Secure</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Networks */}
      <div className="grid md:grid-cols-2 gap-6">
        {networks.map((network) => {
          const networkBundles = dataBundles.filter((b) => b.network === network.id)
          return (
            <Card key={network.id} className="bg-[#1A1A1A] border-white/5">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <div className={`w-10 h-10 ${network.color}/20 rounded-xl flex items-center justify-center`}>
                    <Smartphone className={`w-5 h-5 ${network.textColor}`} />
                  </div>
                  {network.name} Data Bundles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {networkBundles.map((bundle) => (
                    <div
                      key={bundle.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <div>
                        <p className="text-white font-semibold">{bundle.name}</p>
                        <div className="flex items-center gap-2 text-white/60 text-sm">
                          <span>{bundle.size}</span>
                          <span>•</span>
                          <span>{bundle.validity}</span>
                        </div>
                      </div>
                      <Button
                        className={`${network.color} hover:opacity-90 text-white`}
                        onClick={() => handlePurchase(bundle.name)}
                      >
                        ₦{bundle.price}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* How it Works */}
      <Card className="bg-[#1A1A1A] border-white/5 mt-8">
        <CardHeader>
          <CardTitle className="text-white">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Choose Bundle',
                description: 'Select your preferred network and data plan',
              },
              {
                step: '2',
                title: 'Make Payment',
                description: 'Pay securely using your preferred method',
              },
              {
                step: '3',
                title: 'Get Data',
                description: 'Receive your data instantly via SMS',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-[#8B5CF6]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#8B5CF6] font-bold">{item.step}</span>
                </div>
                <h4 className="text-white font-medium mb-2">{item.title}</h4>
                <p className="text-white/60 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
