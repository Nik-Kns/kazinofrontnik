import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AIGAMING.BOT - Demo',
  description: 'AI-Powered CRM for Online Casino Retention',
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
