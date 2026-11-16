# Migration Evidence Register, Open Decisions and Demographic Research Plan

## Source hierarchy
1. **Direct user-established canon** outranks assistant hypotheses.
2. **The repository's detailed chapters** establish the current working in-world narrative; later explicit user corrections override older passages.
3. **Real historical sources** ground plausibility but never confirm the counterfactual migration itself.
4. **Working names, estimates and proposed dates** stay marked until approved.
5. **Unsupported figures or causal claims** must be left unresolved.

## Existing world-bible cross-reference register

| Source | Scope / content to preserve |
|---|---|
| [02 History and Timeline](../02-history-and-timeline.md) | Indigenous prehistory, 1608 founding, 1700 disaster, Venetian and Willowwick sequence |
| [03 Santa Aurelia](../03-santa-aurelia.md) | Distinct Spanish–Indigenous maritime city and later Venetian elites |
| [04 Willowwick Grove](../04-willowwick-grove.md) | Gold mining, Connecticut and Virginia families, Victorian/garden-city migration |
| [05 Peoples and Families](../05-society-families-and-cultures.md) | Established immigrant communities, faiths, sovereign institutions |
| [06 Witches' Wood](../06-witches-wood-and-folklore.md) | Indigenous-first folklore, later European reinterpretation |
| [07 Blackwood Communities](../07-blackwood-communities.md) | Fernhollow, reservation, proposed Irish/Scottish/Romanian/Czech villages |
| [10 Continuity Register](../10-continuity-register.md) | Explicit user decisions and later overrides |
| [14 Founding Family Genealogy](../14-founding-family-genealogy.md) | Fictional Valcárcel dynasty and unfilled Indigenous lines |
| [16 Founding Fleet Logbook](../16-founding-fleet-logbook-1608.md) | In-world 67-person 1608 muster, origins and occupations |
| [18 Estate Catalogue](../18-estate-library-collection-catalogue.md) | Fictional letters, voyage and family records |
| [19 Sáweli's Historical Corpus](../19-saweli-ines-historian-and-oral-histories.md) | Indigenous interviews and written history |
| [20 Spain Travel Journals](../20-saweli-journals-of-spain.md) | Suggested transatlantic family travels, c.1620s/1630s |
| [22 Venetian Ballrooms](../22-season-of-halls-venetian-ballrooms.md) | Merchant/artisan and hall patronage phases |
| [27 Outlying Townships](../27-prosperity-and-outlying-townships.md) | Southbank independence and unequal regional economy |
| [29 Geography](../29-geographic-master-plan.md) | Spatial constraints and provisional locations |
| [35 Duskwood](../35-duskwood-township.md) | Separate outer-forest township; founding year open |
| [36 Agriculture and Rodeo](../36-agriculture-ranching-4h-rodeo.md) | Wyoming family migration and wet-climate adaptation |

## Open decisions — ranked for highest downstream impact

### Tier 1: political/territorial chronology [U]
**M1. Spanish-to-American legal transition:** determine institutional authority c.1608–1859, including Mexico independence, British trade, the Oregon Treaty context, and what changes in regional political borders. Without this we cannot claim federal exclusion laws, state land grants or citizenship rules applied at precise dates.

**M2. Indigenous countries and modern sovereignty:** name and delineate in-setting Ashalewan and other Indigenous polities, distinguish any real-nation analogues, describe treaty/recognition/property history, document reservation origin without implying colonial consent from one founding marriage.

**M3. 1700 seismic displacement:** identify surviving coastal communities and inland relocation zones, approximate scale of loss, changed harbor property rights and reconstruction dates.

### Tier 2: population and economic chronology [U/W]
**M4. Population checkpoints:** choose plausible ranges for 1608, 1650, 1700, 1750, 1810, 1850, 1880, 1900, 1920, 1950, 1980 and 2026; distinguish Indigenous, city, rural and regional populations; do not confuse settlers with total residents. **No counts are proposed as facts yet.**

**M5. Migration ledgers:** record separate inflows and outflows for Venetians, Connecticut/Virginia elites, miners, timber and cannery labor, Blackwood villages, Wyoming ranchers and later migrants. Quantify only with documented fictional in-world ledgers and an internally consistent demographic model.

**M6. Work chronology:** when did hard-rock gold mining begin in Willowwick, timber expand, industrial salmon canning appear, the chief creameries/fairgrounds and tourism economy develop? Align migration causality with actual job openings and transport.

**M7. Route feasibility:** ocean crossings, riverboats (only safely navigable reaches), wagon roads, eventual railway, road passes and hazardous coast route. No casual direct ocean shipping from inland Willowwick.

### Tier 3: named communities and households [U/W]
**M8. Venetian founders:** exact year, surnames and distinct merchant versus working-class arrivals.
**M9. Willowwick capital:** arrival years, biographies and family connections of Ashcroft, Blackthorn, Whitcomb, Bellamy and Vale, without assuming all originate from one U.S. state.
**M10. Blackwood settlement:** dates and exact roots of Glenmorrow, Valea Argintie and Starý Brod (all presently proposed names); avoid fake Indigenous language or ungrounded ancient European ancestry.
**M11. Ranch dynasties:** Wyoming places of origin, household migrations, ranch land acquisition and cattle breeds. The 1886–87 winter is a real push factor **candidate**, not an invented newspaper article already established.
**M12. Asian/Pacific and other working communities:** household histories, legal discrimination, mutual aid and participation in civic life, not just labor categories or garden decoration.
**M13. Modern mobility:** labor recruitment, outmigration, post-1965 communities, seasonal work and internal inequality.

## Data structure for a future interactive migration atlas (schema proposal, NOT implemented)

A migration event should be a distinct data entity, with stable ID and fields:

```json
{
  "id": "wave-venetian-merchants",
  "name": "Venetian maritime and craft influx",
  "date_start": 1815,
  "date_end": 1855,
  "date_status": "working",
  "origin": ["Venice / Veneto"],
  "destinations": ["Santa Aurelia"],
  "migration_modes": ["maritime", "chain-migration", "trade"],
  "drivers": ["shipping", "merchant investment", "craft commissions"],
  "scale": null,
  "status": "established-pattern-working-dates",
  "source_docs": ["docs/02-history-and-timeline.md", "docs/03-santa-aurelia.md"],
  "legal_context_status": "unresolved",
  "notes": "No population count or verified historical real-world wave"
}
```

Use separate links from each event to **people/families, settlements, industries, laws and institutions**. The present Living Atlas does not yet have this specialized schema, and this document **does not claim it was coded**.

## Quality gates for later additions
- Every migration has **a time interval or explicit unknown**, a source of people, a destination, a motive and a status.
- No single person is counted twice because of internal relocation, marriage or seasonal movement.
- The colonial founding fleet count remains **67 total manifest-listed voyagers, not 67 Spanish adult settlers**.
- The Indian/Indigenous baseline is not “zero before 1608.”
- The 1700 disaster does not erase the port.
- Venice → primarily Santa Aurelia; Connecticut/Virginia → primarily Willowwick; Wyoming ranchers → suitable agricultural valleys; Irish/Scottish/Romanian/Slavic → prominent Blackwood margins.
- “Endemic” refers to native species; animal introductions (sika, wallabies), Blacksilver cuttings and human ethnic immigration are separate ledgers.
- Each real-world citation is labeled **external analogue**, never counterfeit archival proof.
- No made-up migration percentages, census totals, first-railroad dates, legal acts or ethnic enclaves are asserted as fixed facts.

## Immediate research priorities
1. Draft **political succession scenarios** to resolve the empire-to-state problem.
2. Build a conservative **population interval model** before naming more migration wave sizes.
3. Add **household migration records** only for already established families first, with validated chronology.
4. Then build optional interactive atlas filters by period, origin and destination, using the above schema and linking back to documented canon.

## Updated decision M1 — resolved model, open instruments
**The political-succession model is revised and established** in [The Long Independence](../37-political-succession-1608-1859.md): de facto local self-government becomes dominant during the seventeenth/eighteenth centuries; Spain's weakening diplomatic claim ends through the 1819/1821 Adams–Onís settlement without a handover of active city administration; Santa Aurelia negotiates its transition to **Oregon Territory in 1848**, followed by 1859 statehood. **Still requiring development:** the local government's autonomy chronology and 1843–1848 civic compact text, British trade arrangements, city council/electoral procedures, legal handling of mixed Spanish-era claims, federal naturalization and Indigenous sovereignty. This subsection supersedes the original Tier 1 M1 sentence calling the entire transition unselected; the unresolved parts are now implementation, not whether or when U.S. control begins.
