import React from "react";
import { Link } from "react-router-dom";
import {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuLink,
	navigationMenuTriggerStyle,
} from "../ui/navigation-menu";

interface NavLinkType {
	name: string;
	to: string;
}

const navlinks: NavLinkType[] = [
	{
		name: "Dashboard",
		to: "/dashboard",
	},
	{
		name: "Explore",
		to: "explore",
	},
];

const NavLink = ({ name, to }: NavLinkType) => {
	return (
		<>
			<NavigationMenuItem>
				<Link className="flex items-center justify-center" to={to}>
					<NavigationMenuLink
						className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-figma_secondary`}
					>
						<p className="text-article text-white">{name}</p>
					</NavigationMenuLink>
				</Link>
			</NavigationMenuItem>
		</>
	);
};

const Navbar = () => {
	return (
		<nav className="bg-figma_dark h-[72px] w-full">
			<div className="flex h-full items-center justify-between px-[108px] py-2">
				<Link to="/" className="flex h-full items-center justify-center">
					<p className="font-poppins text-2xl font-bold leading-6 tracking-[0.15px] text-white">
						Taikai
					</p>
				</Link>
				<NavigationMenu>
					<NavigationMenuList className="flex gap-12">
						{navlinks.map((link) => (
							<NavLink key={link.name} name={link.name} to={link.to} />
						))}
					</NavigationMenuList>
				</NavigationMenu>
			</div>
		</nav>
	);
};

export default Navbar;
