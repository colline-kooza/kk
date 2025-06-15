import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Student {
  id: string
  name: string
  email: string
  grade: string
  status: "active" | "inactive" | "graduated"
  avatar: string
  lastActivity: string
}

const students: Student[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@student.edu",
    grade: "Grade 10",
    status: "active",
    avatar: "/placeholder.svg?height=32&width=32",
    lastActivity: "2 hours ago",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@student.edu",
    grade: "Grade 11",
    status: "active",
    avatar: "/placeholder.svg?height=32&width=32",
    lastActivity: "1 day ago",
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol.davis@student.edu",
    grade: "Grade 9",
    status: "inactive",
    avatar: "/placeholder.svg?height=32&width=32",
    lastActivity: "1 week ago",
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david.wilson@student.edu",
    grade: "Grade 12",
    status: "active",
    avatar: "/placeholder.svg?height=32&width=32",
    lastActivity: "3 hours ago",
  },
  {
    id: "5",
    name: "Eva Brown",
    email: "eva.brown@student.edu",
    grade: "Grade 10",
    status: "graduated",
    avatar: "/placeholder.svg?height=32&width=32",
    lastActivity: "2 months ago",
  },
]

function getStatusBadge(status: Student["status"]) {
  const variants = {
    active: "default",
    inactive: "secondary",
    graduated: "outline",
  } as const

  return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
}

export function StudentsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Students</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                    <AvatarFallback>
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm text-muted-foreground">{student.email}</div>
                  </div>
                </TableCell>
                <TableCell>{student.grade}</TableCell>
                <TableCell>{getStatusBadge(student.status)}</TableCell>
                <TableCell className="text-muted-foreground">{student.lastActivity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
