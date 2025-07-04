import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Users, Calendar, Shield, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              DriveSheet
            </span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            <Link to="/login/admin">
              <Button variant="outline" size="sm">
                Admin Login
              </Button>
            </Link>
            <Link to="/login/student">
              <Button variant="primary" size="sm">
                Student Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6">
            Modern Driving School
            <span className="text-blue-600"> Management</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 max-w-3xl mx-auto">
            Streamline your driving school operations with our comprehensive management system. 
            Track students, manage sessions, and monitor progress with ease.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <Link to="/register">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link to="/login/student">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Student Portal
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 sm:px-6 py-12 sm:py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 dark:text-slate-100 mb-8 sm:mb-12">
            Everything you need to manage your driving school
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4 sm:p-6">
              <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Student Management
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Track student progress, manage profiles, and monitor attendance with detailed analytics.
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-6">
              <div className="h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Session Scheduling
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Schedule and manage driving sessions, track attendance, and maintain detailed session logs.
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-6">
              <div className="h-16 w-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Secure & Reliable
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Enterprise-grade security with role-based access control for admins and students.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 sm:px-6 py-12 sm:py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-blue-100 mb-6 sm:mb-8 text-base sm:text-lg">
            Join thousands of driving schools already using DriveSheet to streamline their operations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/register">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Create Account
              </Button>
            </Link>
            <Link to="/login/admin">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
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