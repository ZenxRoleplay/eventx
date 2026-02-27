import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FeaturedFest from '../components/FeaturedFest'
import TrendingSection from '../components/TrendingSection'
import CategorySection from '../components/CategorySection'
import CollegeSection from '../components/CollegeSection'
import CtaBanner from '../components/CtaBanner'
import Footer from '../components/Footer'
import { getCityEvents, getFests } from '../services/api'

export default function Home() {
  const [fests,      setFests]      = useState([])
  const [cityEvents, setCityEvents] = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    Promise.all([getFests(), getCityEvents()])
      .then(([festsRes, cityRes]) => {
        setFests(festsRes.data || [])
        setCityEvents(cityRes.data || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="bg-white">
      <Navbar />
      <Hero />
      <FeaturedFest events={fests} loading={loading} />
      <TrendingSection events={cityEvents} loading={loading} />
      <CategorySection events={cityEvents} />
      <CollegeSection />
      <CtaBanner />
      <Footer />
    </main>
  )
}
