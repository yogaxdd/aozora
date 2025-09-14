'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { Play, Star, Calendar, TrendingUp, Film, Download, ChevronRight, Eye, Clock, Users, Zap, Flame } from 'lucide-react'

// Mock data - will be replaced with actual API calls
const mockFeaturedAnime = [
  {
    id: 1,
    title: "Attack on Titan Final Season",
    image: "https://i0.wp.com/samehadaku.email/wp-content/uploads/2023/03/Attack-on-Titan-Final-Season-Part-3.jpg",
    description: "Pertempuran terakhir melawan para titan dimulai...",
    rating: 9.8,
    year: 2023,
    status: "Ongoing"
  },
  {
    id: 2,
    title: "Demon Slayer: Kimetsu no Yaiba",
    image: "https://i0.wp.com/samehadaku.email/wp-content/uploads/2023/04/Kimetsu-no-Yaiba-Katanakaji-no-Sato-hen.jpg",
    description: "Tanjiro melanjutkan perjalanannya untuk menyelamatkan adiknya...",
    rating: 9.5,
    year: 2023,
    status: "Ongoing"
  },
  {
    id: 3,
    title: "Jujutsu Kaisen Season 2",
    image: "https://i0.wp.com/samehadaku.email/wp-content/uploads/2023/07/Jujutsu-Kaisen-2nd-Season.jpg",
    description: "Petualangan baru Yuji dan teman-temannya dimulai...",
    rating: 9.3,
    year: 2023,
    status: "Ongoing"
  }
]

const mockLatestAnime = [
  {
    id: 1,
    title: "Frieren: Beyond Journey's End",
    image: "https://i0.wp.com/samehadaku.email/wp-content/uploads/2023/09/Sousou-no-Frieren.jpg",
    episode: "Episode 12",
    rating: 9.7
  },
  {
    id: 2,
    title: "Spy x Family Season 2",
    image: "https://i0.wp.com/samehadaku.email/wp-content/uploads/2023/10/Spy-x-Family-Season-2.jpg",
    episode: "Episode 8",
    rating: 9.2
  },
  {
    id: 3,
    title: "Chainsaw Man",
    image: "https://i0.wp.com/samehadaku.email/wp-content/uploads/2022/10/Chainsaw-Man.jpg",
    episode: "Episode 12",
    rating: 8.9
  },
  {
    id: 4,
    title: "One Piece",
    image: "https://i0.wp.com/samehadaku.email/wp-content/uploads/2021/01/One-Piece.jpg",
    episode: "Episode 1089",
    rating: 9.8
  },
  {
    id: 5,
    title: "Bleach: TYBW",
    image: "https://i0.wp.com/samehadaku.email/wp-content/uploads/2022/10/Bleach-Sennen-Kessen-hen.jpg",
    episode: "Episode 24",
    rating: 9.4
  },
  {
    id: 6,
    title: "My Hero Academia Season 7",
    image: "https://i0.wp.com/samehadaku.email/wp-content/uploads/2023/03/Boku-no-Hero-Academia-7th-Season.jpg",
    episode: "Episode 15",
    rating: 8.7
  }
]

const categories = [
  { name: 'Anime Terbaru', href: '/latest', icon: Flame, color: 'from-red-500 to-pink-500' },
  { name: 'Sedang Tayang', href: '/ongoing', icon: Clock, color: 'from-green-500 to-emerald-500' },
  { name: 'Terpopuler', href: '/popular', icon: TrendingUp, color: 'from-purple-500 to-violet-500' },
  { name: 'Movie', href: '/movie', icon: Film, color: 'from-blue-500 to-cyan-500' },
  { name: 'Batch Download', href: '/batch', icon: Download, color: 'from-yellow-500 to-orange-500' },
  { name: 'Semua Genre', href: '/genre', icon: Star, color: 'from-indigo-500 to-purple-500' }
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockFeaturedAnime.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent" />
      </div>
      
      <div className="relative z-10">
        <Navbar />
      
        {/* Hero Section */}
        <section className="relative min-h-screen overflow-hidden">
          {/* Background Carousel */}
          <div className="absolute inset-0">
            {mockFeaturedAnime.map((anime, index) => (
              <div
                key={anime.id}
                className={`absolute inset-0 transition-all duration-1000 ${
                  index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                <div 
                  className="w-full h-full bg-cover bg-center filter brightness-75"
                  style={{
                    backgroundImage: `url(${anime.image})`
                  }}
                />
              </div>
            ))}
          </div>
          
          {/* Hero Content */}
          <div className="relative z-20 min-h-screen flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className={`transform transition-all duration-1000 delay-300 ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                  <div className="mb-6">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full mb-4">
                      <Zap className="w-4 h-4 text-purple-400 mr-2" />
                      <span className="text-sm font-medium text-purple-300">Streaming Terbaik Indonesia</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black mb-4 leading-none">
                      <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        AOZORA
                      </span>
                    </h1>
                    <p className="text-2xl md:text-3xl font-bold text-white mb-2">
                      Blue Sky Anime
                    </p>
                    <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                      Nikmati ribuan anime terbaik dengan kualitas 4K HDR. 
                      Streaming tanpa batas, tanpa iklan, kapan saja di mana saja.
                    </p>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Link href="/popular" className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 inline-block">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative flex items-center justify-center space-x-3">
                        <Play className="w-6 h-6" fill="currentColor" />
                        <span>Mulai Streaming</span>
                      </div>
                    </Link>
                    <Link href="/genres" className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 inline-block">
                      <div className="relative flex items-center justify-center space-x-3">
                        <Eye className="w-6 h-6" />
                        <span>Jelajahi</span>
                      </div>
                    </Link>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">10K+</div>
                      <div className="text-sm text-gray-400">Anime</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">4K</div>
                      <div className="text-sm text-gray-400">Quality</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">24/7</div>
                      <div className="text-sm text-gray-400">Streaming</div>
                    </div>
                  </div>
                </div>
                
                {/* Right Content - Featured Anime Card */}
                <div className={`transform transition-all duration-1000 delay-500 ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                  <div className="relative">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-gray-300">SEDANG TRENDING</span>
                      </div>
                      
                      <h2 className="text-3xl font-bold mb-3 text-white">
                        {mockFeaturedAnime[currentSlide].title}
                      </h2>
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        {mockFeaturedAnime[currentSlide].description}
                      </p>
                      
                      <div className="flex items-center space-x-6 mb-6">
                        <div className="flex items-center space-x-2">
                          <Star className="text-yellow-400 fill-current w-5 h-5" />
                          <span className="font-bold text-white">{mockFeaturedAnime[currentSlide].rating}</span>
                          <span className="text-gray-400 text-sm">/10</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="text-blue-400 w-5 h-5" />
                          <span className="text-gray-300">{mockFeaturedAnime[currentSlide].year}</span>
                        </div>
                        <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm rounded-full font-medium">
                          {mockFeaturedAnime[currentSlide].status}
                        </div>
                      </div>
                      
                      <Link href={`/anime/${mockFeaturedAnime[currentSlide].id}`} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3">
                        <Play className="w-6 h-6" fill="currentColor" />
                        <span>Tonton Sekarang</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Slide indicators */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {mockFeaturedAnime.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 scale-125' 
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Jelajahi Kategori
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Temukan anime favorit Anda berdasarkan kategori yang tersedia
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category, index) => {
                const Icon = category.icon
                return (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    <div className="relative z-10 text-center">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon className="text-white" size={28} />
                      </div>
                      <h3 className="font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
                        {category.name}
                      </h3>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/0 via-blue-600/0 to-cyan-600/0 group-hover:from-purple-600/5 group-hover:via-blue-600/5 group-hover:to-cyan-600/5 transition-all duration-500" />
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Latest Anime Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-2">
                  <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Anime Terbaru
                  </span>
                </h2>
                <p className="text-gray-400">Episode terbaru yang baru saja dirilis</p>
              </div>
              <Link
                href="/latest"
                className="group flex items-center space-x-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 hover:border-purple-400/50 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                <span className="text-white group-hover:text-purple-300">Lihat Semua</span>
                <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {mockLatestAnime.map((anime, index) => (
                <div 
                  key={anime.id} 
                  className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-4 shadow-2xl">
                    <Image
                      src={anime.image}
                      alt={anime.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/20 group-hover:to-blue-600/20 transition-all duration-500" />
                    
                    {/* Episode Badge */}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-blue-600 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg">
                      {anime.episode}
                    </div>
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-8 h-8 text-white" fill="currentColor" />
                      </div>
                    </div>
                    
                    {/* Bottom Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Star className="text-yellow-400 fill-current w-4 h-4" />
                          <span className="text-sm font-bold text-white">{anime.rating}</span>
                        </div>
                        <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all duration-300 transform hover:scale-105">
                          Tonton
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-1">
                    <h3 className="font-bold text-white mb-1 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
                      {anime.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative py-20 px-4 sm:px-6 lg:px-8 mt-20">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900/50 to-transparent" />
          <div className="relative max-w-7xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-white font-black text-2xl">A</span>
                </div>
                <span className="text-4xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  AOZORA
                </span>
              </div>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Platform streaming anime terbaik Indonesia dengan koleksi lengkap, kualitas 4K HDR, dan pengalaman menonton yang tak terlupakan.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">10,000+</div>
                  <div className="text-gray-400">Anime Series</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">4K HDR</div>
                  <div className="text-gray-400">Ultra Quality</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">24/7</div>
                  <div className="text-gray-400">Non-Stop Streaming</div>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-8">
                <p className="text-gray-500">
                  © 2025 Aozora - Blue Sky Anime Streaming. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
