import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingWhatsAppFab } from "@/components/floating-whatsapp-fab";
import { MobileStickyCta } from "@/components/mobile-sticky-cta";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 pb-28 md:pb-0">{children}</main>
      <Footer />
      <MobileStickyCta />
      <FloatingWhatsAppFab />
    </div>
  );
}
