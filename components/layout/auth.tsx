import AuthIcon from "@/components/icons/auth";

interface AuthLayoutProps {
  children: React.ReactNode;
}
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <div className="flex min-h-svh items-center justify-center px-4 md:px-6">
        <div className="w-full max-w-6xl grid lg:grid-cols-2  items-center">
          <div className="hidden lg:flex justify-center items-center">
            <div className="w-full">
              <AuthIcon className="w-full h-auto" />
            </div>
          </div>
          <div className="max-w-sm w-full mx-auto">{children}</div>
        </div>
      </div>
    </>
  );
}
