import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type FolderRow } from '@/db/schema';
import { formatDateToDayMonthYear } from '@/utils/date';
import { Folder, MoreVertical } from 'lucide-react';

type FolderCardProps = {
  folder: FolderRow;
};

export function FolderCard({ folder }: FolderCardProps) {
  return (
    <Card className="group cursor-pointer transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <Folder className="h-8 w-8 text-primary" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Open</DropdownMenuItem>
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-1">
          <h3 className="truncate text-sm font-medium text-foreground">{folder.name}</h3>
          <p className="text-xs text-muted-foreground">{4} items</p>
          <p className="text-xs text-muted-foreground">
            {formatDateToDayMonthYear(folder.updatedAt)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
