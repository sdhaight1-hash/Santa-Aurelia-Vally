# Valle de Santa Aurelia — Regional Worldbuilding Bible

**Setting:** An alternate-history lower Columbia coastal and inland region of northwestern Oregon, USA, with precolonial histories, a Spanish-founded port in **1608**, an inland mining-turned-garden city, distinctive immigrant communities, and an extensive body of folklore. The name of the *GitHub repository* retains its existing spelling, `Santa-Aurelia-Vally`; the setting is **Valle de Santa Aurelia**.

> **Foundational rule:** The region's folklore, religious practices, supernatural beliefs, ghost stories, and paranormal investigations are genuine parts of its society, but **no objectively supernatural events, beings, or powers have been established**. The natural world and documented human history supply the wonder.

## Interactive Living Atlas

**New:** a dependency-free, responsive browser application at [`index.html`](index.html).

The visual language combines deep forest green, silver willow, parchment, muted Venetian burgundy and antique brass. Its first working version includes:

- A curated home dashboard, regional cards, and editable **29-entry** seeded encyclopedia based on the canon bible.
- **Family Archive**: interactive person directory, focused family view, ancestor/descendant branching, parent/child and spouse/partner records, inferred siblings, relationship correction, and links between family records and encyclopedia profiles. Seeded with Alonso and Inés only; no children or disputed ancestors invented.
- Categories spanning region, settlement, people, families, organizations, culture, species, geology, landmarks, events, myths, institutions, languages and more.
- Search, category filters, article-to-article links using `[[Entry Title]]` or `[[entry-id|Link label]]`, outgoing relationships and automatic backlinks.
- Clickable **schematic** regional map (clearly **not geographically surveyed**) and an initial chronological event view.
- Create, edit, and delete tools; canon-status fields; tags and linked-entry fields; browser-local persistence; JSON export/import and reset to the bundled seed.
- Mobile-responsive navigation and no JavaScript framework, backend, account or build dependency.

### Launch locally

Open `index.html` directly in a modern browser. If browser security settings interfere with local file storage, use any static web server rooted at the repository (for example `python -m http.server 8000`, then open `http://localhost:8000`). No installation or build step is otherwise required. **A public hosted URL has not been deployed or verified.** To host publicly, configure GitHub Pages to serve from the `main` branch root; then check that Pages has successfully published.

### Editing and backing up

Click **New entry**, or open an article and choose **Edit article**. Use `[[Santa Aurelia]]` or `[[santa-aurelia|the historic port]]` in article content. Links typed in the dedicated Linked entries field also appear in the article's relationship sidebar. Search via the top bar (keyboard shortcut `/`).

**Important:** Editing the app updates browser `localStorage`—it does **not** commit to GitHub. Use **Import / export archive** to save a portable JSON backup. The maintained human-readable canon is still in the `docs/` chapters. Do not assume browser-local changes or an exported JSON file have automatically been merged back into the GitHub repository.

### Genealogy authoring

Open **Family archive** from the left navigation. Click a person to focus their family, switch between **Family**, **Ancestors**, and **Descendants**, and use **Add individual** / **Connect relative** to build generations. Relationship forms support biological, adopted, step, foster, guardian, married, partner, former partner and betrothed labels. **Relationships** disconnects erroneous links without deleting people. Selecting the correct article ID cross-links the family record to the main wiki. The full family archive is contained in the same exported JSON as the encyclopedia.

**Data caution:** "Private / living" is an editorial label, **not an access-control feature**. Do not publish records of living real people or sensitive data on a public website until proper authentication and permission controls are implemented. This historical/fantasy genealogy archive currently uses local browser storage only.

### Initial product boundaries

This is a **working first milestone**, not complete World Anvil parity. The map is conceptual, timeline events are seeded but not yet editor-managed, connections are listed rather than graph-visualized, advanced genealogy (GEDCOM, evidence citations, source attachments, visual pan/zoom, multiple-parent household display) and map-pin authoring are not yet implemented, and there is no multi-user synchronization/authentication or cloud database. The program has been syntax-checked after commit; a full interactive browser regression pass has **not** yet been completed.

See [application roadmap](docs/11-atlas-app-roadmap.md) for the next implementation stages.

---

## Start here

- [Canon and editorial conventions](docs/00-canon-and-open-questions.md)
- [Regional geography and settlement pattern](docs/01-geography-and-settlements.md)
- [History and timeline](docs/02-history-and-timeline.md)
- [Santa Aurelia: Jewel of the Pacific](docs/03-santa-aurelia.md)
- [Willowwick Grove: Garden City](docs/04-willowwick-grove.md)
- [Peoples, communities, institutions, families](docs/05-society-families-and-cultures.md)
- [Witches' Wood: landscape and mythology](docs/06-witches-wood-and-folklore.md)
- [Blackwood Ridge, reservation, Fernhollow, Thornhaven](docs/07-blackwood-communities.md)
- [Alternate geology, flora, and conservation](docs/08-geology-and-ecology.md)
- [Festivals and cultural calendar](docs/09-festivals-and-traditions.md)
- [Continuity register, outstanding decisions, and map needs](docs/10-continuity-register.md)

## Scope and status

Compiled from the extended collaborative conversation through **November 16, 2026**. Entries distinguish **established by the user**, **developed in discussion**, and **provisional assistant suggestions**. The latest explicit user choices take precedence over earlier suggestions. This is an organized canon reference, **not a verbatim transcript**, and invented archival quotations, speculative etymologies, and historically altered events must never be presented as real-world historical facts.

**Established geography:** Santa Aurelia replaces real-world Astoria at the Columbia estuary. Willowwick Grove is a separate inland settlement. Blackwood Ridge and Witches' Wood are inland; the tribal reservation borders and partly occupies the **northwestern Witches' Wood**, while Fernhollow Country lies to the **southwest**. Exact surveyed sites, rivers, and jurisdictional boundaries remain to be fixed.

**Working 2026 population:** Santa Aurelia ~19,000; Willowwick Grove ~21,000; greater valley cultural region ~60,000. These are creative planning figures, not statistics.

**Historical premise:** In 1608 a wealthy Spanish captain with an offshoot connection to the Spanish Habsburg house established Puerto de Santa Aurelia. He later married an adult daughter of a local Indigenous chief **for love**. Cooperative relationships, kinship, and intermarriage became enduring hallmarks of regional history, without erasing Indigenous sovereignty, conflict, or the consequences of colonization.

## Editing guideline

Add new material to the appropriate chapter and log unresolved decisions. Avoid overwriting established facts with decorative prose. Keep geology, ecology, date ranges, Indigenous identities, population, and placenames internally consistent. When a previous version conflicts, record it in the continuity register rather than silently blending alternatives.
