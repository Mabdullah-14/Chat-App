import { Link } from "react-router-dom";

export default function AuthFooterLink({ text, linkText, to }) {
  return (
    <p className="mt-6 text-center text-sm text-gray-600">
      {text}{" "}
      <Link to={to} className="font-semibold text-teal-600 hover:text-teal-700">
        {linkText}
      </Link>
    </p>
  );
}