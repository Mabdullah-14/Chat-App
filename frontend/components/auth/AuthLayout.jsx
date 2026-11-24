export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left: Form */}
      <div className="flex w-full items-center justify-center px-6 py-10 lg:w-1/2">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-2 text-gray-500">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>

      <div className="hidden items-center justify-center bg-slate-50 lg:flex lg:w-1/2">
        <img
          src="/chat-illustration.jpg"
          alt="Chat illustration"
          className="max-w-[85%] mix-blend-multiply"
        />
      </div>
    </div>
  );
}