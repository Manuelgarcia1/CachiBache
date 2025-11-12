import { Injectable } from '@nestjs/common';

/**
 * Servicio para generar respuestas HTML
 * Centraliza la generación de vistas HTML para respuestas del servidor
 */
@Injectable()
export class HtmlResponseService {
  /**
   * Genera una página HTML de éxito para verificación de email
   */
  getEmailVerificationSuccessPage(): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verificado - CachiBache</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            background: white;
            padding: 3rem;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 500px;
            margin: 20px;
          }
          .success-icon {
            font-size: 80px;
            margin-bottom: 20px;
          }
          h1 {
            color: #333;
            margin-bottom: 15px;
            font-size: 28px;
          }
          p {
            color: #666;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .app-name {
            color: #667eea;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success-icon">✅</div>
          <h1>¡Email Verificado!</h1>
          <p>Tu correo electrónico ha sido verificado exitosamente.</p>
          <p>Ahora puedes <span class="app-name">reportar baches</span> y usar todas las funciones de CachiBache.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Genera una página HTML de error para verificación de email
   * @param errorMessage - Mensaje de error a mostrar
   */
  getEmailVerificationErrorPage(errorMessage: string): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error de Verificación - CachiBache</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            background: white;
            padding: 3rem;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 500px;
            margin: 20px;
          }
          .error-icon {
            font-size: 80px;
            margin-bottom: 20px;
          }
          h1 {
            color: #dc3545;
            margin-bottom: 15px;
            font-size: 28px;
          }
          p {
            color: #666;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .error-details {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            text-align: left;
          }
          .error-details p {
            margin: 0;
            font-size: 14px;
            color: #856404;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="error-icon">❌</div>
          <h1>Error de Verificación</h1>
          <p>${errorMessage || 'No se pudo verificar tu email. El enlace puede haber expirado o ya fue utilizado.'}</p>
          <div class="error-details">
            <p><strong>¿Qué puedes hacer?</strong></p>
            <p>• Solicita un nuevo email de verificación desde la app</p>
            <p>• Verifica que hayas usado el enlace más reciente</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
