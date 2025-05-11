'use client';

import AlertDialog from '@/components/common/alert-modal';
import { useToast } from '@/components/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type AgentRow } from '@/db/schema';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

import { deleteAgentAction } from '../[agentId]/actions';

export default function AgentCard({ agent }: { agent: AgentRow }) {
  const router = useRouter();
  const { toastSuccess, toastError, toastLoading } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  async function handleDeleteAgent(e: React.MouseEvent) {
    e.preventDefault();
    toastLoading('Deleting agent');

    try {
      await deleteAgentAction({ agentId: agent.id, vectorStoreId: agent.vectorStoreId });
      setIsDeleteModalOpen(false);
      toastSuccess('Agent deleted');
      router.refresh();
    } catch (error) {
      console.error({ error });
      toastError('Failed to delete agent');
    }
  }

  return (
    <>
      <Link href={`/agents/${agent.id}/c`}>
        <Card className="w-full p-4 flex border-none shadow-none items-center dark:bg-secondary/40 hover:bg-sidebar/50 dark:hover:bg-secondary/20 justify-between space-x-4 cursor-pointer">
          <div className="flex items-center space-x-4 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarImage src={agent.pictureUrl ?? undefined} alt={agent.name} />
              <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 space-y-1">
              <h3 className="font-medium leading-none">{agent.name}</h3>
              <p className="text-sm text-muted-foreground truncate max-w-[180px] sm:max-w-[110px] lg:max-w-[270px]">
                {agent.instructions}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-auto">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/agents/${agent.id}`}>
                <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  setIsDeleteModalOpen(true);
                }}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Card>
      </Link>

      <AlertDialog
        isOpen={isDeleteModalOpen}
        onOpenChange={() => {
          setIsDeleteModalOpen((prev) => !prev);
        }}
        title="Delete Agent"
        description={`Are you sure you want to delete the agent "${agent.name}"?`}
        onConfirm={handleDeleteAgent}
        type="destructive"
      />
    </>
  );
}
