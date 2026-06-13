# Desplegar en Vercel (webcam en móvil)

El juego es **100% estático** (HTML + JS). **Vercel** da HTTPS gratis → la cámara funciona en PC y móvil sin certificados ni túneles.

**Supabase no hace falta** para este juego (no hay base de datos ni login). Si más adelante quieres guardar estadísticas o cuentas, ahí sí.

## Pasos (una vez)

1. Cuenta gratis en [vercel.com](https://vercel.com) (GitHub/Google).
2. Instala la CLI (opcional):
   ```powershell
   npm i -g vercel
   ```
3. En la carpeta del juego:
   ```powershell
   cd "c:\Apps\Piedra papel tijeras"
   git init
   git add .
   git commit -m "Deploy juego parejas"
   vercel
   ```
4. Sigue las preguntas (proyecto nuevo, carpeta actual).
5. Te dará una URL tipo: `https://piedra-papel-tijeras.vercel.app`

## Probar webcam

1. Abre esa URL en **PC** y **móvil** (puede ser 4G, no hace falta misma WiFi).
2. Modo **Webcam** → uno **Crea sala**, el otro **Unirse** con el código.
3. Acepta cámara y micrófono en los dos.

## Actualizar tras cambios

```powershell
git add .
git commit -m "Cambios"
vercel --prod
```

## Alternativa sin CLI

1. Sube el proyecto a un repo en GitHub (privado recomendado).
2. Vercel → **Add New Project** → importa el repo → Deploy.

No subas `local-*.pem`, `.cert-ip` ni `_backup/` (ya están en `.gitignore`).
