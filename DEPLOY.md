# Desplegar en Vercel (webcam en móvil)

El juego es **100% estático** (HTML + JS). **Vercel** da HTTPS gratis → la cámara funciona en PC y móvil sin certificados ni túneles.

**Supabase no hace falta** para este juego (no hay base de datos ni login).

## Cuenta y repositorio

- **GitHub:** [paymentschris-bandit](https://github.com/paymentschris-bandit)
- **Repo:** `piedra-papel-tijeras` (privado) en GitHub
- **Proyecto Vercel:** `ppt-juego-parejas` (nombre distinto; `piedra-papel-tijeras.vercel.app` es de otra persona)
- **Vercel:** conectado por Git con `paymentschris@gmail.com`

## Subir a GitHub (primera vez)

```powershell
cd "c:\Apps\Piedra papel tijeras"
gh auth login
# Elige GitHub.com → HTTPS → inicia sesión como paymentschris-bandit

gh repo create piedra-papel-tijeras --private --source=. --remote=origin --push
```

Si el repo ya existe en GitHub:

```powershell
git remote add origin https://github.com/paymentschris-bandit/piedra-papel-tijeras.git
git branch -M main
git push -u origin main
```

## Vercel (desde GitHub)

1. [vercel.com](https://vercel.com) → inicia sesión con `paymentschris@gmail.com`
2. **Add New Project** → importa `paymentschris-bandit/piedra-papel-tijeras`
3. Framework: **Other** (sitio estático, sin build)
4. Deploy → URL tipo `https://ppt-juego-parejas.vercel.app`

> **No uses** `piedra-papel-tijeras.vercel.app` — ese enlace es otro juego ajeno al tuyo.

Cada `git push` a `main` vuelve a desplegar solo.

## Probar webcam

1. Abre la URL de Vercel en **PC** y **móvil**
2. Modo **Webcam** → uno **Crea sala**, el otro **Unirse** con el código
3. Acepta cámara y micrófono

## Actualizar tras cambios

```powershell
git add .
git commit -m "Tus cambios"
git push
```

Vercel despliega automáticamente. O manual: `npx vercel --prod` (tras `vercel login` con la cuenta nueva).

> Si cambias de cuenta Vercel: borra `.vercel` local y haz `vercel logout` + `vercel login`.

No subas `local-*.pem`, `.cert-ip` ni `_backup/` (están en `.gitignore`).

