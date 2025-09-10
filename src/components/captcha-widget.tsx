import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface CaptchaWidgetProps {
  onVerify: (token: string | null) => void;
}

export default function CaptchaWidget({ onVerify }: CaptchaWidgetProps) {
  const [verified, setVerified] = useState(false);

  const handleChange = (token: string | null) => {
    setVerified(!!token);
    onVerify(token);
  };

  return (
    <div className="my-4">
      <ReCAPTCHA
        sitekey="6LcIvsMrAAAAAEIVXQUY_aGYg0OMVA6RgF-rZaCt"
        onChange={handleChange}
      />
      {verified ? (
        <p className="text-green-600 text-sm mt-2">✅ Verified</p>
      ) : (
        <p className="text-red-600 text-sm mt-2">❌ Please verify</p>
      )}
    </div>
  );
}
