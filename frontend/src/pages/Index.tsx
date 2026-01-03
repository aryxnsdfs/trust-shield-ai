import { Dashboard } from "@/components/dashboard";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>TrustShield AI - Enterprise Security Platform</title>
        <meta 
          name="description" 
          content="AI-powered security platform for fraud detection, document forensics, and threat analysis. Protect your organization with enterprise-grade security." 
        />
      </Helmet>
      <Dashboard />
    </>
  );
};

export default Index;
