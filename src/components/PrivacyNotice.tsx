import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Info } from 'lucide-react';

interface PrivacyNoticeProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-slate-900 rounded-lg shadow-xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold">Privacy Notice</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <p className="mb-3">
                    <strong>Color Mixer</strong> uses local storage to save your work and preferences
                    directly in your browser. This ensures your palettes and settings persist between sessions.
                  </p>

                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">What We Store:</h4>
                  <ul className="list-disc list-inside space-y-1 mb-3">
                    <li>Your favorite color palettes</li>
                    <li>Recent palette history</li>
                    <li>Application preferences</li>
                    <li>User interface settings</li>
                  </ul>

                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Your Privacy:</h4>
                  <ul className="list-disc list-inside space-y-1 mb-3">
                    <li>All data stays on your device</li>
                    <li>Nothing is sent to external servers</li>
                    <li>You can clear data anytime via browser settings</li>
                    <li>No personal information is collected</li>
                  </ul>

                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    By using Color Mixer, you consent to local storage usage for functionality.
                    You can manage or clear stored data through your browser's privacy settings.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end p-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PrivacyNotice;
