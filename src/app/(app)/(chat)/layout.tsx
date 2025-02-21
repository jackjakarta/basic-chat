import SelectLlmModel from '@/components/chat/select-llm';
import { LlmModelProvider } from '@/components/hooks/use-llm-model';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LlmModelProvider>
      <SelectLlmModel />
      {children}
    </LlmModelProvider>
  );
}
