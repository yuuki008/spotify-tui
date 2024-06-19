// types.ts

export interface SpotifyDevice {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}

export interface SpotifyUserProfile {
  display_name: string;
  email: string;
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  href: string;
  id: string;
  images: Array<{ url: string }>;
  product: string;
  type: string;
  uri: string;
}

// Imageの型定義
interface Image {
  url: string;
  height: number;
  width: number;
}

// ExternalUrlsの型定義
interface ExternalUrls {
  spotify: string;
}

// Ownerの型定義
interface Owner {
  external_urls: ExternalUrls;
  followers: {
    href: string | null;
    total: number;
  };
  href: string;
  id: string;
  type: string;
  uri: string;
  display_name: string;
}

// Tracksの型定義
interface Tracks {
  href: string;
  total: number;
}

// Itemの型定義
interface Item {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  public: boolean;
  snapshot_id: string;
  tracks: Tracks;
  type: string;
  uri: string;
}

// Responseの型定義
export interface SpotifyShowsResponse {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: Item[];
}

