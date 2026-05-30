import { subscribe } from "@/lib/sse";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const unsubscribe = subscribe((trigger) => {
        const data = `data: ${JSON.stringify(trigger)}\n\n`;
        controller.enqueue(encoder.encode(data));
      });

      const keepalive = setInterval(() => {
        controller.enqueue(encoder.encode(": keepalive\n\n"));
      }, 15000);

      const cleanup = () => {
        unsubscribe();
        clearInterval(keepalive);
      };

      controller.enqueue(encoder.encode(": connected\n\n"));

      void new Promise<void>((resolve) => {
        const originalClose = controller.close.bind(controller);
        controller.close = () => {
          cleanup();
          originalClose();
          resolve();
        };
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
