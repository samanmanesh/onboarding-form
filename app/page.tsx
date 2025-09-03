import { OnboardingForm } from "@/components/OnboardingForm";

export default function Home() {
  return (
    <div className="font-sans grid items-center justify-items-center min-h-screen p-8  gap-16 sm:p-20 bg-gray-50">
      <OnboardingForm />
      <footer className="text-center text-sm text-gray-500 absolute bottom-5  ">
        <p>Developed by Sam Sobhan</p>
      </footer>
    </div>
  );
}
