import React from "react";
import "./SharedStyles.css";

export default function PrivacyPolicy() {
  return (
    <div className="static-page">
      <h1>Privacy Policy</h1>
      <p>
        We value your privacy. LegitiMate collects only the data necessary to provide a secure
        and personalized experience. We do not sell your data to third parties.
      </p>
      <p>
        Information such as name, email, and preferences are stored securely.
        We use this information only to improve your experience and ensure platform safety.
      </p>
      <p>
        By using our platform, you agree to our data practices. For questions, contact
        <a href="mailto:privacy@legitimate.app"> privacy@legitimate.app</a>.
      </p>
    </div>
  );
}
