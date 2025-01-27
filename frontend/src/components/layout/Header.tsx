import React from 'react';
import { Disclosure } from '@headlessui/react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';

const navigation = [
  { name: 'Products', href: '/' },
  { name: 'Add Product', href: '/add-product' },
];

export const Header = () => {
  const location = useLocation();

  return (
    <Disclosure as="nav" className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-900 shadow-lg transition-colors duration-300">
      {() => (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-start">
              <div className="flex flex-shrink-0 items-center">
                <Link to="/" className="text-white font-bold text-xl tracking-wide">
                  Product Management
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        location.pathname === item.href
                          ? 'bg-white/20 text-white'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      } px-3 py-2 rounded-md text-sm font-medium transition-all duration-200`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </Disclosure>
  );
};

export default Header; 