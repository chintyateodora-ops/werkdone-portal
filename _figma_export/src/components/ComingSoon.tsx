import { Lock, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Footer } from './Footer';

export function ComingSoon() {
  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-gray-900 mb-4">Module Coming Soon</h2>
          <p className="text-gray-600 mb-8">
            This module is currently under development and will be available in the live portal. 
            For this demo phase, we're focusing on the Public Awareness and Outreach modules.
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-purple-900 mb-2">Available Demo Modules:</p>
            <ul className="text-sm text-purple-700 space-y-1">
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Prospect Management
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Referrals
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Client 360
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Configurations
              </li>
            </ul>
          </div>
          <p className="text-sm text-gray-500">
            This module will be fully functional in the production release.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}