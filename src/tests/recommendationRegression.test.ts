import {
  generateRecommendations,
  getRecommendationDiagnostics,
  normalizeLocationPreference,
} from '../lib/recommendationEngine';
import {
  CANONICAL_REGIONS,
  getCollegeRegion,
  matchItemRegion,
  resolveCanonicalRegion,
  resolveItemCanonicalRegion,
} from '../lib/categoryFilters';
import { ALL_SEARCH_RESULTS, getCollegeDetails } from '../data/mockData';

function runRecommendationRegressionTests() {
  console.log('=== Running Help Me Decide & College Location Regression Tests ===\n');
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
  // TEST A: Central Location Hard Constraint & All Eligible Colleges Returned
  // ───────────────────────────────────────────────────────────────────────────
  console.log('--- Test A: Central Location Hard Constraint & Full List ---');

  const centralRecs = generateRecommendations({
    stage: 'class12-commerce',
    interests: ['commerce-finance'],
    location: 'central',
    priority: 'ca-flexibility',
  });

  assert(centralRecs.length > 0, 'Central location query returns recommendations');
  assert(
    centralRecs.length === 4,
    'Central location query returns all 4 eligible colleges (no arbitrary 2-card limitation)'
  );
  assert(
    centralRecs.every((col) => col.canonicalRegion === 'Central Suburbs'),
    'Every returned college in Central query has canonicalRegion === "Central Suburbs"'
  );

  const centralIds = centralRecs.map((c) => c.id);
  assert(
    !centralIds.includes('hinduja'),
    'CRITICAL: K.P.B. Hinduja College is strictly EXCLUDED when Central location is selected'
  );
  assert(
    !centralIds.includes('hr-college'),
    'H.R. College (South Mumbai) is strictly EXCLUDED when Central location is selected'
  );
  assert(
    centralIds.includes('podar') &&
      centralIds.includes('sies-college') &&
      centralIds.includes('somaiya-college') &&
      centralIds.includes('ruparel-college'),
    'All 4 verified Central Suburbs colleges (Podar, SIES, Somaiya, Ruparel) are present'
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST B: South Mumbai Location Full Set
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n--- Test B: South Mumbai Location Full Set ---');

  const southRecs = generateRecommendations({
    stage: 'class12-commerce',
    interests: ['commerce-finance'],
    location: 'south-mumbai',
    priority: 'ca-flexibility',
  });

  assert(southRecs.length === 7, 'South Mumbai location returns all 7 eligible South Mumbai colleges');
  assert(
    southRecs.every((col) => col.canonicalRegion === 'South Mumbai'),
    'Every returned college in South Mumbai query has canonicalRegion === "South Mumbai"'
  );

  const southIds = southRecs.map((c) => c.id);
  assert(
    !southIds.includes('podar'),
    'R.A. Podar College (Central Suburbs) is strictly EXCLUDED when South Mumbai is selected'
  );
  assert(
    !southIds.includes('mithibai'),
    'Mithibai College (Western Suburbs) is strictly EXCLUDED when South Mumbai is selected'
  );
  assert(
    southIds.includes('hinduja') && southIds.includes('hr-college') && southIds.includes('jai-hind'),
    'Top South Mumbai colleges (Hinduja, HR, Jai Hind) are present in South Mumbai recommendations'
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST C: Western Suburbs Location Full Set
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n--- Test C: Western Suburbs Location Full Set ---');

  const westRecs = generateRecommendations({
    stage: 'class12-commerce',
    interests: ['commerce-finance'],
    location: 'western',
    priority: 'ca-flexibility',
  });

  assert(westRecs.length === 7, 'Western Suburbs location returns all 7 eligible Western Suburbs colleges');
  assert(
    westRecs.every((col) => col.canonicalRegion === 'Western Suburbs'),
    'Every returned college in Western Suburbs query has canonicalRegion === "Western Suburbs"'
  );

  const westIds = westRecs.map((c) => c.id);
  assert(
    !westIds.includes('hinduja'),
    'Hinduja College (South Mumbai) is EXCLUDED when Western Suburbs is selected'
  );
  assert(
    !westIds.includes('podar'),
    'Podar College (Central Suburbs) is EXCLUDED when Western Suburbs is selected'
  );
  assert(
    westIds.includes('nm-college') && westIds.includes('mithibai') && westIds.includes('bhavans-college'),
    'Western Suburbs colleges (NM, Mithibai, Bhavan\'s, Dahanukar, etc.) are all present'
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST D: Location vs. Railway Corridor Connectivity
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n--- Test D: Location vs. Railway Corridor Connectivity ---');

  const centralDiag = getRecommendationDiagnostics({
    stage: 'class12-commerce',
    interests: ['commerce-finance'],
    location: 'Central Railway Line',
    priority: 'ca-flexibility',
  });

  assert(
    centralDiag.normalizedRegion === 'Central Suburbs',
    '"Central Railway Line" input normalizes to canonical region "Central Suburbs"'
  );
  assert(
    centralDiag.remainingAfterLocationFilter === 4,
    'Exactly 4 verified candidate colleges remain in Central Suburbs'
  );
  assert(
    centralDiag.finalRecommendations.every((c) => c.canonicalRegion === 'Central Suburbs'),
    'Transport corridor wording cannot override canonical geographic boundary'
  );
  assert(
    !centralDiag.finalRecommendations.some((c) => c.id === 'hinduja'),
    'Hinduja is NOT included despite its historical label referencing Central Line commuters'
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST E: Empty Location Results (Honest Empty State)
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n--- Test E: Empty Location Results ---');

  const emptyDiag = getRecommendationDiagnostics({
    stage: 'class12-science',
    interests: ['tech-coding'],
    location: 'harbour',
    priority: 'placements',
  });

  assert(
    emptyDiag.normalizedRegion === 'Harbour / Central-East',
    'Location normalizes to "Harbour / Central-East"'
  );
  assert(
    emptyDiag.finalRecommendations.length === 0,
    'Returns honest empty recommendation array when no verified college profiles exist for region'
  );
  assert(
    !emptyDiag.finalRecommendations.some((c) => c.id === 'hinduja' || c.id === 'podar'),
    'Does NOT inject popular colleges from other regions when result is empty'
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST F: Changing the Selected Region Dynamically
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n--- Test F: Changing the Selected Region Dynamically ---');

  const baseQuery = {
    stage: 'class12-commerce',
    interests: ['commerce-finance'],
    priority: 'ca-flexibility',
  };

  const recsCentral = generateRecommendations({ ...baseQuery, location: 'central' });
  const recsSouth = generateRecommendations({ ...baseQuery, location: 'south-mumbai' });
  const recsWest = generateRecommendations({ ...baseQuery, location: 'western' });
  const recsEast = generateRecommendations({ ...baseQuery, location: 'eastern' });

  assert(
    recsCentral.some((c) => c.id === 'podar') && !recsCentral.some((c) => c.id === 'hinduja'),
    'Central selection yields Central colleges and zero South Mumbai colleges'
  );
  assert(
    recsSouth.some((c) => c.id === 'hinduja') && !recsSouth.some((c) => c.id === 'podar'),
    'Switching to South Mumbai yields Hinduja and removes Podar'
  );
  assert(
    recsWest.some((c) => c.canonicalRegion === 'Western Suburbs') &&
      !recsWest.some((c) => c.id === 'podar' || c.id === 'hinduja'),
    'Switching to Western yields Western Suburbs and removes Podar & Hinduja'
  );
  assert(
    recsEast.every((c) => c.canonicalRegion === 'Eastern Suburbs') &&
      recsEast.some((c) => c.id === 'vaze-college'),
    'Switching to Eastern Suburbs yields Vaze College in Mulund'
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST G: Academic Preferences vs Location Constraint
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n--- Test G: Academic Preferences vs Location Constraint ---');

  const westFest = generateRecommendations({
    stage: 'class12-commerce',
    interests: ['commerce-finance'],
    location: 'western',
    priority: 'fest',
  });

  const westCa = generateRecommendations({
    stage: 'class12-commerce',
    interests: ['commerce-finance'],
    location: 'western',
    priority: 'ca-flexibility',
  });

  assert(
    westFest[0].id === 'mithibai',
    'In Western Suburbs with "fest" priority, Mithibai (home of Umang) ranks top'
  );
  assert(
    westCa.every((c) => c.canonicalRegion === 'Western Suburbs') &&
      westFest.every((c) => c.canonicalRegion === 'Western Suburbs'),
    'Both fest and ca-flexibility priorities respect the Western Suburbs geographic boundary strictly'
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST H: College Detail Consistency & Canonical Resolution
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n--- Test H: College Detail Consistency ---');

  const testColleges = ['podar', 'hinduja', 'mithibai', 'hr-college', 'sies-college', 'vaze-college'];
  for (const cid of testColleges) {
    const details = getCollegeDetails(cid);
    assert(Boolean(details), `College detail loaded successfully for "${cid}"`);

    const resolvedZone = getCollegeRegion(details.location || details.badge || '');
    assert(
      resolvedZone !== 'All Mumbai',
      `College "${cid}" has resolved canonical zone: "${resolvedZone}"`
    );

    if (cid === 'podar') {
      assert(resolvedZone === 'Central Suburbs', 'Podar College detail resolves to Central Suburbs');
    } else if (cid === 'hinduja' || cid === 'hr-college') {
      assert(resolvedZone === 'South Mumbai', `College "${cid}" detail resolves to South Mumbai`);
    } else if (cid === 'mithibai') {
      assert(resolvedZone === 'Western Suburbs', 'Mithibai detail resolves to Western Suburbs');
    } else if (cid === 'sies-college') {
      assert(resolvedZone === 'Central Suburbs', 'SIES detail resolves to Central Suburbs');
    } else if (cid === 'vaze-college') {
      assert(resolvedZone === 'Eastern Suburbs', 'Vaze detail resolves to Eastern Suburbs');
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST I: General Listing Location Filtering Regression
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n--- Test I: General Listing Location Filtering Regression ---');

  const allColleges = ALL_SEARCH_RESULTS.filter((i) => i.category === 'colleges');
  assert(allColleges.length >= 10, 'Colleges listing contains testable college records');

  const southColleges = allColleges.filter((c) => matchItemRegion(c, 'South Mumbai'));
  assert(
    southColleges.every((c) => resolveItemCanonicalRegion(c) === 'South Mumbai'),
    'General filter for "South Mumbai" includes only verified South Mumbai colleges'
  );
  assert(
    !southColleges.some((c) => c.collegeId === 'podar' || c.collegeId === 'mithibai'),
    'General filter for "South Mumbai" excludes Podar and Mithibai'
  );

  const centralColleges = allColleges.filter((c) => matchItemRegion(c, 'Central Suburbs'));
  assert(
    centralColleges.every((c) => resolveItemCanonicalRegion(c) === 'Central Suburbs'),
    'General filter for "Central Suburbs" includes only Central Suburbs colleges'
  );
  assert(
    !centralColleges.some((c) => c.collegeId === 'hinduja' || c.collegeId === 'hr-college'),
    'General filter for "Central Suburbs" excludes Hinduja and HR College'
  );

  const westColleges = allColleges.filter((c) => matchItemRegion(c, 'Western Suburbs'));
  assert(
    westColleges.every((c) => resolveItemCanonicalRegion(c) === 'Western Suburbs'),
    'General filter for "Western Suburbs" includes only Western Suburbs colleges'
  );
  assert(
    !westColleges.some((c) => c.collegeId === 'hinduja' || c.collegeId === 'podar'),
    'General filter for "Western Suburbs" excludes Hinduja and Podar'
  );

  const unionColleges = allColleges.filter((c) =>
    matchItemRegion(c, 'Central Suburbs,South Mumbai')
  );
  assert(
    unionColleges.some((c) => c.collegeId === 'podar') &&
      unionColleges.some((c) => c.collegeId === 'hinduja'),
    'Multi-region filter "Central Suburbs,South Mumbai" returns union including Podar and Hinduja'
  );
  assert(
    !unionColleges.some((c) => c.collegeId === 'mithibai'),
    'Multi-region filter excludes colleges not in the selected union (Mithibai in Western Suburbs)'
  );

  const allMumbaiColleges = allColleges.filter((c) => matchItemRegion(c, 'All Mumbai'));
  assert(
    allMumbaiColleges.length === allColleges.length,
    '"All Mumbai" filter returns all colleges without exclusion'
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST J: All 19 Eligible Recommendations & Diagnostics Pipeline Accuracy
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n--- Test J: All 19 Eligible Recommendations & Diagnostics Pipeline ---');

  const allMumbaiDiag = getRecommendationDiagnostics({
    stage: 'class12-commerce',
    interests: ['commerce-finance'],
    location: 'all-mumbai',
    priority: 'ca-flexibility',
  });

  assert(
    allMumbaiDiag.initialCandidateCount === 19,
    'Diagnostic reports exactly 19 initial candidate colleges'
  );
  assert(
    allMumbaiDiag.remainingAfterLocationFilter === 19,
    'Diagnostic reports 19 colleges remaining after "All Mumbai" location filter'
  );
  assert(
    allMumbaiDiag.countAfterDeduplication === 19,
    'Diagnostic reports 19 colleges after strict deduplication'
  );
  assert(
    allMumbaiDiag.totalEligibleScored === 19,
    'Diagnostic reports 19 colleges scored and ranked'
  );
  assert(
    allMumbaiDiag.totalRendered === 19,
    'Diagnostic reports all 19 colleges rendered by default (no hidden colleges)'
  );
  assert(
    allMumbaiDiag.hiddenCount === 0,
    'Diagnostic reports 0 colleges hidden by default'
  );
  assert(
    allMumbaiDiag.finalRecommendations.length === 19,
    'All 19 eligible recommendations are returned without arbitrary 2-card limit'
  );

  // Verify deduplication
  const recIds = allMumbaiDiag.finalRecommendations.map((c) => c.id);
  const uniqueRecIds = new Set(recIds);
  assert(
    uniqueRecIds.size === recIds.length,
    'Result set contains zero duplicate college entries'
  );

  // Test intentional display limit behavior
  const limitedDiag = getRecommendationDiagnostics({
    stage: 'class12-commerce',
    interests: ['commerce-finance'],
    location: 'all-mumbai',
    priority: 'ca-flexibility',
    limit: 2,
  });

  assert(
    limitedDiag.totalEligibleScored === 19,
    'Limited query still accurately computes 19 total eligible colleges'
  );
  assert(
    limitedDiag.totalRendered === 2,
    'Limited query honors requested display limit of 2'
  );
  assert(
    limitedDiag.hiddenCount === 17,
    'Limited query accurately reports 17 colleges withheld by display limit'
  );

  // Test match rate calibration
  const matchRates = allMumbaiDiag.finalRecommendations.map((c) =>
    parseInt(c.matchRate.replace('% Match', ''), 10)
  );
  assert(
    matchRates[0] === 98,
    'Top ranked recommendation achieves calibrated 98% Match rate'
  );
  assert(
    matchRates.every((rate) => rate >= 75 && rate <= 98),
    'All recommendation match rates are calibrated within valid [75%, 98%] range'
  );

  console.log(`\n========================================`);
  console.log(`Recommendation Tests: ${passed}/${total} passed.`);
  console.log(`========================================\n`);

  if (passed !== total) {
    process.exitCode = 1;
  }
}

runRecommendationRegressionTests();
