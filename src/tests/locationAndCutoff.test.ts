import { ALL_SEARCH_RESULTS } from '../data/mockData';
import { FYJC_CUTOFFS } from '../data/fyjcCutoffs';
import {
  CANONICAL_REGIONS,
  getCollegeRegion,
  matchItemRegion,
  resolveItemCanonicalRegion,
  resolveCanonicalRegion,
  parseMultiValue,
} from '../lib/categoryFilters';
import {
  getAllColleges,
  getCollegeCutoffGroup,
  getCollegeGroupingKey,
  CURATED_COLLEGE_CODES,
} from '../lib/collegeData';

function runTests() {
  console.log('=== Running Location Filtering & Cutoff Integration Regression Tests ===\n');
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`PASS [${total}]: ${testName}`);
      passed++;
    } else {
      console.error(`FAIL [${total}]: ${testName}`);
      process.exitCode = 1;
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // PART 1: LOCATION FILTERING REGRESSION TESTS
  // ───────────────────────────────────────────────────────────────────────────

  console.log('--- 1. Canonical Region Classification & Boundaries ---');

  // Test 1: SIES in Sion does NOT match South Mumbai (prevents "South Indian" substring bug)
  const sies = ALL_SEARCH_RESULTS.find((i) => i.collegeId === 'sies-college')!;
  assert(Boolean(sies), 'SIES College exists in mock data');
  assert(
    !matchItemRegion(sies, 'South Mumbai'),
    'SIES College does NOT match "South Mumbai" despite having "South" in society trust name'
  );
  assert(
    matchItemRegion(sies, 'Central Suburbs'),
    'SIES College correctly matches "Central Suburbs"'
  );

  // Test 2: Ruparel in Matunga/Dadar West does NOT match South Mumbai (prevents "PAREL" substring bug)
  const ruparel = ALL_SEARCH_RESULTS.find((i) => i.collegeId === 'ruparel-college')!;
  assert(Boolean(ruparel), 'Ruparel College exists in mock data');
  assert(
    !matchItemRegion(ruparel, 'South Mumbai'),
    'D.G. Ruparel College does NOT match "South Mumbai" (prevents "PAREL" inside "RUPAREL" false match)'
  );
  assert(
    matchItemRegion(ruparel, 'Central Suburbs'),
    'D.G. Ruparel College correctly matches "Central Suburbs"'
  );

  // Test 3: Central Suburbs colleges do NOT match Western Suburbs (prevents "SUBURBS" substring bug)
  assert(
    !matchItemRegion(ruparel, 'Western Suburbs'),
    'Ruparel in Central Suburbs does NOT match "Western Suburbs" (prevents generic "SUBURBS" false match)'
  );
  assert(
    !matchItemRegion(sies, 'Western Suburbs'),
    'SIES in Central Suburbs does NOT match "Western Suburbs"'
  );

  // Test 4: Railway lines (e.g. "Western Line") in transit metadata do not falsely map Central colleges to Western Suburbs
  const podar = ALL_SEARCH_RESULTS.find((i) => i.collegeId === 'podar')!;
  assert(Boolean(podar), 'Podar College exists in mock data');
  assert(
    matchItemRegion(podar, 'Central Suburbs'),
    'Podar College in Matunga correctly matches "Central Suburbs"'
  );
  assert(
    !matchItemRegion(podar, 'Western Suburbs'),
    'Podar College does NOT match "Western Suburbs"'
  );
  assert(
    !matchItemRegion(podar, 'South Mumbai'),
    'Podar College does NOT match "South Mumbai"'
  );

  // Test 5: South Mumbai verified colleges match South Mumbai and ONLY South Mumbai
  const hrCollege = ALL_SEARCH_RESULTS.find((i) => i.collegeId === 'hr-college')!;
  const xaviers = ALL_SEARCH_RESULTS.find((i) => i.collegeId === 'xaviers')!;
  const hinduja = ALL_SEARCH_RESULTS.find((i) => i.collegeId === 'hinduja')!;
  const jaiHind = ALL_SEARCH_RESULTS.find((i) => i.collegeId === 'jai-hind')!;
  const sophia = ALL_SEARCH_RESULTS.find((i) => i.collegeId === 'sophia-college')!;
  const wilson = ALL_SEARCH_RESULTS.find((i) => i.collegeId === 'wilson-college')!;
  const mdCollege = ALL_SEARCH_RESULTS.find((i) => i.collegeId === 'md-college')!;

  const southColleges = [hrCollege, xaviers, hinduja, jaiHind, sophia, wilson, mdCollege];
  southColleges.forEach((c) => {
    assert(
      matchItemRegion(c, 'South Mumbai'),
      `Verified South Mumbai college "${c.title}" matches "South Mumbai"`
    );
    assert(
      !matchItemRegion(c, 'Western Suburbs'),
      `South Mumbai college "${c.title}" does NOT match "Western Suburbs"`
    );
    assert(
      !matchItemRegion(c, 'Central Suburbs'),
      `South Mumbai college "${c.title}" does NOT match "Central Suburbs"`
    );
  });

  // Test 6: Western Suburbs verified colleges
  const mithibai = ALL_SEARCH_RESULTS.find((i) => i.collegeId === 'mithibai')!;
  const bhavans = ALL_SEARCH_RESULTS.find((i) => i.collegeId === 'bhavans-college')!;
  const dahanukar = ALL_SEARCH_RESULTS.find((i) => i.collegeId === 'dahanukar-college')!;
  const rizvi = ALL_SEARCH_RESULTS.find((i) => i.collegeId === 'rizvi-college')!;
  const khandwala = ALL_SEARCH_RESULTS.find((i) => i.collegeId === 'nagindas-khandwala')!;
  const shroff = ALL_SEARCH_RESULTS.find((i) => i.collegeId === 'kes-shroff')!;

  const westernColleges = [mithibai, bhavans, dahanukar, rizvi, khandwala, shroff];
  westernColleges.forEach((c) => {
    assert(
      matchItemRegion(c, 'Western Suburbs'),
      `Verified Western Suburbs college "${c.title}" matches "Western Suburbs"`
    );
    assert(
      !matchItemRegion(c, 'South Mumbai'),
      `Western Suburbs college "${c.title}" does NOT match "South Mumbai"`
    );
    assert(
      !matchItemRegion(c, 'Central Suburbs'),
      `Western Suburbs college "${c.title}" does NOT match "Central Suburbs"`
    );
  });

  // Test 7: Eastern Suburbs (Vaze College in Mulund)
  const vaze = ALL_SEARCH_RESULTS.find((i) => i.collegeId === 'vaze-college')!;
  assert(Boolean(vaze), 'Vaze College exists in mock data');
  assert(
    matchItemRegion(vaze, 'Eastern Suburbs'),
    'Vaze College in Mulund correctly matches "Eastern Suburbs"'
  );
  assert(
    !matchItemRegion(vaze, 'Western Suburbs'),
    'Vaze College does NOT match "Western Suburbs"'
  );

  // Test 8: All Mumbai matches all colleges
  ALL_SEARCH_RESULTS.filter((i) => i.category === 'colleges').forEach((c) => {
    assert(
      matchItemRegion(c, 'All Mumbai'),
      `"All Mumbai" filter correctly includes "${c.title}"`
    );
  });

  // Test 9: Multi-Region selection (OR logic within region)
  const multiRegion = 'South Mumbai, Central Suburbs';
  assert(
    matchItemRegion(hrCollege, multiRegion) && matchItemRegion(ruparel, multiRegion),
    'Multi-region "South Mumbai, Central Suburbs" includes both HR College and Ruparel'
  );
  assert(
    !matchItemRegion(mithibai, multiRegion),
    'Multi-region "South Mumbai, Central Suburbs" excludes Mithibai (Western Suburbs)'
  );

  // Test 10: Unresolved location handling (excluded from restrictive filters, present in All Mumbai)
  const unresolvedCollege = {
    title: 'Generic Academic Trust College',
    badgeSub: 'Mumbai Region',
    meta: ['Affiliated to University'],
  };
  assert(
    !matchItemRegion(unresolvedCollege, 'South Mumbai'),
    'Unresolved location is excluded from "South Mumbai"'
  );
  assert(
    !matchItemRegion(unresolvedCollege, 'Western Suburbs'),
    'Unresolved location is excluded from "Western Suburbs"'
  );
  assert(
    matchItemRegion(unresolvedCollege, 'All Mumbai'),
    'Unresolved location is preserved in "All Mumbai"'
  );

  // ───────────────────────────────────────────────────────────────────────────
  // PART 2: FYJC CUTOFF LOOKUP & IDENTITY RESOLUTION TESTS
  // ───────────────────────────────────────────────────────────────────────────

  console.log('\n--- 2. FYJC Cutoff Lookup & Identity Resolution ---');

  // Verify all 19 curated colleges with cutoffs in the dataset resolve properly
  const curatedCollegesToVerify = [
    { id: 'mithibai', name: 'Mithibai College', expectedStreams: ['Arts', 'Commerce', 'Science'] },
    { id: 'hr-college', name: 'H.R. College', expectedStreams: ['Commerce'] },
    { id: 'xaviers', name: "St. Xavier's College", expectedStreams: ['Arts', 'Commerce', 'Science'] },
    { id: 'hinduja', name: 'K.P.B. Hinduja College', expectedStreams: ['Commerce'] },
    { id: 'podar', name: 'R.A. Podar College', expectedStreams: ['Commerce'] },
    { id: 'jai-hind', name: 'Jai Hind College', expectedStreams: ['Arts', 'Commerce', 'Science'] },
    { id: 'nm-college', name: 'Narsee Monjee College', expectedStreams: ['Commerce'] },
    { id: 'sies-college', name: 'SIES College', expectedStreams: ['Arts', 'Commerce', 'Science'] },
    { id: 'bhavans-college', name: "Bhavan's College", expectedStreams: ['Arts', 'Commerce', 'Science'] },
    { id: 'dahanukar-college', name: 'M.L. Dahanukar College', expectedStreams: ['Commerce'] },
    { id: 'somaiya-college', name: 'K.J. Somaiya College', expectedStreams: ['Arts', 'Commerce', 'Science'] },
    { id: 'sophia-college', name: 'Sophia College', expectedStreams: ['Arts', 'Science'] },
    { id: 'wilson-college', name: 'Wilson College', expectedStreams: ['Arts', 'Commerce', 'Science'] },
    { id: 'ruparel-college', name: 'D.G. Ruparel College', expectedStreams: ['Arts', 'Commerce', 'Science'] },
    { id: 'rizvi-college', name: 'Rizvi College', expectedStreams: ['Arts', 'Commerce', 'Science'] },
    { id: 'vaze-college', name: 'V.G. Vaze College', expectedStreams: ['Arts', 'Commerce', 'Science'] },
    { id: 'md-college', name: 'M.D. College (Parel)', expectedStreams: ['Arts', 'Commerce', 'Science'] },
    { id: 'kc-college', name: 'K.C. College', expectedStreams: ['Arts', 'Commerce', 'Science'] },
    { id: 'ruia', name: 'Ramnarain Ruia College', expectedStreams: ['Arts', 'Commerce', 'Science'] },
  ];

  curatedCollegesToVerify.forEach(({ id, name, expectedStreams }) => {
    const cutoffs = getCollegeCutoffGroup(id);
    assert(
      Boolean(cutoffs && cutoffs.length > 0),
      `Cutoff data found for "${name}" (slug: "${id}")`
    );
    if (cutoffs) {
      const streams = Array.from(new Set(cutoffs.map((c) => c.stream)));
      expectedStreams.forEach((st) => {
        assert(
          streams.includes(st),
          `"${name}" includes verified stream "${st}" (all streams: ${streams.join(', ')})`
        );
      });
      const validNumbers = cutoffs.every(
        (c) => typeof c.cutoff === 'number' && !isNaN(c.cutoff) && c.cutoff > 0 && c.cutoff <= 100
      );
      assert(validNumbers, `All cutoffs for "${name}" are valid percentages between 0 and 100%`);
    }
  });

  // Verify colleges with separate autonomous/degree status return undefined cutoffs gracefully
  const autonomousWithoutFyjc = ['nagindas-khandwala', 'kes-shroff'];
  autonomousWithoutFyjc.forEach((slug) => {
    const cutoffs = getCollegeCutoffGroup(slug);
    assert(
      !cutoffs || cutoffs.length === 0,
      `Autonomous/Degree-only college "${slug}" has no fabricated FYJC records`
    );
  });

  // Verify getCollegeGroupingKey produces consistent single key per college
  const sampleCutoff = FYJC_CUTOFFS.find((c) => c.choiceCode?.startsWith('MU6719'))!;
  assert(
    getCollegeGroupingKey(sampleCutoff) === 'hr-college',
    'Choice code MU6719 properly resolves to grouping key "hr-college"'
  );

  const sampleRuparel = FYJC_CUTOFFS.find((c) => c.choiceCode?.startsWith('MU6768'))!;
  assert(
    getCollegeGroupingKey(sampleRuparel) === 'ruparel-college',
    'Choice code MU6768 properly resolves to grouping key "ruparel-college"'
  );

  const sampleSies = FYJC_CUTOFFS.find((c) => c.choiceCode?.startsWith('MU6831'))!;
  assert(
    getCollegeGroupingKey(sampleSies) === 'sies-college',
    'Choice code MU6831 properly resolves to grouping key "sies-college"'
  );

  const sampleMd = FYJC_CUTOFFS.find((c) => c.choiceCode?.startsWith('MU6798'))!;
  assert(
    getCollegeGroupingKey(sampleMd) === 'md-college',
    'Choice code MU6798 properly resolves to grouping key "md-college"'
  );

  // ───────────────────────────────────────────────────────────────────────────
  // PART 3: UNIFIED ALL COLLEGES GENERATION
  // ───────────────────────────────────────────────────────────────────────────

  console.log('\n--- 3. Unified College List Generation ---');
  const allColleges = getAllColleges();
  assert(allColleges.length > 500, `getAllColleges() generated ${allColleges.length} unique colleges`);

  // Verify no duplicate IDs or slugs in generated list
  const seenIds = new Set<string>();
  let hasDuplicate = false;
  for (const c of allColleges) {
    if (seenIds.has(c.id)) {
      hasDuplicate = true;
      break;
    }
    seenIds.add(c.id);
  }
  assert(!hasDuplicate, 'All colleges in unified listing have unique IDs');

  console.log(`\nResults: ${passed}/${total} tests passed.`);
  if (passed !== total) {
    process.exitCode = 1;
  }
}

runTests();
