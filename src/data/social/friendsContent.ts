import type { SocialTabContent } from "../../types"

export const friendsContent: SocialTabContent = {
  id: "social", eyebrow: "Social / 04", title: "Socials ", summary: "{Mine and the goats}",
  socials: [
    {
      id: "me", name: "Carl Adrian Ylanan", body: "",
      links: [
        { title: "LinkedIn", url: "https://www.linkedin.com/in/carl-adrian-ylanan-a7b18b2bb/" },
        { title: "GitHub", url: "https://github.com/CarlYlanan" },
        { title: "Contact Email", url: "mailto:cylanan05@gmail.com" },
      ],
    },
    { id: "anton", name: "Anton G", url: "https://www.antga.dev/" },
    { id: "friend2", name: "Friend2", url: "https://example.com/friend2" },
  ], markers: [
    { id: "me", label: "01 // me" },
    { id: "anton", label: "02 // anton" },
    { id: "friend2", label: "03 // friend2" },
  ],
}
