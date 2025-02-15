'use client';

import { useSearchParams } from 'next/navigation';
import SecureForm from '@/components/SecureForm';

export default function FormPage() {
  const searchParams = useSearchParams();
  const publicKey = searchParams.get('publicKey');

  if (!publicKey) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 text-red-800 p-4 rounded-md max-w-md text-center">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>
            This form requires a public key for encryption.
            Please contact your organization administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <SecureForm publicKey={publicKey} />
    </div>
  );
}
