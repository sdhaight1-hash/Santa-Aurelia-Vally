# Living Atlas — product architecture and implementation roadmap

## Product goal
Build a beautiful, accessible, reliable, deeply interlinked worldbuilding application for **Valle de Santa Aurelia**, inspired by the *functional patterns* of World Anvil, Kanka, LegendKeeper and similar software, without copying their proprietary UI or content. The program must help the creator research, navigate, extend, maintain, and present all aspects of the living setting.

## Implemented baseline (November 16, 2026)
- Static HTML, CSS and plain JavaScript, hosted under the repository root, no package installs.
- Responsive atmospheric theme: deep coastal forest green, silver willow, weathered parchment, antique gold and restrained Venetian red.
- Seeded article database with 29 interconnected lore entries derived from the more comprehensive Markdown worldbuilding bible.
- One unified entry model: `id`, `title`, `category`, `status`, `era`, `summary`, `body`, `tags[]`, `links[]`. Statuses indicate established, working, provisional or in-world legend. A simple dated timeline sits beside the entry dataset.
- Homepage, encyclopedia/search/filter, linked article view, incoming and outgoing references, relationship listing, clickable **schematic** regional overview, timeline view, create/edit/delete form.
- Human-authored `[[wiki link]]` markup supported inside articles. Plain text from editable content is escaped to avoid untrusted HTML injection.
- Browser-local edits with JSON import/export and seed restoration. No accidental claim of GitHub synchronization.
- JS syntax verification carried out on stored repo files, but no browser E2E suite run yet.

## Key product decisions
A single world is the root scope. Content categories are broad enough for geology, peoples, factions, families, artifacts, maps, ecosystems, religions, buildings, historical events and folklore without requiring separate disconnected software modules. Entry relationships should be **first-class typed edges** in the later schema; avoid duplicating people/place names in numerous unrelated text fields.

Data needs **provenance**, not just text. All important lore must say whether a claim is setting-established, working, speculative, or merely an account believed by characters. Folklore about werewolves or White Giants is *not* an objective supernatural fact. An item can record who asserts a story and when without making it setting reality.

Publishing and authoring should be distinct workflows. Users need friendly public presentation, but canon editors need controlled validation and backups.

## Next milestone — data integrity and authoring
1. Create a persistent structured store (IndexedDB for offline-first standalone use, or a local/hosted database with explicit consent for multi-device). Include schema versions, migrations, snapshots, autosave status and robust import validation.
2. Add rich in-place **wiki link picker** supporting autocomplete, missing-entry recommendations, create-from-mention, aliases, orphaned links, duplicate detection and link repair when a title changes. Avoid forcing ID changes on rename.
3. Typed relationships: `located_in`, `member_of`, `owns`, `descended_from`, `founded`, `occurred_at`, `part_of`, `associated_with`, with time range, status, evidence and directionality.
4. Comprehensive entry schema metadata: alternate names, timestamps/eras, parent place, coordinates, image/media refs, sources, author notes, canon claims, edits and permission/access status.
5. Build a migration pathway between the GitHub Markdown world bible and interactive structured data; no divergence or silent overwrites. Provide JSON and Markdown exports and import validation.
6. Add automated unit tests for linking, backlinks, rename/delete, import/export, HTML escaping and data migrations, plus browser navigation smoke tests.

## Following milestone — interactive regional geography and history
A **geographically grounded** region map anchored to Astoria and the Columbia River, distinguishing verified real-world features from conscious alternate geography. Support GIS layers, markers with entry links, reservation boundaries (only after legally developed), historic route traces, rivers/land use, uncertainty markers, nested historical maps and filtering by era. Timeline needs an editor, BCE and uncertain dates, eras, date ranges, groups and links to map features.

## Following milestone — connected civilization and families
Deep people and family records, relationships, interactive genealogy, organizations, cultures, settlements, institutions, properties, languages, traditions, religious practices, economies, and ownership/legal jurisdictions. Support generation of connections from references with human approval rather than auto-creating duplicate lore. Search and recommendations should be aware of place and time.

## Following milestone — polish and publishing
Image galleries, printable records, citable archival notes, page layouts and visual design templates, a full-text index, presentation/reader mode, keyboard navigation, contrast and accessibility review, mobile usability, PDF/story/export options, role-based permissions if collaboration is added, and deployment through Pages or a hosted backend.

## Design guardrails
No speculative bloat or fake working controls. Preserve the user-established decisions in `docs/10-continuity-register.md`. Don't pretend schematic maps have precise distances; don't allow editor auto-linking to promote folklore into established facts. Respect sovereign tribal authority, culturally sensitive sites, and distinct language origins. Validate against the Markdown canon before generating new seed data. Implement small verifiable milestones; test before claiming complete parity.
