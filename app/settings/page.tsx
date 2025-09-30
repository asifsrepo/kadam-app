import { Palette, Type } from "lucide-react";
import ColorSchemeSettings from "@/components/settings/ColorSchemeSettings";
import FontSettings from "@/components/settings/FontSettings";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSelectedColorScheme, getSelectedFont } from "@/lib/server/settings-helpers";


const SettingsPage = async () => {
	const selectedFont = await getSelectedFont();
	const selectedColorScheme = await getSelectedColorScheme();

	return (
		<main className="space-y-5">
			<div className="mb-8 flex items-start">
				<div>
					<h1 className="font-bold text-3xl">Settings</h1>
					<p className="text-muted-foreground">
						Manage your preferences and account settings below.
					</p>
				</div>
			</div>

			<Tabs defaultValue="theme" className="grid grid-cols-1 gap-6 xl:grid-cols-4">
				<div className="space-y-6 xl:col-span-1">
					<Card>
						<CardContent className="p-0">
							<TabsList className="grid h-auto w-full grid-cols-1 space-y-1 bg-transparent p-2">
								<TabsTrigger
									value="theme"
									className="w-full justify-start rounded-lg px-4 py-3 text-left transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
								>
									<div className="flex items-center gap-3">
										<Palette className="h-4 w-4" />
										<div>
											<div className="font-medium">Theme</div>
											<div className="text-muted-foreground text-xs">
												Colors & appearance
											</div>
										</div>
									</div>
								</TabsTrigger>

								<TabsTrigger
									value="fonts"
									className="w-full justify-start rounded-lg px-4 py-3 text-left transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
								>
									<div className="flex items-center gap-3">
										<Type className="h-4 w-4" />
										<div>
											<div className="font-medium">Fonts</div>
											<div className="text-muted-foreground text-xs">
												Typography settings
											</div>
										</div>
									</div>
								</TabsTrigger>
							</TabsList>
						</CardContent>
					</Card>
				</div>

				<div className="space-y-6 xl:col-span-3">
					<TabsContent value="theme">
						<div className="space-y-6">
							<ColorSchemeSettings initialColorScheme={selectedColorScheme} />
						</div>
					</TabsContent>

					<TabsContent value="fonts">
						<FontSettings initialFont={selectedFont} />
					</TabsContent>
				</div>
			</Tabs>
		</main>
	);
};

export default SettingsPage;
