import { ContentWrapper } from "@/components/layout/content-wrapper";
import { PageHead, StatusDot } from "@/components/ui";
import { C4PageClient } from "./C4PageClient";

export default function C4Page() {
  return (
    <ContentWrapper>
      <div className="animate-page-in">
        <PageHead
          title="Arquitectura C4"
          sub="Generada automáticamente desde los EDEs"
          right={
            <div className="flex items-center gap-3">
              <StatusDot variant="success" label="SSE conectado" />
            </div>
          }
        />
        <C4PageClient />
      </div>
    </ContentWrapper>
  );
}
