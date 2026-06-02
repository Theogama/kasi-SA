import { Link } from "react-router-dom";
import InfoPageLayout from "@/components/InfoPageLayout";

const PrivacyPolicy = () => {
  const lastUpdated = "2 June 2025";

  return (
    <InfoPageLayout
      eyebrow="Legal"
      title="Privacy Policy"
      description="How Kasi SA Streetwear collects, uses, and protects your personal information in line with South African law."
    >
      <p className="text-sm text-muted-foreground mb-10">Last updated: {lastUpdated}</p>

      <div className="space-y-10 text-muted-foreground leading-relaxed">
        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">1. Who we are</h2>
          <p>
            Kasi SA Streetwear (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates this online store at
            kasisastreet.co.za (and related domains). For privacy enquiries, contact{" "}
            <a href="mailto:hello@kasisastreet.co.za" className="text-foreground underline hover:no-underline">
              hello@kasisastreet.co.za
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">2. Information we collect</h2>
          <p className="mb-3">We may collect:</p>
          <ul className="space-y-3 ml-1">
            <li className="flex gap-3">
              <span className="text-foreground">•</span>
              <span>
                <strong className="text-foreground">Account &amp; identity:</strong> name, email, phone number
                when you sign in or check out
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground">•</span>
              <span>
                <strong className="text-foreground">Order &amp; delivery:</strong> shipping address, pickup
                location, order history, and payment references (payments are processed by Payfast—we do not
                store full card numbers)
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground">•</span>
              <span>
                <strong className="text-foreground">Communications:</strong> messages you send via our contact
                form or email
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground">•</span>
              <span>
                <strong className="text-foreground">Technical data:</strong> IP address, browser type, device
                information, and cookies used for site functionality and analytics
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">3. How we use your information</h2>
          <p className="mb-3">We use personal information to:</p>
          <ul className="space-y-3 ml-1">
            <li className="flex gap-3">
              <span className="text-foreground">•</span>
              <span>Process and fulfil orders, including courier and collection arrangements</span>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground">•</span>
              <span>Communicate order updates, delivery PINs (via carriers), and customer support</span>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground">•</span>
              <span>Improve our website, products, and services</span>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground">•</span>
              <span>Send marketing communications only where you have opted in (you may unsubscribe at any time)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground">•</span>
              <span>Comply with legal and tax obligations</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">4. Legal basis (POPIA)</h2>
          <p>
            We process personal information in accordance with the Protection of Personal Information Act, 2013
            (POPIA). Processing is based on your consent, performance of a contract (your order), legitimate
            interests (fraud prevention, site security), or legal obligation where applicable.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">5. Sharing with third parties</h2>
          <p className="mb-3">We share data only as needed to operate our store, including with:</p>
          <ul className="space-y-3 ml-1">
            <li className="flex gap-3">
              <span className="text-foreground">•</span>
              <span>Payment processors (e.g. Payfast)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground">•</span>
              <span>Shipping partners (The Courier Guy, PAXI, Pargo)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground">•</span>
              <span>Hosting and database providers (e.g. Supabase)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground">•</span>
              <span>Authentication services used for account sign-in</span>
            </li>
          </ul>
          <p className="mt-4">We do not sell your personal information to third parties.</p>
        </div>

        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">6. Data retention</h2>
          <p>
            We retain order and account records for as long as needed to fulfil orders, handle returns, meet
            accounting requirements, and resolve disputes. Marketing data is kept until you unsubscribe or
            request deletion.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">7. Security</h2>
          <p>
            We use industry-standard measures including HTTPS, access controls, and secure payment gateways.
            No method of transmission over the internet is 100% secure; we encourage strong passwords and
            protecting your account credentials.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">8. Your rights</h2>
          <p className="mb-3">Under POPIA you may:</p>
          <ul className="space-y-3 ml-1">
            <li className="flex gap-3">
              <span className="text-foreground">•</span>
              <span>Request access to personal information we hold about you</span>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground">•</span>
              <span>Ask us to correct inaccurate data</span>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground">•</span>
              <span>Request deletion where we are not legally required to retain records</span>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground">•</span>
              <span>Object to direct marketing</span>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground">•</span>
              <span>Lodge a complaint with the Information Regulator (South Africa)</span>
            </li>
          </ul>
          <p className="mt-4">
            To exercise these rights, email{" "}
            <a href="mailto:hello@kasisastreet.co.za" className="text-foreground underline hover:no-underline">
              hello@kasisastreet.co.za
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">9. Cookies</h2>
          <p>
            We use essential cookies for cart and session functionality. Optional analytics cookies, if used,
            help us understand how visitors use the site. You can control cookies through your browser settings.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">10. Children</h2>
          <p>
            Our store is not directed at children under 18. We do not knowingly collect personal information from
            minors without parental consent.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">11. Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The &quot;Last updated&quot; date at the top will
            change when we do. Continued use of the site after changes constitutes acceptance of the updated
            policy.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-heading text-foreground mb-4">12. Contact</h2>
          <p>
            Questions about privacy? Email{" "}
            <a href="mailto:hello@kasisastreet.co.za" className="text-foreground underline hover:no-underline">
              hello@kasisastreet.co.za
            </a>{" "}
            or use our{" "}
            <Link to="/contact" className="text-foreground underline hover:no-underline">
              contact page
            </Link>
            .
          </p>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default PrivacyPolicy;
