import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | PromptBytes',
  description: 'Privacy Policy for PromptBytes.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '24px' }} className="gradient-text">Privacy Policy</h1>
      
      <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Last updated: July 12, 2026</p>

        <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
          At PromptBytes, your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your information when you use our website.
        </p>
        
        <h2 style={{ fontSize: '20px', marginTop: '16px', color: 'var(--text-primary)' }}>1. Information We Collect</h2>
        <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
          We collect minimal information to provide our services. We track aggregate metrics such as the number of views, copies, and likes for each prompt. We do not require users to create an account to view or copy prompts, and we do not collect personally identifiable information (PII) from regular visitors.
        </p>
        
        <h2 style={{ fontSize: '20px', marginTop: '16px', color: 'var(--text-primary)' }}>2. How We Use Information</h2>
        <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
          The data we collect (like prompt copy counts and likes) is used exclusively to improve the user experience, rank prompts, and show trending content to our community.
        </p>

        <h2 style={{ fontSize: '20px', marginTop: '16px', color: 'var(--text-primary)' }}>3. Cookies and Local Storage</h2>
        <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
          We use local storage in your browser to remember your preferences, such as your choice between light and dark mode. We do not use tracking cookies for advertising purposes.
        </p>

        <h2 style={{ fontSize: '20px', marginTop: '16px', color: 'var(--text-primary)' }}>4. Third-Party Links</h2>
        <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
          Our website may contain links to third-party AI platforms (like ChatGPT or Midjourney). We are not responsible for the privacy practices or content of these external sites. We encourage you to read their privacy policies.
        </p>

        <h2 style={{ fontSize: '20px', marginTop: '16px', color: 'var(--text-primary)' }}>5. Contact Us</h2>
        <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
          If you have any questions or concerns about this Privacy Policy, please feel free to reach out to us at support@promptbytes.example.com.
        </p>
      </div>
    </div>
  );
}
