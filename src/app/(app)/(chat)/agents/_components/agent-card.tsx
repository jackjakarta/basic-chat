'use client';

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
import toast from 'react-hot-toast';

import { deleteAgentAction } from '../[agentId]/actions';

export default function AgentCard({ agent }: { agent: AgentRow }) {
  const router = useRouter();

  async function handleDeleteAgent(e: React.MouseEvent) {
    e.preventDefault();
    toast.loading('Deleting agent...');

    try {
      await deleteAgentAction({ agentId: agent.id });
      toast.remove();
      toast.success('Agent deleted');
      router.refresh();
    } catch (error) {
      console.error({ error });
      toast.remove();
      toast.error('Failed to delete agent');
    }
  }

  return (
    <Link href={`/agents/${agent.id}/c`}>
      <Card className="w-full p-4 flex items-center hover:bg-secondary/40 justify-between space-x-4 cursor-pointer">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={agent.pictureUrl ?? ''} alt={agent.name} />
            <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-medium leading-none">{agent.name}</h3>
            <p className="text-sm text-muted-foreground">{agent.instructions}</p>
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
              onClick={handleDeleteAgent}
              className="text-destructive cursor-pointer"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Card>
    </Link>
  );
}
