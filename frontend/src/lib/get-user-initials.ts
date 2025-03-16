import { User } from "@/types/auth.types"

const getUserInitials = (user: User) => {
  if (!user.name) return "U"
  return user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

export default getUserInitials
