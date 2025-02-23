'use client';

import { type AIModel } from '@/app/api/chat/models';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useLlmModel } from '../hooks/use-llm-model';

export default function SelectLlmModel() {
  const { model, setModel } = useLlmModel();

  return (
    <Select value={model} onValueChange={(value) => setModel(value as AIModel)}>
      <SelectTrigger className="mt-2 w-auto h-[32px] border-none shadow-none focus:ring-0 focus:ring-transparent">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="gpt-4o" className="me-4">
          <span className="me-2">GPT-4o</span>
        </SelectItem>
        <SelectItem value="gpt-4o-mini">
          <span className="me-2">GPT-4o Mini</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
