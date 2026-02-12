import { Metadata } from "next";
import { APP_NAME, APP_URL } from "@/constants";

export const metadata: Metadata = {
	metadataBase: new URL(APP_URL),
	title: {
		default: `${APP_NAME} - Credit Management for Retail Stores`,
		template: `%s - ${APP_NAME}`,
	},
	description:
		"Hysabee is a comprehensive credit management application designed for local retail stores to track and manage customer credit transactions, payments, and outstanding balances with ease.",
	icons: {
		icon: [
			{ url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{ url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
			{ url: "/favicon/favicon.ico" },
		],
		apple: [
			{ url: "/favicon/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
			{ url: "/favicon/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
			{ url: "/favicon/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
			{ url: "/favicon/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
			{ url: "/favicon/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
			{ url: "/favicon/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
			{ url: "/favicon/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
			{ url: "/favicon/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
			{ url: "/favicon/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
			{ url: "/favicon/apple-icon.png", sizes: "180x180", type: "image/png" },
		],
		other: [
			{ rel: "shortcut icon", url: "/favicon/favicon.ico" },
			{ rel: "apple-touch-icon-precomposed", url: "/favicon/apple-icon-precomposed.png" },
		],
	},
	manifest: "/manifest.json",
	other: {
		"theme-color": "#ffffff",
		"msapplication-TileColor": "#ffffff",
		"msapplication-config": "/browserconfig.xml",
		"mobile-web-app-capable": "yes",
		"apple-mobile-web-app-capable": "yes",
		"apple-mobile-web-app-status-bar-style": "default",
		"apple-mobile-web-app-title": "Hysabee",
	},
	robots: {
		index: true,
		follow: true,
		nocache: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	openGraph: {
		type: "website",
		url: APP_URL,
		title: `${APP_NAME} - Credit Management for Retail Stores`,
		description:
			"Hysabee is a comprehensive credit management application designed for local retail stores to track and manage customer credit transactions, payments, and outstanding balances with ease.",
		// images: [`${APP_URL}/og/logo.png`],
	},
	twitter: {
		title: `${APP_NAME} - Credit Management for Retail Stores`,
		site: "@Hysabee",
		card: "summary_large_image",
	},
	appleWebApp: {
		capable: true,
		title: `${APP_NAME} - Credit Management for Retail Stores`,
		statusBarStyle: "black-translucent",
	},
	authors: [
		{
			name: "Muhammed Sinan",
			url: "https://github.com/sinanptm",
		},
	],
};
