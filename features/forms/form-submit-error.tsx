import { MessageCircle, Phone } from "lucide-react";
import { PhoneLink } from "@/components/phone-link";
import { WhatsAppLink } from "@/components/whatsapp-link";
import type { WhatsAppIntent } from "@/lib/whatsapp";

type FormSubmitErrorProps = {
  message: string;
  whatsappIntent: WhatsAppIntent;
};

export function FormSubmitError({ message, whatsappIntent }: FormSubmitErrorProps) {
  return (
    <div
      role="alert"
      className="space-y-4 rounded-2xl border border-red-500/35 bg-red-950/25 p-4"
    >
      <p className="text-sm leading-relaxed text-red-200">{message}</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <WhatsAppLink
          intent={whatsappIntent}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#25D366]/45 bg-[#25D366]/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white"
        >
          <MessageCircle className="size-4 shrink-0" aria-hidden />
          WhatsApp
        </WhatsAppLink>
        <PhoneLink className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white">
          <Phone className="size-4 shrink-0 text-primary" aria-hidden />
          Bel direct
        </PhoneLink>
      </div>
    </div>
  );
}
