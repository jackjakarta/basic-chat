'use client';

import { useToast } from '@/components/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type AIModelRow } from '@/db/schema';
import React from 'react';

import { updateModelEnabledAction } from '../models/actions';

type ModelsTableProps = {
  models: AIModelRow[];
};

export default function ModelsTable({ models: initialModels }: ModelsTableProps) {
  const [models, setModels] = React.useState<AIModelRow[]>(initialModels);
  const { toastSuccess, toastError } = useToast();

  async function handleToggle(modelId: string, isEnabled: boolean) {
    setModels((prev) =>
      prev.map((model) => (model.id === modelId ? { ...model, isEnabled } : model)),
    );

    try {
      await updateModelEnabledAction({ modelId, isEnabled });
      toastSuccess('Model status updated successfully');
    } catch {
      setModels((prev) =>
        prev.map((model) => (model.id === modelId ? { ...model, isEnabled: !isEnabled } : model)),
      );
      toastError('Failed to update model status');
    }
  }

  return (
    <>
      <div className="border rounded-lg p-4 bg-sidebar-border/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Model ID</TableHead>
              <TableHead>Model Name</TableHead>
              <TableHead className="text-center w-[120px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((model) => (
              <TableRow key={model.id}>
                <TableCell className="font-mono text-sm">{model.id}</TableCell>
                <TableCell className="font-medium">{model.name}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    <Switch
                      checked={model.isEnabled}
                      onCheckedChange={(checked) => handleToggle(model.id, checked)}
                      aria-label={`Toggle ${model.name}`}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        <p>Total models: {models.length}</p>
        <p>Enabled: {models.filter((m) => m.isEnabled).length}</p>
        <p>Disabled: {models.filter((m) => !m.isEnabled).length}</p>
      </div>
    </>
  );
}
