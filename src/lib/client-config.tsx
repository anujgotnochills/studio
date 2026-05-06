import { createContext, useContext, useEffect, useMemo, useState } from "react";

type SocialLinks = {
  whatsapp: string;
  instagram: string;
  linkedin: string;
  youtube: string;
};

export type ClientConfig = {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  founderName?: string;
  founderRole?: string;
  founderImage?: string;
  aboutLine1?: string;
  aboutLine2?: string;
  aboutLine3?: string;
  showreelVideo?: string;
  mapEmbedUrl?: string;
  mapSearchUrl?: string;
  heroSubtitle?: string;
  social?: Partial<SocialLinks>;
};

type ClientConfigContextValue = {
  clientId: string | null;
  config: ClientConfig;
};

const defaultConfig: ClientConfig = {
  name: "Endurance Image",
  tagline: "Visual Storytelling",
  description:
    "Endurance Production — Premium video production, photography, and creative direction. We craft visual stories that captivate.",
  phone: "+91 9582156943",
  email: "enduranceimage16@gmail.com",
  address: "A-74, 2nd Floor, Sector- 65, Noida- 201301",
  mapSearchUrl:
    "https://www.google.com/maps/search/?api=1&query=Endurance+Image,+A-74,+2nd+Floor,+Sector+65,+Noida+201301",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Endurance+Image-+End+to+End+Podcast+Production+Studio&t=&z=14&ie=UTF8&iwloc=&output=embed",
  heroSubtitle: "End-to-end production, from concept to final edit.",
  founderName: "Founder Name",
  founderRole: "Founder",
  founderImage: "/media/owner_photo.png",
  aboutLine1:
    "Endurance Image is a media production house focused on premium content and creator-first execution.",
  aboutLine2:
    "From branded content and corporate shoots to live event coverage, we act as invested partners rather than typical vendors.",
  aboutLine3:
    "If the work is right, it speaks for itself. Most clients stay because they know their vision will be handled flawlessly.",
  showreelVideo: "/media/mac-vid.mp4",
  social: {
    whatsapp: "https://wa.me/919582156943",
    instagram: "https://www.instagram.com/enduranceimage16/",
    linkedin: "https://www.linkedin.com/in/jyotishman-sarmah-4339b3190",
    youtube: "https://www.youtube.com/@enduranceimage4206",
  },
};

const ClientConfigContext = createContext<ClientConfigContextValue>({
  clientId: null,
  config: defaultConfig,
});

function getClientId(): string | null {
  const params = new URLSearchParams(window.location.search);
  const queryClient = params.get("client");
  if (queryClient) return queryClient;

  const pathMatch = window.location.pathname.match(/\/client=([^/]+)/);
  return pathMatch ? decodeURIComponent(pathMatch[1]) : null;
}

function withDefaults(config: Partial<ClientConfig>): ClientConfig {
  const mergedSocial = {
    ...defaultConfig.social,
    ...(config.social ?? {}),
  };

  if (!config.social?.whatsapp && config.phone) {
    const normalized = config.phone.replace(/[^\d+]/g, "");
    const digitsOnly = normalized.replace("+", "");
    mergedSocial.whatsapp = `https://wa.me/${digitsOnly}`;
  }

  const resolvedAddress = config.address || defaultConfig.address;

  return {
    ...defaultConfig,
    ...config,
    mapSearchUrl:
      config.mapSearchUrl ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(resolvedAddress)}`,
    mapEmbedUrl:
      config.mapEmbedUrl ||
      `https://maps.google.com/maps?q=${encodeURIComponent(resolvedAddress)}&t=&z=14&ie=UTF8&iwloc=&output=embed`,
    social: {
      ...mergedSocial,
    },
  };
}

export function ClientConfigProvider({ children }: { children: React.ReactNode }) {
  const [clientId, setClientId] = useState<string | null>(null);
  const [config, setConfig] = useState<ClientConfig>(defaultConfig);

  useEffect(() => {
    const resolvedClientId = getClientId();
    setClientId(resolvedClientId);
    if (!resolvedClientId) return;

    fetch("/clients.json")
      .then((res) => (res.ok ? res.json() : {}))
      .then((clients: Record<string, Partial<ClientConfig>>) => {
        const clientConfig = clients[resolvedClientId];
        if (!clientConfig) return;
        setConfig(withDefaults(clientConfig));
      })
      .catch(() => {
        // Keep defaults if client JSON is missing/unavailable.
      });
  }, []);

  useEffect(() => {
    document.title = `${config.name} - ${config.tagline || "Website"}`;
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) descriptionMeta.setAttribute("content", config.description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", config.name);
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute("content", config.description);
  }, [config]);

  const value = useMemo(() => ({ clientId, config }), [clientId, config]);
  return <ClientConfigContext.Provider value={value}>{children}</ClientConfigContext.Provider>;
}

export function useClientConfig() {
  return useContext(ClientConfigContext);
}
