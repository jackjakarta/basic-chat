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
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
        <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
      </SelectContent>
    </Select>
  );
}
