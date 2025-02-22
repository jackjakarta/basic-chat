import SelectLlmModel from '@/components/chat/select-llm';
import { LlmModelProvider } from '@/components/hooks/use-llm-model';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LlmModelProvider>
      <div className="flex items-center gap-2">
        <SidebarTrigger className="ml-2" />
        <SelectLlmModel />
      </div>
      {children}
    </LlmModelProvider>
  );
}
