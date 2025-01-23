import HomepageFooter from "@/components/layout/HomepageFooter";
import HomepageHeader from "@/components/layout/HomepageHeader";
import BannerSlider from "@/components/specific/homepage/BannerSlider";
import { GetCollections } from "./api/collection";

export default async function Home() {
  const collections = await GetCollections() ?? [];
  return (
    <div className="relative h-screen w-screen bg-red-100">
      <HomepageHeader collections={collections} />
      <BannerSlider />
      <HomepageFooter collections={collections}/>
    </div>
  );
}
