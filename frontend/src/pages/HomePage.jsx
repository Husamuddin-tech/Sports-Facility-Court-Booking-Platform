import { Link } from 'react-router-dom';
import { FiCalendar, FiUsers, FiPackage, FiDollarSign, FiArrowRight, FiCheck } from 'react-icons/fi';

const HomePage = () => {
  const features = [
    {
      icon: <FiCalendar className="w-8 h-8 text-mutedCharcoal" />,
      title: 'Easy Booking',
      description: 'Book courts online in just a few clicks. Select your preferred time slot and court type.'
    },
    {
      icon: <FiPackage className="w-8 h-8 text-mutedCharcoal" />,
      title: 'Equipment Rental',
      description: 'Rent professional rackets, shoes, and shuttlecocks. No need to bring your own gear.'
    },
    {
      icon: <FiUsers className="w-8 h-8 text-mutedCharcoal" />,
      title: 'Expert Coaches',
      description: 'Learn from experienced coaches. Book private sessions to improve your game.'
    },
    {
      icon: <FiDollarSign className="w-8 h-8 text-mutedCharcoal" />,
      title: 'Dynamic Pricing',
      description: 'Transparent pricing with discounts for off-peak hours. See real-time price breakdowns.'
    }
  ];

  const stats = [
    { value: '4', label: 'Courts Available' },
    { value: '3', label: 'Expert Coaches' },
    { value: '100+', label: 'Happy Players' },
    { value: '16', label: 'Hours Daily' }
  ];

  return (
    <div className="bg-softSand text-graphite">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-frostWhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-graphite">
              Book Your Perfect
              <span className="block text-mutedCharcoal mt-2">Badminton Court</span>
            </h1>
            <p className="text-lg text-mutedCharcoal max-w-lg">
              Reserve courts, rent equipment, and book coaching sessions all in one place. 
              Experience seamless booking with transparent pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/booking"
                className="btn bg-mutedCharcoal text-frostWhite hover:bg-graphite px-8 py-3 text-lg font-semibold inline-flex items-center justify-center transition-all duration-300"
              >
                Book Now <FiArrowRight className="ml-2" />
              </Link>
              <Link
                to="/register"
                className="btn border-2 border-mutedCharcoal text-mutedCharcoal hover:bg-mutedCharcoal hover:text-frostWhite px-8 py-3 text-lg font-semibold inline-flex items-center justify-center transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Hero Stats Card */}
          <div className="hidden md:block relative">
            <div className="absolute -top-10 -right-10 w-80 h-80 lg:w-96 lg:h-96 bg-mutedCharcoal opacity-10 rounded-full"></div>
            <div className="relative z-10 bg-frostWhite backdrop-blur-sm rounded-2xl p-8 border border-paleSteel shadow-lg">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <p className="text-4xl font-bold text-graphite">{stat.value}</p>
                    <p className="text-sm text-mutedCharcoal mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-frostWhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-graphite">Everything You Need</h2>
            <p className="mt-4 text-lg text-mutedCharcoal max-w-2xl mx-auto">
              Our platform provides a complete solution for badminton enthusiasts, 
              from court booking to professional coaching.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card hover:shadow-xl transition-shadow duration-300 text-center p-6 bg-frostWhite border border-paleSteel rounded-xl"
              >
                <div className="w-16 h-16 bg-softSand rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-graphite mb-2">{feature.title}</h3>
                <p className="text-mutedCharcoal">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Info Section */}
      <section className="py-20 bg-softSand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-graphite">
              Transparent Dynamic Pricing
            </h2>
            <p className="text-lg text-mutedCharcoal">
              Our pricing adapts based on demand and time, ensuring fair rates for everyone. 
              You always see the full breakdown before confirming your booking.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Base rates starting from $20/hour',
                'Early bird discounts (6 AM - 9 AM)',
                'Premium rates for peak hours (6 PM - 9 PM)',
                'Weekend surcharges apply',
                'Indoor courts at premium pricing'
              ].map((item, index) => (
                <li key={index} className="flex items-center text-mutedCharcoal">
                  <FiCheck className="w-5 h-5 text-mutedCharcoal mr-3 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/booking"
              className="mt-8 btn bg-mutedCharcoal text-frostWhite px-6 py-3 inline-flex items-center font-semibold transition-all duration-300 hover:bg-graphite"
            >
              Check Availability <FiArrowRight className="ml-2" />
            </Link>
          </div>
          <div className="bg-frostWhite rounded-2xl p-8 border border-paleSteel shadow-lg">
            <h3 className="font-semibold text-xl text-graphite mb-6">Sample Pricing</h3>
            <div className="space-y-4">
              <div className="bg-softSand rounded-lg p-4 shadow-sm flex justify-between">
                <span className="text-graphite">Outdoor Court (Off-Peak)</span>
                <span className="font-bold text-mutedCharcoal">$20/hr</span>
              </div>
              <div className="bg-softSand rounded-lg p-4 shadow-sm flex justify-between">
                <span className="text-graphite">Indoor Court (Peak Hour)</span>
                <span className="font-bold text-mutedCharcoal">$45/hr</span>
              </div>
              <div className="bg-softSand rounded-lg p-4 shadow-sm flex justify-between">
                <span className="text-graphite">Coach Session</span>
                <span className="font-bold text-mutedCharcoal">$35-50/hr</span>
              </div>
              <div className="bg-softSand rounded-lg p-4 shadow-sm flex justify-between">
                <span className="text-graphite">Equipment Rental</span>
                <span className="font-bold text-mutedCharcoal">$2-5/hr</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-mutedCharcoal py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-frostWhite mb-4">
            Ready to Play?
          </h2>
          <p className="text-paleSteel text-lg mb-8 max-w-2xl mx-auto">
            Join our community of badminton enthusiasts. Book your first court today 
            and experience the convenience of online booking.
          </p>
          <Link
            to="/booking"
            className="btn bg-frostWhite text-mutedCharcoal hover:bg-paleSteel px-8 py-3 text-lg font-semibold inline-flex items-center transition-all duration-300"
          >
            Book Your Court <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
