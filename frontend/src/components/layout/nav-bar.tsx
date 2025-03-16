// Libraries and Hooks
import { useState } from "react"

import { Link, useNavigate } from "react-router-dom"
import useAuth from "@/hooks/useAuth"

// Components and Icons
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { LogOut, User } from "lucide-react"
// import { DarkModeToggle } from "../dark-mode/dark-toggle"

interface NavLinkType {
  name: string
  to: string
}

const navlinks: NavLinkType[] = [
  {
    name: "Dashboard",
    to: "/dashboard",
  },
  // {
  // 	name: "Explore",
  // 	to: "explore",
  // },
]

const NavLink = ({ name, to }: NavLinkType) => {
  return (
    <>
      <NavigationMenuItem>
        <NavigationMenuLink
          className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-figma_secondary`}
          asChild
        >
          <Link className="flex items-center justify-center" to={to}>
            <p className="text-article text-white">{name}</p>
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </>
  )
}

const Profile = () => {
  const { session, signOut, user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  if (!session) return <NavLink name="Login" to={"/login"} />

  const getInitials = () => {
    if (!user.name) return "U"
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const handleProfileClick = () => {
    setOpen(false)
    navigate("/profile")
  }

  const handleLogout = async () => {
    setOpen(false)
    await signOut()
    navigate("/")
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage
              src={user.image || "/placeholder.svg?height=40&width=40"}
              alt="Profile"
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none">
            {user.name || "User"}
          </p>
          <p className="text-xs leading-none text-muted-foreground">
            {user.email || "user@example.com"}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-2"
          onClick={handleProfileClick}
        >
          <User className="h-4 w-4" />
          <span>My Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const Navbar = () => {
  const { session } = useAuth()

  return (
    <nav className="bg-figma_dark h-[72px] w-full">
      <div className="flex h-full items-center justify-between w-full py-2 max-w-screen-2xl mx-auto px-[60px]">
        <Link to="/" className="flex h-full items-center justify-center">
          <p className="font-poppins text-2xl font-bold leading-6 tracking-[0.15px] text-white">
            Taikai
          </p>
        </Link>
        <NavigationMenu>
          <NavigationMenuList className="flex gap-12">
            {session
              ? navlinks.map((link) => (
                  <NavLink key={link.name} name={link.name} to={link.to} />
                ))
              : null}
            {/* <DarkModeToggle /> */}
            <Profile />
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  )
}

export default Navbar
