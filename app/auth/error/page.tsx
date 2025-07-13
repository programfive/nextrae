import { AuthCard } from "@/components/auth/auth-card";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <AuthCard
        title="Algo salió mal"
        description="Ocurrió un error durante el proceso de autenticación"
      >
        {params?.error ? (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Código de error: {params.error}
            </p>
            <p className="text-xs text-muted-foreground">
              Si el problema persiste, contacta al soporte técnico.
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Ocurrió un error no especificado.
            </p>
            <p className="text-xs text-muted-foreground">
              Intenta nuevamente o contacta al soporte técnico.
            </p>
          </div>
        )}
      </AuthCard>
    </>
  );
}
