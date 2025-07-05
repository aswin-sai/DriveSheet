import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Users, Calendar, Shield, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <Car className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 flex-shrink-0" />
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              DriveSheet
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Link to="/login/admin" className="flex-1 sm:flex-none">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                Admin Login
              </Button>
            </Link>
            <Link to="/login/student" className="flex-1 sm:flex-none">
              <Button variant="primary" size="sm" className="w-full sm:w-auto">
                Student Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-slate-100 mb-6 sm:mb-8 leading-tight">
            Modern Driving School
            <span className="text-blue-600 block sm:inline"> Management</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed">
            Streamline your driving school operations with our comprehensive management system. 
            Track students, manage sessions, and monitor progress with ease.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 sm:mb-16">
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-base sm:text-lg px-8 py-4">
                Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link to="/login/student" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base sm:text-lg px-8 py-4">
                Student Portal
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-slate-900 dark:text-slate-100 mb-8 sm:mb-12 lg:mb-16">
            Everything you need to manage your driving school
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            <div className="text-center p-6 sm:p-8 lg:p-10">
              <div className="h-20 w-20 sm:h-24 sm:w-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Student Management
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
                Track student progress, manage profiles, and monitor attendance with detailed analytics.
              </p>
            </div>
            
            <div className="text-center p-6 sm:p-8 lg:p-10">
              <div className="h-20 w-20 sm:h-24 sm:w-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Session Scheduling
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
                Schedule and manage driving sessions, track attendance, and maintain detailed session logs.
              </p>
            </div>
            
            <div className="text-center p-6 sm:p-8 lg:p-10 md:col-span-2 lg:col-span-1">
              <div className="h-20 w-20 sm:h-24 sm:w-24 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-purple-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Secure & Reliable
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
                Enterprise-grade security with role-based access control for admins and students.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8">
            Ready to get started?
          </h2>
          <p className="text-blue-100 mb-8 sm:mb-12 text-lg sm:text-xl lg:text-2xl leading-relaxed">
            Join thousands of driving schools already using DriveSheet to streamline their operations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base sm:text-lg px-8 py-4">
                Create Account
              </Button>
            </Link>
            <Link to="/login/admin" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base sm:text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-6 sm:py-8 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2024 DriveSheet. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 