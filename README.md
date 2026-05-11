# AgasKhan.github.io

Portal personal de AgasKhan. Hub de packages de Unity, proyectos y notas técnicas.

Vive en [https://agaskhan.github.io](https://agaskhan.github.io).

## Estructura

- `index.md` — landing principal
- `packages.md` — listado de Unity Packages publicados desde Common-Package
- `projects.md` — proyectos en curso
- `_data/packages.yml` — metadata de cada package (auto-generado)
- `_data/projects.yml` — metadata de proyectos (manual)
- `scripts/sync-from-cp.ps1` — regenera `_data/packages.yml` desde Common-Package local

## Regenerar el listado de packages

Cuando se publique un nuevo package en Common-Package (o cambie versión / descripción), correr:

```powershell
pwsh scripts/sync-from-cp.ps1
```

El script lee `D:\Proyectos\Personales\Unity\Common-Package\Assets\Scripts\**\package.json` y reescribe `_data/packages.yml`. Pasar `-CommonPackagePath <ruta>` para apuntar a otra ubicación.

Después: `git add _data/packages.yml && git commit -m "[Update] Sync packages from CP"`.

## Preview local

Requiere Ruby + Bundler.

```sh
bundle install
bundle exec jekyll serve
```

Abre `http://localhost:4000`.

GitHub Pages hace el build automáticamente al hacer push a `main`.
