import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import useAuth from "@/hooks/useAuth"
import getUserInitials from "@/lib/get-user-initials"
import { Mail, UserIcon } from "lucide-react"

const ProfilePage = () => {
  const { user } = useAuth()

  if (!user) console.error("There is no user!")

  // Takes an ISO string and converts to Month Year
  const formatDate = (isoDate: string | undefined) => {
    if (!isoDate) return "Date not available"

    const date = new Date(isoDate)

    const month = date.toLocaleString("default", { month: "long" })
    const year = date.getFullYear()

    return `${month} ${year}`
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>

          <Card className="mb-8">
            <CardHeader className="pb-4">
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your personal information and account details
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="py-6">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="h-32 w-32 border-2 border-border">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                      {getUserInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </p>
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <p className="text-lg font-medium">{user.name}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Email Address
                    </p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-lg">{user.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Role
                      </p>
                      <p>{user.role}</p>
                    </div> */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Member Since
                      </p>
                      <p>{formatDate(user.joined_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage
