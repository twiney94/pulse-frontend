"use client"

import * as React from "react"
import { MoreHorizontal, Shield, User, UserCog, UserMinus, UserPlus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"

// Sample user data (this can be replaced with actual data fetching)
const sampleUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "user", status: "active", createdAt: "2024-01-15T10:30:00Z" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "organizer", status: "active", createdAt: "2024-02-01T14:45:00Z" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "admin", status: "active", createdAt: "2024-02-15T09:15:00Z" },
  { id: 4, name: "Diana Prince", email: "diana@example.com", role: "user", status: "inactive", createdAt: "2024-03-01T11:00:00Z" },
]

type User = {
  id: number
  name: string
  email: string
  role: "user" | "organizer" | "admin"
  status: "active" | "inactive"
  createdAt: string
}

export function UsersComponent() {
  const [users, setUsers] = React.useState<User[]>(sampleUsers)
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)

  const handleRoleChange = (userId: number, newRole: "user" | "organizer" | "admin") => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    )
    toast({
      title: "Role updated",
      description: `User role has been updated to ${newRole}.`,
    })
  }

  const handleStatusChange = (userId: number, newStatus: "active" | "inactive") => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    )
    toast({
      title: "Status updated",
      description: `User status has been set to ${newStatus}.`,
    })
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleSaveUserEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedUser) return

    const formData = new FormData(event.currentTarget)
    const updatedUser = {
      ...selectedUser,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    }

    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === updatedUser.id ? updatedUser : user
      )
    )

    setIsEditDialogOpen(false)
    toast({
      title: "User updated",
      description: "The user's information has been successfully updated.",
    })
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Users Management</CardTitle>
          <CardDescription>View and manage user accounts on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "default" : user.role === "organizer" ? "secondary" : "outline"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "destructive"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <UserCog className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, "user")}>
                          <User className="mr-2 h-4 w-4" />
                          Set as User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, "organizer")}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Set as Organizer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, "admin")}>
                          <Shield className="mr-2 h-4 w-4" />
                          Set as Admin
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleStatusChange(user.id, user.status === "active" ? "inactive" : "active")}>
                          <UserMinus className="mr-2 h-4 w-4" />
                          {user.status === "active" ? "Deactivate User" : "Activate User"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to the user's information here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveUserEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={selectedUser?.name}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  defaultValue={selectedUser?.email}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select
                  defaultValue={selectedUser?.role}
                  onValueChange={(value) => selectedUser && handleRoleChange(selectedUser.id, value as "user" | "organizer" | "admin")}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="organizer">Organizer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}