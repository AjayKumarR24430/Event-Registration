import React, { useState } from 'react';
import { FaShieldAlt, FaCookieBite, FaGavel, FaGlobeEurope } from 'react-icons/fa';

const LegalPage = () => {
  const [activeTab, setActiveTab] = useState('terms');
  
  const tabs = [
    { id: 'terms', label: 'Terms of Service', icon: FaGavel },
    { id: 'privacy', label: 'Privacy Policy', icon: FaShieldAlt },
    { id: 'cookies', label: 'Cookie Policy', icon: FaCookieBite },
    { id: 'gdpr', label: 'GDPR Compliance', icon: FaGlobeEurope },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-br from-indigo-800 via-purple-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-pattern-grid opacity-10"></div>
        
        {/* Animated Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply opacity-20 animate-blob"></div>
          <div className="absolute top-0 -left-20 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-10 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Bottom Wave - Now positioned higher to cover content */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none" style={{ zIndex: "-1" }}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 320" 
            className="w-full absolute bottom-0"
            preserveAspectRatio="none"
          >
            <path 
              fill="#ffffff" 
              fillOpacity="0.3" 
              d="M0,192L60,202.7C120,213,240,235,360,229.3C480,224,600,192,720,192C840,192,960,224,1080,213.3C1200,203,1320,149,1380,122.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
        
        <div className="container-custom relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium text-white mb-6">
              Important Information
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
              Legal Information
            </h1>
            
            <p className="text-xl text-indigo-100 animate-slideUp max-w-2xl mx-auto">
              Our commitment to transparency and data protection
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="py-12 bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fadeIn">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'animate-scaleIn' : ''}`} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
          
          {/* Content */}
          <div className="max-w-4xl mx-auto animate-fadeIn">
            {activeTab === 'terms' && (
              <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-indigo-600 dark:prose-headings:text-indigo-400">
                <h2>Terms of Service</h2>
                <p className="lead">Last updated: December 1, 2023</p>
                
                <h3>1. Acceptance of Terms</h3>
                <p>
                  By accessing or using our event registration platform ("Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
                </p>
                
                <h3>2. Description of Service</h3>
                <p>
                  Our platform provides event organizers with tools to create, manage, and promote events, and allows attendees to discover, register for, and attend these events. We may update, change, or enhance any aspect of the Service at any time.
                </p>
                
                <h3>3. User Accounts</h3>
                <p>
                  You are responsible for safeguarding the password used to access the Service and for any activities or actions under your password. We encourage you to use "strong" passwords (passwords that use a combination of upper and lower case letters, numbers, and symbols) with your account.
                </p>
                
                <h3>4. Intellectual Property</h3>
                <p>
                  The Service and its original content, features, and functionality are owned by our company and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                </p>
                
                <h3>5. User-Generated Content</h3>
                <p>
                  You may provide text, images, and other content for publication on the platform in connection with your events ("User Content"). You retain all rights in, and are solely responsible for, the User Content you post to the Service.
                </p>
                
                <h3>6. Prohibited Activities</h3>
                <p>
                  You agree not to engage in any of the following prohibited activities:
                </p>
                <ul>
                  <li>Using the Service for any illegal purpose or in violation of any local, state, national, or international law</li>
                  <li>Harassing, threatening, or intimidating other users</li>
                  <li>Posting or transmitting viruses, malware, or other types of malicious code</li>
                  <li>Interfering with or disrupting the Service or servers</li>
                  <li>Creating events that are misleading, fraudulent, or violate our community guidelines</li>
                </ul>
                
                <h3>7. Limitation of Liability</h3>
                <p>
                  In no event shall we, our directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                </p>
                
                <h3>8. Termination</h3>
                <p>
                  We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                </p>
                
                <h3>9. Changes to Terms</h3>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. It is your responsibility to check the Terms periodically for changes. Your continued use of the Service following the posting of any changes to the Terms constitutes acceptance of those changes.
                </p>
                
                <h3>10. Contact Us</h3>
                <p>
                  If you have any questions about these Terms, please contact us at legal@eventplatform.com.
                </p>
              </div>
            )}
            
            {activeTab === 'privacy' && (
              <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-indigo-600 dark:prose-headings:text-indigo-400">
                <h2>Privacy Policy</h2>
                <p className="lead">Last updated: December 1, 2023</p>
                
                <h3>1. Information We Collect</h3>
                <p>
                  We collect several different types of information for various purposes to provide and improve our Service to you:
                </p>
                <ul>
                  <li><strong>Personal Data:</strong> Name, email address, phone number, billing information when you register for an account or event.</li>
                  <li><strong>Usage Data:</strong> Information on how you access and use our Service, including your IP address, browser type, pages visited, and time spent.</li>
                  <li><strong>Cookies and Similar Technologies:</strong> We use cookies and similar tracking technologies to track activity on our Service and hold certain information.</li>
                </ul>
                
                <h3>2. How We Use Your Information</h3>
                <p>
                  We use the collected data for various purposes:
                </p>
                <ul>
                  <li>To provide and maintain our Service</li>
                  <li>To notify you about changes to our Service</li>
                  <li>To provide customer support</li>
                  <li>To gather analysis or valuable information so that we can improve our Service</li>
                  <li>To monitor the usage of our Service</li>
                  <li>To detect, prevent and address technical issues</li>
                  <li>To process transactions and send related information</li>
                </ul>
                
                <h3>3. Data Sharing and Disclosure</h3>
                <p>
                  We may disclose your Personal Data in the following situations:
                </p>
                <ul>
                  <li><strong>With Event Organizers:</strong> If you register for an event, we share your registration information with the event organizer.</li>
                  <li><strong>Service Providers:</strong> We may employ third-party companies to facilitate our Service, provide the Service on our behalf, or assist us in analyzing how our Service is used.</li>
                  <li><strong>Legal Requirements:</strong> We may disclose your Personal Data in the good faith belief that such action is necessary to comply with a legal obligation.</li>
                  <li><strong>Business Transfers:</strong> In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition.</li>
                </ul>
                
                <h3>4. Data Security</h3>
                <p>
                  The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                </p>
                
                <h3>5. Your Data Protection Rights</h3>
                <p>
                  You have certain data protection rights, including:
                </p>
                <ul>
                  <li>The right to access, update or delete your personal information</li>
                  <li>The right of rectification if your information is inaccurate or incomplete</li>
                  <li>The right to object to our processing of your personal data</li>
                  <li>The right to request restriction of processing of your personal data</li>
                  <li>The right to data portability</li>
                  <li>The right to withdraw consent</li>
                </ul>
                
                <h3>6. Children's Privacy</h3>
                <p>
                  Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us.
                </p>
                
                <h3>7. Changes to This Privacy Policy</h3>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "last updated" date.
                </p>
                
                <h3>8. Contact Us</h3>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at privacy@eventplatform.com.
                </p>
              </div>
            )}
            
            {activeTab === 'cookies' && (
              <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-indigo-600 dark:prose-headings:text-indigo-400">
                <h2>Cookie Policy</h2>
                <p className="lead">Last updated: December 1, 2023</p>
                
                <h3>1. What Are Cookies</h3>
                <p>
                  Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
                </p>
                
                <h3>2. How We Use Cookies</h3>
                <p>
                  We use cookies for the following purposes:
                </p>
                <ul>
                  <li><strong>Essential cookies:</strong> These are cookies that are required for the operation of our website, such as cookies that enable you to log into secure areas.</li>
                  <li><strong>Analytical/performance cookies:</strong> They allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it. This helps us to improve the way our website works.</li>
                  <li><strong>Functionality cookies:</strong> These are used to recognize you when you return to our website. This enables us to personalize our content for you and remember your preferences.</li>
                  <li><strong>Targeting cookies:</strong> These cookies record your visit to our website, the pages you have visited and the links you have followed. We will use this information to make our website and the advertising displayed on it more relevant to your interests.</li>
                </ul>
                
                <h3>3. Third-Party Cookies</h3>
                <p>
                  In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on. These may include:
                </p>
                <ul>
                  <li>Google Analytics</li>
                  <li>Facebook Pixel</li>
                  <li>Stripe</li>
                  <li>Other analytics and social media services</li>
                </ul>
                
                <h3>4. What Are Your Choices Regarding Cookies</h3>
                <p>
                  If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.
                </p>
                <p>
                  Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.
                </p>
                
                <h3>5. Where Can You Find More Information About Cookies</h3>
                <p>
                  You can learn more about cookies and the following third-party websites:
                </p>
                <ul>
                  <li>AllAboutCookies: <a href="http://www.allaboutcookies.org/">http://www.allaboutcookies.org/</a></li>
                  <li>Network Advertising Initiative: <a href="http://www.networkadvertising.org/">http://www.networkadvertising.org/</a></li>
                </ul>
                
                <h3>6. Updates to This Cookie Policy</h3>
                <p>
                  We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "last updated" date.
                </p>
              </div>
            )}
            
            {activeTab === 'gdpr' && (
              <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-indigo-600 dark:prose-headings:text-indigo-400">
                <h2>GDPR Compliance</h2>
                <p className="lead">Last updated: December 1, 2023</p>
                
                <h3>1. Introduction</h3>
                <p>
                  This GDPR Compliance statement explains how our event registration platform ("Service") complies with the European Union's General Data Protection Regulation (GDPR). We are committed to protecting the personal data of our users and ensuring that our data processing activities are lawful, fair, and transparent.
                </p>
                
                <h3>2. Data Controller</h3>
                <p>
                  For the purposes of the GDPR, our company acts as a data controller for the personal data we collect from you. This means we determine the purposes and means of processing your personal data.
                </p>
                
                <h3>3. Legal Basis for Processing</h3>
                <p>
                  We process personal data on the following legal bases:
                </p>
                <ul>
                  <li><strong>Consent:</strong> When you have given explicit consent to the processing of your personal data for specific purposes.</li>
                  <li><strong>Contractual Necessity:</strong> When processing is necessary for the performance of a contract with you (e.g., to provide the Service you have signed up for).</li>
                  <li><strong>Legal Obligation:</strong> When processing is necessary to comply with a legal obligation to which we are subject.</li>
                  <li><strong>Legitimate Interests:</strong> When processing is necessary for the purposes of the legitimate interests pursued by us or a third party, except where such interests are overridden by your interests or fundamental rights and freedoms.</li>
                </ul>
                
                <h3>4. Your Rights Under GDPR</h3>
                <p>
                  The GDPR provides you with the following rights regarding your personal data:
                </p>
                <ul>
                  <li><strong>Right to Information:</strong> You have the right to be informed about how we collect and use your personal data.</li>
                  <li><strong>Right of Access:</strong> You have the right to request a copy of the personal data we hold about you.</li>
                  <li><strong>Right to Rectification:</strong> You have the right to have inaccurate personal data rectified, or completed if it is incomplete.</li>
                  <li><strong>Right to Erasure (Right to be Forgotten):</strong> You have the right to request the deletion of your personal data in certain circumstances.</li>
                  <li><strong>Right to Restrict Processing:</strong> You have the right to request the restriction or suppression of your personal data in certain circumstances.</li>
                  <li><strong>Right to Data Portability:</strong> You have the right to obtain and reuse your personal data for your own purposes across different services.</li>
                  <li><strong>Right to Object:</strong> You have the right to object to the processing of your personal data in certain circumstances, including processing for direct marketing purposes.</li>
                  <li><strong>Rights related to Automated Decision Making and Profiling:</strong> You have the right not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects concerning you or similarly significantly affects you.</li>
                </ul>
                
                <h3>5. How to Exercise Your Rights</h3>
                <p>
                  You can exercise your rights by contacting our Data Protection Officer at dpo@eventplatform.com. We will respond to your request within one month. This period may be extended by two further months if necessary, taking into account the complexity and number of requests.
                </p>
                
                <h3>6. Data Transfers Outside the EEA</h3>
                <p>
                  We may transfer your personal data to countries outside the European Economic Area (EEA). When we do, we ensure that similar protection is afforded to your data by implementing at least one of the following safeguards:
                </p>
                <ul>
                  <li>We will only transfer your personal data to countries that have been deemed to provide an adequate level of protection for personal data by the European Commission.</li>
                  <li>We may use specific contracts approved by the European Commission which give personal data the same protection it has in Europe.</li>
                  <li>Where we use providers based in the US, we may transfer data to them if they are part of the Privacy Shield which requires them to provide similar protection to personal data shared between Europe and the US.</li>
                </ul>
                
                <h3>7. Data Protection Impact Assessments</h3>
                <p>
                  We conduct Data Protection Impact Assessments (DPIAs) when introducing new technologies or processing activities that are likely to result in a high risk to your rights and freedoms. DPIAs help us identify and minimize data protection risks.
                </p>
                
                <h3>8. Data Breach Notification</h3>
                <p>
                  In the event of a personal data breach, we will notify the relevant supervisory authority within 72 hours of becoming aware of the breach, where feasible. If the breach is likely to result in a high risk to your rights and freedoms, we will also notify you without undue delay.
                </p>
                
                <h3>9. Data Protection Officer</h3>
                <p>
                  We have appointed a Data Protection Officer (DPO) who is responsible for overseeing questions in relation to this privacy notice. If you have any questions about this privacy notice, including any requests to exercise your legal rights, please contact our DPO at dpo@eventplatform.com.
                </p>
                
                <h3>10. Complaints</h3>
                <p>
                  You have the right to make a complaint at any time to the relevant supervisory authority for data protection issues in your jurisdiction. We would, however, appreciate the chance to deal with your concerns before you approach the supervisory authority, so please contact us in the first instance.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-16 mt-12 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Have Questions About Our <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Legal Policies?</span>
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Our legal team is available to help clarify any concerns regarding our terms, privacy practices, or compliance efforts.
            </p>
            <button className="btn btn-primary">
              Contact Our Legal Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage; 