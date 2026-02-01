
import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col relative">
      {/* Background with slow fade-in */}
      <div 
        className="fixed top-0 left-0 w-full h-full bg-cover bg-center z-0 pointer-events-none animate-fade-in" 
        style={{backgroundImage: "url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2070&auto=format&fit=crop')", filter: 'blur(10px) brightness(0.4)'}}
      ></div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header slides down/up smoothly */}
        <div className="animate-fade-in-up">
           <Header />
        </div>
        
        {/* Main content area */}
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        
        {/* Footer fades in last */}
        <div className="animate-fade-in-up animation-delay-500">
           <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
