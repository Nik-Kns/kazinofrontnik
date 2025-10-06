import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'AIGAMING.BOT - AI-CRM iGaming Platform',
  description: 'Пилотный проект по внедрению AI-CRM платформы для iGaming',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function PilotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
