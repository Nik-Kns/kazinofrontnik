import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'AIGAMING.BOT - AI-CRM iGaming Platform',
  description: 'Пилотный проект по внедрению AI-CRM платформы для iGaming',
};

export default function PilotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
