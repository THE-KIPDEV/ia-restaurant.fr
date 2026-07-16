import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      // L'ancienne page /seo/formation-ia-restaurant (~350 mots) est remplacée par la page
      // dédiée /formation-ia-restaurant. 301 pour conserver l'historique de l'URL indexée
      // et éviter la cannibalisation entre les deux.
      {
        source: "/seo/formation-ia-restaurant",
        destination: "/formation-ia-restaurant",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
