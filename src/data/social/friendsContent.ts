import type { SocialTabContent } from "../../types"
import { generatedInstagramPosts, instagramProfile } from "./generatedInstagramPosts"

const handle = instagramProfile.handle !== "" ? instagramProfile.handle : "caaaaaaaylllll"
const profileUrl = instagramProfile.handle !== "" ? instagramProfile.profileUrl : `https://www.instagram.com/${handle}/`

export const friendsContent: SocialTabContent = {
  id: "social", eyebrow: "Social / 04", title: "People worth visiting.", summary: "A short list of thoughtful people and places on the web.",
  instagram: { id: "instagram", handle, profileUrl, posts: generatedInstagramPosts },
  socials: [
    { id: "user1", name: "User1", url: "https://example.com/user1", reason: "For making generous notes and sharing the process." },
    { id: "user2", name: "User2", url: "https://example.com/user2", reason: "For a distinctive point of view and excellent projects." },
    { id: "user3", name: "User3", url: "https://example.com/user3", reason: "For curiosity, kindness, and consistently good links." },
  ], markers: [
    { id: "instagram", label: "01 // instagram" },
    { id: "user1", label: "02 // user1" },
    { id: "user2", label: "03 // user2" },
    { id: "user3", label: "04 // user3" },
  ],
}
