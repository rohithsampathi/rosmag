'use client';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  href?: string;
  className?: string;
}

export function BackButton({ href, className = '' }: BackButtonProps) {
  const router = useRouter();
  
  const handleBack = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Back</span>
    </button>
  );
}