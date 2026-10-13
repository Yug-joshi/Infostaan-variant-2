import { ALL_SEARCH_RESULTS } from '../data/mockData';
import { FYJC_CUTOFFS } from '../data/fyjcCutoffs';
import { getAllColleges } from '../lib/collegeData';
import {
  CANONICAL_REGIONS,
  CanonicalRegion,
  resolveCanonicalRegion,
  resolveItemCanonicalRegion,
  getCollegeRegion,
  LOCALITY_ZONES,
  stripRailwayCorridors,
} from '../lib/categoryFilters';
import { COLLEGE_PROFILES } from '../lib/recommendationEngine';

console.log('========================================================================');
console.log('              INFOSTAAN COMPREHENSIVE LOCATION AUDIT REPORT             ');
console.log('========================================================================\n');

// ── 1. COLLEGE_PROFILES (Used by /help-me-decide) ─────────────────────────────
console.log('1. AUDIT OF COLLEGE_PROFILES (Help Me Decide Source Candidates):');
console.log(`   Total profiles: ${COLLEGE_PROFILES.length}`);
const profileRegions: Record<string, number> = {
  'South Mumbai': 0,
  'Western Suburbs': 0,
  'Central Suburbs': 0,
  'Eastern Suburbs': 0,
  'Harbour / Central-East': 0,
  'Unresolved': 0,
};
COLLEGE_PROFILES.forEach((p) => {
  const reg = p.canonicalRegion || 'Unresolved';
  profileRegions[reg] = (profileRegions[reg] || 0) + 1;
});
console.log('   Distribution by region:', profileRegions);
console.log('');

// ── 2. ALL_SEARCH_RESULTS Curated Colleges ────────────────────────────────────
console.log('2. AUDIT OF ALL_SEARCH_RESULTS (Curated Colleges):');
const searchColleges = ALL_SEARCH_RESULTS.filter((i) => i.category === 'colleges');
console.log(`   Total curated colleges: ${searchColleges.length}`);
const searchRegions: Record<string, number> = {
  'South Mumbai': 0,
  'Western Suburbs': 0,
  'Central Suburbs': 0,
  'Eastern Suburbs': 0,
  'Harbour / Central-East': 0,
  'Unresolved': 0,
};
searchColleges.forEach((c) => {
  const reg = resolveItemCanonicalRegion(c) || 'Unresolved';
  searchRegions[reg] = (searchRegions[reg] || 0) + 1;
});
console.log('   Distribution by region:', searchRegions);
console.log('');

// ── 3. FYJC_CUTOFFS (Raw FYJC Cutoff Database) ─────────────────────────────────
console.log('3. AUDIT OF FYJC_CUTOFFS (Raw Records):');
console.log(`   Total cutoff entries: ${FYJC_CUTOFFS.length}`);
const uniqueFyjcNames = new Set(FYJC_CUTOFFS.map((c) => c.collegeName.trim()));
console.log(`   Unique college names in cutoffs: ${uniqueFyjcNames.size}`);

const fyjcNameRegions: Record<string, number> = {
  'South Mumbai': 0,
  'Western Suburbs': 0,
  'Central Suburbs': 0,
  'Eastern Suburbs': 0,
  'Harbour / Central-East': 0,
  'Unresolved': 0,
};
const harbourFyjcColleges: string[] = [];
uniqueFyjcNames.forEach((name) => {
  const reg = resolveCanonicalRegion(name);
  if (reg) {
    fyjcNameRegions[reg] = (fyjcNameRegions[reg] || 0) + 1;
    if (reg === 'Harbour / Central-East') {
      harbourFyjcColleges.push(name);
    }
  } else {
    fyjcNameRegions['Unresolved']++;
  }
});
console.log('   Distribution of unique FYJC college names by resolved region:', fyjcNameRegions);
console.log(`   Total Harbour / Central-East colleges in FYJC: ${harbourFyjcColleges.length}`);
console.log('   Sample Harbour FYJC colleges:');
harbourFyjcColleges.slice(0, 10).forEach((name) => console.log(`     • ${name}`));
console.log('');

// ── 4. getAllColleges() (Unified Mumbai College Catalog) ──────────────────────
console.log('4. AUDIT OF getAllColleges() (Unified Institutional Catalog):');
const allUnifiedColleges = getAllColleges();
console.log(`   Total unique unified colleges: ${allUnifiedColleges.length}`);

const unifiedRegions: Record<string, number> = {
  'South Mumbai': 0,
  'Western Suburbs': 0,
  'Central Suburbs': 0,
  'Eastern Suburbs': 0,
  'Harbour / Central-East': 0,
  'Unresolved': 0,
};
const conflictingColleges: { title: string; badgeRegion: string; nameRegion: string }[] = [];
const harbourUnified: any[] = [];

allUnifiedColleges.forEach((c) => {
  const reg = resolveItemCanonicalRegion(c);
  if (reg) {
    unifiedRegions[reg] = (unifiedRegions[reg] || 0) + 1;
    if (reg === 'Harbour / Central-East') {
      harbourUnified.push(c);
    }
  } else {
    unifiedRegions['Unresolved']++;
  }

  // Check for conflicting region assignments (badge vs title)
  const badgeReg = c.badgeSub ? resolveCanonicalRegion(c.badgeSub) : null;
  const titleReg = resolveCanonicalRegion(c.title);
  if (badgeReg && titleReg && badgeReg !== titleReg) {
    conflictingColleges.push({
      title: c.title,
      badgeRegion: badgeReg,
      nameRegion: titleReg,
    });
  }
});

console.log('   Distribution by verified canonical region:', unifiedRegions);
console.log(`   Colleges with verified geographic regions: ${allUnifiedColleges.length - unifiedRegions['Unresolved']}`);
console.log(`   Colleges with unresolved locations: ${unifiedRegions['Unresolved']}`);
console.log(`   Colleges with conflicting region assignments: ${conflictingColleges.length}`);
if (conflictingColleges.length > 0) {
  conflictingColleges.forEach((conf) => {
    console.log(`     CONFLICT: ${conf.title} -> Badge: ${conf.badgeRegion} vs Title: ${conf.nameRegion}`);
  });
}
console.log(`   Total Harbour / Central-East unified colleges: ${harbourUnified.length}`);
console.log('   Sample Harbour unified colleges:');
harbourUnified.slice(0, 10).forEach((c) => {
  console.log(`     • ${c.title} (slug: ${c.slug || c.collegeId})`);
});
console.log('');

// ── 5. REGION-BY-REGION BREAKDOWN FOR REPORT ──────────────────────────────────
console.log('5. REGION-BY-REGION COVERAGE SUMMARY TABLE:');
console.log('--------------------------------------------------------------------------------------');
console.log('Region                   | Curated Search | Recommendation | FYJC Unique | Unified Total');
console.log('--------------------------------------------------------------------------------------');
CANONICAL_REGIONS.forEach((region) => {
  const pad = (s: string | number, n: number) => String(s).padEnd(n);
  console.log(
    `${pad(region, 25)}| ${pad(searchRegions[region] || 0, 15)}| ${pad(profileRegions[region] || 0, 15)}| ${pad(fyjcNameRegions[region] || 0, 12)}| ${unifiedRegions[region] || 0}`
  );
});
console.log('--------------------------------------------------------------------------------------');
console.log(`Unresolved / All Mumbai  | ${'0'.padEnd(15)}| ${'0'.padEnd(15)}| ${String(fyjcNameRegions['Unresolved']).padEnd(12)}| ${unifiedRegions['Unresolved']}`);
console.log('--------------------------------------------------------------------------------------');
console.log(`Total                    | ${String(searchColleges.length).padEnd(15)}| ${String(COLLEGE_PROFILES.length).padEnd(15)}| ${String(uniqueFyjcNames.size).padEnd(12)}| ${allUnifiedColleges.length}`);
console.log('--------------------------------------------------------------------------------------\n');
