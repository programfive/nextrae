import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconHelp, IconBook, IconVideo, IconMessage, IconMail } from "@tabler/icons-react";

export default function HelpPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Ayuda</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <IconHelp className="mr-2 h-4 w-4" />
            Contactar Soporte
          </Button>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Centro de Ayuda</CardTitle>
            <CardDescription>
              Encuentra respuestas a tus preguntas y aprende a usar el sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col justify-center">
                <IconBook className="h-6 w-6 mb-2" />
                <span>Manual de Usuario</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col justify-center">
                <IconVideo className="h-6 w-6 mb-2" />
                <span>Tutoriales</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col justify-center">
                <IconMessage className="h-6 w-6 mb-2" />
                <span>FAQ</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col justify-center">
                <IconMail className="h-6 w-6 mb-2" />
                <span>Soporte</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recursos Útiles</CardTitle>
            <CardDescription>
              Enlaces y recursos de ayuda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <IconBook className="mr-2 h-4 w-4" />
              Guía de Inicio
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconVideo className="mr-2 h-4 w-4" />
              Videos Tutoriales
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconMessage className="mr-2 h-4 w-4" />
              Preguntas Frecuentes
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <IconMail className="mr-2 h-4 w-4" />
              Contactar Soporte
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 