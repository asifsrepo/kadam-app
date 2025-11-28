import { MetadataRoute } from "next";
import { APP_URL } from "@/constants";

const sitemap = (): MetadataRoute.Sitemap => {
	return [
		{
			url: APP_URL,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 1,
		},
		{
			url: `${APP_URL}/auth`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
	];
};

export default sitemap;
