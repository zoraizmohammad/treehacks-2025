import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Secure Mental Health Data Collection
            </h1>
            <p className="text-xl mb-8">
              Protect your students' mental health data with state-of-the-art encryption
            </p>
            <Link 
              href="/register" 
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">1. Register & Get Your Key</h3>
              <p className="text-gray-600">
                Sign up and receive your unique encryption key pair for secure data collection
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">2. Embed the Form</h3>
              <p className="text-gray-600">
                Add our secure form to your website with a simple iframe integration
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">3. Collect Data Securely</h3>
              <p className="text-gray-600">
                All data is encrypted on the client side before transmission
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Privacy First</h3>
              <p className="text-gray-600">
                Data is encrypted before it leaves the student's browser, ensuring maximum privacy
                and compliance with health data regulations.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Easy Integration</h3>
              <p className="text-gray-600">
                Simple iframe embedding makes it easy to add our secure form to any website
                or application.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Data Security</h3>
              <p className="text-gray-600">
                State-of-the-art encryption ensures that sensitive mental health data
                remains protected at all times.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Compliance Ready</h3>
              <p className="text-gray-600">
                Built with HIPAA and FERPA compliance in mind, helping you meet
                regulatory requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Ready to protect your students' mental health data?
          </h2>
          <Link 
            href="/register" 
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors inline-block"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </main>
  );
}
