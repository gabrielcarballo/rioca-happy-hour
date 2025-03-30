import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rio Music Lounge",
    short_name: "Rio Music",
    description: "Descubra o que está tocando e adicione suas músicas favoritas à nossa playlist",
    start_url: "/",
    display: "standalone",
    background_color: "#FF9E2C",
    theme_color: "#8A4FFF",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}

