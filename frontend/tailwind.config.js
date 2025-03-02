/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/features/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",

	],
	theme: {
		extend: {
			fontSize: {
				article: [
					"18px",
					{
						lineHeight: "28px",
						letterSpacing: "0px",
						fontWeight: "500",
					},
				],
				"article-2": [
					"20px",
					{
						lineHeight: "16px",
						letterSpacing: "0px",
						fontWeight: "500",
					},
				],
				paragraph: [
					"16px",
					{
						lineHeight: "16px",
						letterSpacing: "0px",
						fontWeight: "400",
					},
				],
				desc: [
					"14px",
					{
						lineHeight: "22px",
						letterSpacing: "0px",
						fontWeight: "500",
					},
				],
				label: [
					"14px",
					{
						lineHeight: "26px",
						letterSpacing: "2px",
						fontWeight: "700",
					},
				],
				hero: [
					"72px",
					{
						lineHeight: "86px",
						letterSpacing: "-1px",
						fontWeight: "700",
					},
				],
				header: [
					"58px",
					{
						lineHeight: "70px",
						letterSpacing: "-1px",
						fontWeight: "700",
					},
				],
				title: [
					"42px",
					{
						lineHeight: "52px",
						letterSpacing: "-0.4px",
						fontWeight: "700",
					},
				],
				headline: [
					"32px",
					{
						lineHeight: "42px",
						letterSpacing: "0px",
						fontWeight: "700",
					},
				],
				lead: [
					"22px",
					{
						lineHeight: "32px",
						letterSpacing: "0px",
						fontWeight: "500",
					},
				],
				"button-sm": [
					"16px",
					{
						lineHeight: "22px",
						letterSpacing: "0px",
						fontWeight: "500",
					},
				],
				"button-md": [
					"18px",
					{
						lineHeight: "26px",
						letterSpacing: "0px",
						fontWeight: "500",
					},
				],
				"button-lg": [
					"20px",
					{
						lineHeight: "26px",
						letterSpacing: "0px",
						fontWeight: "500",
					},
				],
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				chart: {
					1: "hsl(var(--chart-1))",
					2: "hsl(var(--chart-2))",
					3: "hsl(var(--chart-3))",
					4: "hsl(var(--chart-4))",
					5: "hsl(var(--chart-5))",
				},
				figma_primary: {
					DEFAULT: "#25DAC5",
					hover: "#1EAE9E",
				},
				figma_secondary: "#482BE7",
				figma_third: "#E93A7D",
				figma_dark: "#2F1893",
				figma_dark_90: "#EAE8F4",
				figma_heading: "#1E0E62",
				figma_text: "#15143966",
				figma_grey: "#EBEAED",
				figma_error: "#C84545",
				figma_green: "#2ECC71",
				figma_shade1: "#FFFFFF",
				figma_shade2: "#222222",
				figma_shade2_5: "#2222220D",
				figma_shade2_30: "#2222224D",
				figma_neutral1: "#F7F7F7",
				figma_neutral2: "#EBEBEB",
				figma_neutral3: "#DDDDDD",
				figma_neutral4: "#D3D3D3",
				figma_neutral5: "#C2C2C2",
				figma_neutral6: "#B0B0B0",
				figma_neutral7: "#717171",
				figma_neutral8: "#5E5E5E",
			},
			fontFamily: {
				poppins: ["Poppins", "sans-serif"],
			},
			keyframes: {
				overlayShow: {
				  from: { opacity: "0" },
				  to: { opacity: "1" },
				},
				contentShow: {
				  from: {
					opacity: "0",
					transform: "translate(-50%, -48%) scale(0.96)",
				  },
				  to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
				},
			  },
			  animation: {
				overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
				contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
			  },
		},
	},
	plugins: [require("tailwindcss-animate")],
};
