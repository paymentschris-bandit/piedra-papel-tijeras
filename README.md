# Piedra · Papel · Tijeras — Juego para Parejas

Juego web para **dos adultos** con retos eróticos. El perdedor de cada ronda cumple un reto; al final de la partida, el ganador recibe un premio especial.

## Requisitos

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- No requiere instalación ni servidor

## Cómo jugar

1. Abre `index.html` en tu navegador (doble clic o arrastra el archivo).
2. Confirma que eres mayor de 18 años.
3. Introduce los nombres de ambos jugadores.
4. Elige la **intensidad** de los retos:
   - **Suave** — Coqueteo y caricias
   - **Picante** — Explícito y morboso
   - **Extremo** — Sin límites (siempre con consentimiento)
5. Cada ronda, los dos jugadores eligen piedra, papel o tijeras **por turnos** (el móvil se pasa de uno a otro para que no vean la elección del otro).
6. El perdedor cumple el reto. Puedes pedir **otro reto** si no os convence.
7. Al terminar todas las rondas, el ganador recibe el premio final.

## Consentimiento

Este juego asume **consentimiento mutuo** entre adultos. Podéis:
- Saltar cualquier reto que no os apetezca
- Cambiar de intensidad en cualquier momento
- Usar una palabra de seguridad para parar

## Modos de juego

### Un móvil
Pasáis el mismo dispositivo. Podéis elegir con **botones** o con la **ruleta** (pulsad ELEGIR mientras gira).

### Dos móviles (online)
1. **Anfitrión**: configura la partida y pulsa «Crear sala online».
2. Comparte el **código de 6 dígitos** con tu pareja.
3. **Invitado/a**: introduce el código en «Unirse a sala» y pulsa Unirse.
4. Cada uno elige en su móvil al mismo tiempo (sin ver la elección del otro).

> **Importante:** el modo online necesita **internet** y funcionar en **HTTPS o localhost**. Si abres el archivo directamente (`file://`) puede fallar. Usa un servidor local:
> ```
> cd "c:\Apps\Piedra papel tijeras"
> python -m http.server 8080
> ```
> Luego abre `http://localhost:8080` en ambos móviles (misma WiFi) o despliega en la web.

## Archivos

| Archivo | Descripción |
|---------|-------------|
| `index.html` | Estructura del juego |
| `styles.css` | Estilos visuales |
| `game.js` | Lógica del juego |
| `challenges.js` | Retos y premios por nivel |
| `effects.js` | Animaciones y partículas |
| `roulette.js` | Ruleta giratoria |
| `multiplayer.js` | Conexión online (PeerJS) |

## Personalizar retos

Edita el objeto `CHALLENGES` en `challenges.js` para añadir, quitar o modificar retos en cada nivel (`suave`, `picante`, `extremo`).
