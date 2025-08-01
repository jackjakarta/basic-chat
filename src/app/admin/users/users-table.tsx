'use client';

import AlertModal from '@/components/common/alert-modal';
import { useToast } from '@/components/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDateToDayMonthYear } from '@/utils/date';
import { Download, Filter, MoreHorizontal, Search, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { deleteUserAction } from './actions';
import { type ExtendedUser } from './types';

export default function UsersTable({
  users,
  currentUserId,
}: {
  users: ExtendedUser[];
  currentUserId: string;
}) {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredUsers, setFilteredUsers] = React.useState<ExtendedUser[]>(users);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const { toastSuccess, toastError, toastLoading } = useToast();

  async function handleDeleteUser(userId: string) {
    toastLoading('Deleting user...');

    try {
      await deleteUserAction({ userId });
      toastSuccess('User deleted successfully');
      setFilteredUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      toastError('Failed to delete user');
    }
  }

  function handleSearch(value: string) {
    setSearchTerm(value);

    const filtered = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(value.toLowerCase()) ||
        user.lastName.toLowerCase().includes(value.toLowerCase()) ||
        user.email.toLowerCase().includes(value.toLowerCase()),
    );

    setFilteredUsers(filtered);
  }

  function getStatusBadge(status: boolean) {
    switch (status) {
      case true:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case false:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  }

  return (
    <>
      <div className="space-y-4">
        <Card className="bg-sidebar-border/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  Manage your team members and their account permissions here.
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center space-x-2">
              <div className="relative max-w-sm flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Tokens Used/This Month</TableHead>
                    <TableHead>Created at</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatarUrl} alt={user.firstName} />
                            <AvatarFallback>
                              {user.firstName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.firstName}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.emailVerified)}</TableCell>
                      <TableCell>{user.subscription.toUpperCase()}</TableCell>
                      <TableCell>
                        {user.tokensUsed}/{user.limits.tokenLimit}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDateToDayMonthYear(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault();
                                router.push(`/admin/users/${user.id}`);
                              }}
                              className="cursor-pointer"
                            >
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              Reset password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault();
                                setIsDialogOpen(true);
                              }}
                              className="cursor-pointer text-red-600 disabled:cursor-not-allowed"
                              disabled={user.id === currentUserId}
                            >
                              Delete user
                            </DropdownMenuItem>
                            <AlertModal
                              title="Are you sure ?"
                              description="Are you sure you want to delete this user ?"
                              type="destructive"
                              isOpen={isDialogOpen}
                              onOpenChange={setIsDialogOpen}
                              onConfirm={async () => await handleDeleteUser(user.id)}
                            />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredUsers.length} of {users.length} users
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
