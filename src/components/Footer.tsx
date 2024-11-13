import React from 'react';
import { Heart, Instagram, Facebook, Twitter, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-purple-600" />
              <span className="text-xl font-bold">WellnessCircle</span>
            </div>
            <p className="text-gray-600">
              Empowering women through health education and community support.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-purple-600">Health Articles</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600">Wellness Tips</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600">Community Guidelines</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600">Support Groups</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-purple-600">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600">Contact</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600">Careers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600">Press Kit</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-purple-600">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600">HIPAA Compliance</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-center text-gray-500">
            © {currentYear} WellnessCircle. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}