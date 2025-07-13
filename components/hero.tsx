export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <h1 className="text-4xl font-bold">
        Bienvenido a <span className="text-primary">Tu Aplicación</span>
      </h1>
      <p className="text-lg text-muted-foreground">
        Esta es una aplicación de ejemplo para demostrar cómo funciona la
        autenticación con Supabase.
      </p>
      <div className="flex gap-4">
        <div className="w-full p-px bg-linear-to-r from-transparent via-foreground/10 to-transparent my-8" />
      </div>
    </div>
  );
}
