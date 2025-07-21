import React, { useState, useEffect } from 'react';
import { Heart, Fuel as Mosque, Users, BookOpen, Shield, Star, ChevronRight, Facebook, Instagram, Twitter, Mail, Phone, MapPin, UserCircle, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface Campaign {
  id: string;
  title: string;
  description: string;
  target_amount: string;
  current_amount: string;
  image_url: string;
  category: string;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, logout } = useAuth ? useAuth() : { isAuthenticated: false, user: null, logout: () => {} };
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('https://sedekahku.99delivery.id/campaigns');
      const data = await response.json();
      setCampaigns(data.campaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (index: number) => {
    const images = [
      "https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg",
      "https://images.pexels.com/photos/8819952/pexels-photo-8819952.jpeg",
      "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg"
    ];
    return images[index % images.length];
  };

  const testimonials = [
    {
      name: "Ahmad Rizki",
      location: "Jakarta",
      text: "Alhamdulillah, melalui SedekahKita saya bisa membantu pembangunan masjid dengan mudah dan transparan.",
      rating: 5
    },
    {
      name: "Siti Fatimah",
      location: "Surabaya", 
      text: "Platform yang sangat amanah. Laporan dana sangat jelas dan membuat hati tenang dalam bersedekah.",
      rating: 5
    },
    {
      name: "Muhammad Hakim",
      location: "Bandung",
      text: "Interface yang mudah digunakan dan pilihan kampanye yang beragam. Sangat membantu dalam beramal.",
      rating: 5
    }
  ];

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(parseInt(amount));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SedekahKita</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Beranda</a>
              <Link to="/campaigns" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Kampanye</Link>
              <a href="#about" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Tentang</a>
              <a href="#contact" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Kontak</a>
            </nav>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link to={user && (user.role === 'admin' || user.role === 'pengelola') ? '/dashboard/manager' : '/dashboard/donor'} className="flex items-center space-x-2 group">
                    <UserCircle className="w-8 h-8 text-emerald-600 group-hover:text-emerald-700 transition-colors duration-200" />
                    <span className="hidden md:inline font-medium text-gray-700 group-hover:text-emerald-700 transition-colors duration-200">Dashboard</span>
                  </Link>
                  <button
                    onClick={() => { logout(); navigate('/'); }}
                    className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors duration-200"
                    title="Logout"
                  >
                    <LogOut className="w-6 h-6" />
                    <span className="hidden md:inline">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200">
                    Masuk
                  </Link>
                  <Link to="/register" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg">
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-16 bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Wujudkan Mimpi
                  <span className="text-emerald-600"> Bersama</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Platform sedekah digital yang menghubungkan niat mulia Anda dengan proyek-proyek Islami yang membutuhkan. Transparan, amanah, dan mudah digunakan.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2">
                  <span>Mulai Sedekah Sekarang</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200">
                  Pelajari Lebih Lanjut
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">1000+</div>
                  <div className="text-gray-600">Kampanye Aktif</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">50K+</div>
                  <div className="text-gray-600">Donatur</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">25M+</div>
                  <div className="text-gray-600">Dana Terkumpul</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg" 
                  alt="Kegiatan sedekah"
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-2xl transform rotate-3 opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section id="campaigns" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Kampanye Unggulan</h2>
            <p className="text-xl text-gray-600">Proyek-proyek Islami yang membutuhkan dukungan Anda</p>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {campaigns.slice(0, 3).map((campaign, index) => {
                const progressPercentage = (parseInt(campaign.current_amount) / parseInt(campaign.target_amount)) * 100;
                
                return (
                  <div key={campaign.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 overflow-hidden">
                    <img 
                      src={getImageUrl(index)} 
                      alt={campaign.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900">{campaign.title}</h3>
                      <p className="text-gray-600">{campaign.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Terkumpul</span>
                          <span className="font-medium">{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-emerald-600 font-semibold">{formatCurrency(campaign.current_amount)}</span>
                          <span className="text-gray-500">{formatCurrency(campaign.target_amount)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <span className="text-sm text-gray-500">{campaign.category}</span>
                        <Link to={`/campaigns/${campaign.id}`} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg">
                          Donasi Sekarang
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Tentang SedekahKita</h2>
            <p className="text-xl text-gray-600">Platform digital terpercaya untuk sedekah dan donasi Islami</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900">Misi Kami</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                SedekahKita hadir untuk memperkuat solidaritas umat Islam melalui platform digital yang transparan dan amanah. Kami memfasilitasi donatur untuk berkontribusi pada proyek-proyek Islami seperti pembangunan masjid, pesantren, bantuan kemanusiaan, dan pendidikan Islam.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Dengan teknologi modern dan nilai-nilai Islami, kami menjembatani niat mulia donatur dengan kebutuhan nyata umat, membangun ekosistem filantropi yang berkelanjutan.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg" 
                alt="Tentang SedekahKita"
                className="rounded-2xl shadow-xl w-full h-80 object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <Mosque className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Proyek Islami</h4>
              <p className="text-gray-600">Fokus pada pembangunan masjid, pesantren, dan fasilitas keagamaan</p>
            </div>

            <div className="text-center space-y-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Transparan</h4>
              <p className="text-gray-600">Laporan keuangan yang jelas dan dapat diakses oleh semua donatur</p>
            </div>

            <div className="text-center space-y-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Komunitas</h4>
              <p className="text-gray-600">Membangun jaringan donatur dan penerima manfaat yang solid</p>
            </div>

            <div className="text-center space-y-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Edukasi</h4>
              <p className="text-gray-600">Menyediakan informasi dan edukasi tentang sedekah dalam Islam</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Testimoni Donatur</h2>
            <p className="text-xl text-gray-600">Kepercayaan dan kepuasan donatur adalah prioritas kami</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 space-y-4 hover:shadow-lg transition-all duration-300">
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">SedekahKita</span>
              </div>
              <p className="text-gray-400">
                Platform sedekah digital yang menghubungkan niat mulia dengan kebutuhan nyata umat Islam.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Menu</h4>
              <div className="space-y-2">
                <a href="#home" className="block text-gray-400 hover:text-white transition-colors duration-200">Beranda</a>
                <a href="#campaigns" className="block text-gray-400 hover:text-white transition-colors duration-200">Kampanye</a>
                <a href="#about" className="block text-gray-400 hover:text-white transition-colors duration-200">Tentang</a>
                <a href="#contact" className="block text-gray-400 hover:text-white transition-colors duration-200">Kontak</a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Bantuan</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors duration-200">FAQ</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors duration-200">Panduan Donasi</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors duration-200">Kebijakan Privasi</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors duration-200">Syarat & Ketentuan</a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Kontak</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-400">info@sedekahkita.id</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-400">+62 21 1234 5678</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <span className="text-gray-400">Jl. Kebaikan No. 123, Jakarta Selatan, Indonesia</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SedekahKita. Semua hak cipta dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;