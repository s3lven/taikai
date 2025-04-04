// Libraries and Hooks
import { useState } from "react"

import { Link, useNavigate } from "react-router-dom"
import useAuth from "@/hooks/useAuth"
import getUserInitials from "@/lib/get-user-initials"

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
import { LogOut, Menu, User, X } from "lucide-react"
import { Dialog, DialogTrigger } from "../ui/dialog"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import { Separator } from "../ui/separator"

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
              {getUserInitials(user)}
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
  const { session, signOut, user } = useAuth()
  const [navbarOpen, setNavbarOpen] = useState(false)

  const handleLogout = () => {
    setNavbarOpen(false)
    signOut()
  }

  return (
    <nav className="bg-figma_dark h-[60px] w-full">
      <div className="flex h-full items-center justify-between container mx-auto px-4">
        <Link to="/" className="flex h-full items-center justify-center">
          <p className="font-poppins text-2xl font-bold leading-6 tracking-[0.15px] text-white">
            Taikai
          </p>
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="space-x-12 hidden sm:flex">
            {session &&
              navlinks.map((link) => (
                <NavLink key={link.name} name={link.name} to={link.to} />
              ))}

            <Profile />
          </NavigationMenuList>

          <Dialog open={navbarOpen} onOpenChange={setNavbarOpen}>
            <DialogTrigger className="bg-transparent hover:bg-figma_secondary text-white sm:hidden">
              <Menu />
            </DialogTrigger>
            <DialogPrimitive.DialogPortal>
              <DialogPrimitive.Overlay
                className={cn(
                  "fixed inset-0 z-50 bg-figma_shade2/90 backdrop-blur data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
                )}
              />
              <DialogPrimitive.Content
                className={cn(
                  "space-y-6 fixed top-4 right-4 z-50 grid w-full max-w-xs gap-4 bg-[#2b1895] px-4 py-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%] rounded-lg"
                )}
                aria-describedby={undefined}
              >
                <div className="flex h-full items-center justify-between px-1">
                  <DialogPrimitive.DialogTitle className="font-poppins text-2xl font-bold leading-6 tracking-[0.15px] text-white">
                    Taikai
                  </DialogPrimitive.DialogTitle>
                  <DialogPrimitive.Close className="text-white right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </DialogPrimitive.Close>
                </div>
                <ul className="flex flex-col gap-4 text-white/90 transition-colors font-semibold">
                  {session ? (
                    <>
                      <Link
                        to={"/dashboard"}
                        onClick={() => setNavbarOpen(false)}
                        className="hover:text-white hover:bg-figma_secondary rounded py-1 px-1"
                      >
                        Dashboard
                      </Link>

                      {/* <Link
                        to={"/explore"}
                        onClick={() => setNavbarOpen(false)}
                        className="hover:text-white hover:bg-figma_secondary rounded py-1 px-1"
                      >
                        Explore
                      </Link> */}

                      <Separator className="bg-slate-300 px-" />
                      <div className="flex items-center justify-between px-1">
                        <div className="flex flex-col space-y-1 ">
                          <p className="text-sm leading-none font-semibold">
                            {user.name || "User"}
                          </p>
                          <p
                            className="text-xs font-medium leading-none text-slate-4
                        00"
                          >
                            {user.email || "user@example.com"}
                          </p>
                        </div>
                        <button
                          className="flex items-center gap-2 hover:text-white text-white/70"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <Link
                      className="px-1 hover:cursor-pointer"
                      to={"/login"}
                      onClick={() => setNavbarOpen(false)}
                    >
                      Login
                    </Link>
                  )}
                </ul>
              </DialogPrimitive.Content>
            </DialogPrimitive.DialogPortal>
          </Dialog>
        </NavigationMenu>
      </div>
    </nav>
  )
}

export default Navbar
