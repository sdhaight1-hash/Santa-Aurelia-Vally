# Genealogy — Family Archive technical design

## Scope of first implementation (November 16, 2026)
The atlas now has a dedicated **Family Archive**, integrated into its primary navigation. It is an Ancestry-inspired family browser, without copying that site's UI, trademarked design or proprietary data.

Each person is a separate identity record (`id`, `name`, `born`, `died`, `bio`, `entryId`, `status`, `privacy`). Relationships are edges stored separately, with an `id`, `type`, source and destination `a/b`, `kind`, `start`, `end`, and `notes`. For parent edges, **`a` is parent and `b` is child**; partnership edges are symmetric. Person IDs remain stable when names are corrected.

### Views
- **Family:** selected individual, known parents, partner(s), children, and siblings inferred from shared parent(s).
- **Ancestors:** branching pedigree with recursive expansion to five rendered generations; select an ancestor to continue navigating.
- **Descendants:** analogous branching children-to-grandchildren view.
- **Directory:** searchable list of individuals; focus any person.
- **Edit:** add individual, edit dates/bio/status/privacy, connect existing people, disconnect incorrect edges without deleting either person, delete a person with removal of adjacent edges, link a person's main encyclopedia article.

The birth/death fields are intentionally free text so `c. 1611` and uncertain dates remain possible in alternate history. Date arithmetic and chronological consistency are **not** yet validated. Branch charts show individual parent or child connections, not a completely layout-optimized multi-household family tree.

### Historical seed
- **Don Alonso de Valcárcel y Austria** — proposed c.1572–1641, linked to `alonso`.
- **Inés** — local chief's adult daughter, dates and original Indigenous name unresolved, linked to `ines`.
- Their **proposed marriage c.1611** is represented as a partnership edge.
- No guessed children, descendants, parents or specific tribe are created from the general narrative. Invented people must be added as new canon or provisional individuals when developed.

### Integrity
- Reject self-parentage and self-partnership.
- Reject repeated identical parent edges and symmetric duplicate partnerships.
- Reject ancestry cycles (one person cannot become their own ancestor).
- Adding a relationship never creates a duplicate person record.
- Deleting a person removes its relationship edges but does **not** delete their independent encyclopedia article.
- Relationships are included in JSON import/export; older archives migrate in memory to the genealogical schema without dropping article data.
- Direct person links: `#/genealogy/<person-id>`; linked encyclopedia Person pages can navigate back to the family view.

### Privacy and provenance
The `private` field is informational only. Local-only editing helps avoid an automatic public database, but browser storage and exported JSON are **not encrypted**, so do **not** enter sensitive information about real living people. There are no source citations or evidence grading yet. In-world ancestry claims must distinguish verified genealogy from stories (e.g., White Ones or proposed Celtic/Pictish link). Descending from an Indigenous ancestor does not automatically imply tribal enrollment/citizenship.

## Validation in this implementation
Verified JavaScript syntax for genealogy integration. A targeted dynamic test using the connected repository file checked: valid parent, valid grandparent, rejection of cycle, rejection of duplicate parent edge, rejection of self-parentage, and retrieval of incoming/outgoing parent edges. **No complete visual browser E2E run was available.**

## Next milestones toward an Ancestry-scale experience
1. **Kinship model:** family/household records, union events, marriage/divorce status, multiple partners with dates, biological versus adoptive parentage explicitly represented, sibling inference by qualified edges, stepchildren and guardians distinctly visualized.
2. **Evidence:** individual fact/event records, sources, citations, attachments, conflicting hypotheses, confidence, claimed versus verified descent, and editorial approval.
3. **Visual UX:** pannable/zoomable vertical extended family trees, horizontal pedigrees, compact fan view, family group sheets, person drawer, selection/search, multiple generations, printable charts.
4. **Interchange:** GEDCOM 7 import/export with diagnostics, encoding handling and privacy filtering; JSON migration tests and safe merge modes.
5. **World integration:** individuals linked to places, families, events, cultures, roles, historic time ranges and institutions with typed indexed relationships. Profile data should not be retyped in separate wiki articles.
6. **Scalability:** duplicate resolution, orphan/missing parent reports, loops and impossible date validation, incremental graph rendering for hundreds/thousands of people, versioned migration and recovery snapshots.
7. **Access:** explicit privacy and publishing modes before exposing any real person's family data.
