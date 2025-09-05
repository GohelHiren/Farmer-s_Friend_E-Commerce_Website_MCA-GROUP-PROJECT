import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-green-700 text-white rounded-2xl overflow-hidden shadow">
        <img
          src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1400&q=80"
          alt="Farm field"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative p-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Farmer&apos;s Friend</h1>
          <p className="text-lg mb-6">
            Buy fertilizers, seeds, pesticides, and organics for your farm — focused on Gujarat regions.
          </p>
          <Link
            to="/market"
            className="bg-white text-green-700 font-semibold px-6 py-3 rounded-xl shadow hover:bg-green-100"
          >
            🛒 Shop Now
          </Link>
        </div>
      </section>

      {/* Category Feature Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/market?category=fertilizers" className="p-6 bg-white rounded-2xl shadow hover:shadow-lg hover:scale-105 transition">
          <h3 className="text-xl font-semibold mb-2">🧪 Fertilizers</h3>
          <p className="text-gray-600">Boost crop yield with trusted fertilizers.</p>
        </Link>
        <Link to="/market?category=seeds" className="p-6 bg-white rounded-2xl shadow hover:shadow-lg hover:scale-105 transition">
          <h3 className="text-xl font-semibold mb-2">🌱 Seeds</h3>
          <p className="text-gray-600">Certified hybrid and varietal seeds.</p>
        </Link>
        <Link to="/market?category=pesticides" className="p-6 bg-white rounded-2xl shadow hover:shadow-lg hover:scale-105 transition">
          <h3 className="text-xl font-semibold mb-2">🐛 Pesticides</h3>
          <p className="text-gray-600">Protect crops with safe crop care solutions.</p>
        </Link>
        <Link to="/market?category=organic" className="p-6 bg-white rounded-2xl shadow hover:shadow-lg hover:scale-105 transition">
          <h3 className="text-xl font-semibold mb-2">🍃 Organic</h3>
          <p className="text-gray-600">Eco-friendly manures and soil conditioners.</p>
        </Link>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12 bg-green-50 rounded-2xl shadow-inner">
        <h2 className="text-2xl font-bold mb-4">Start Shopping Today</h2>
        <p className="text-gray-600 mb-6">Join thousands of farmers using Farmer&apos;s Friend for better yields.</p>
        <Link
          to="/market"
          className="bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-green-800"
        >
          🚜 Go to Market
        </Link>
      </section>
    </div>
  )
}
