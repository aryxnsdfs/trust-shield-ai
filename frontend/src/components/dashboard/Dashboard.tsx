import React, { useState } from 'react';
import { Shield, MessageSquare, FileText, Globe, CreditCard } from 'lucide-react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Overview } from './Overview';
import { MessageAnalyzer } from './MessageAnalyzer';
import { UrlScanner } from './UrlScanner';
import { PaymentAnalyzer } from './PaymentAnalyzer';
import { DocumentForensics } from './DocumentForensics';

const navItems = [
  { icon: Shield, label: 'Overview', id: 'overview' },
  { icon: MessageSquare, label: 'Messages', id: 'messages' },
  { icon: FileText, label: 'Documents', id: 'documents' },
  { icon: Globe, label: 'URL Scanner', id: 'urls' },
  { icon: CreditCard, label: 'Payments', id: 'payments' },
];

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'messages':
        return <MessageAnalyzer />;
      case 'documents':
        return <DocumentForensics />;
      case 'urls':
        return <UrlScanner />;
      case 'payments':
        return <PaymentAnalyzer />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 gradient-glow opacity-50 pointer-events-none" />
      
      <Header />

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 pb-24 lg:pb-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <Sidebar
            items={navItems}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
          />

          {/* Main Content */}
          <section className="flex-1 min-w-0">
            {renderContent()}
          </section>
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav
        items={navItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default Dashboard;
