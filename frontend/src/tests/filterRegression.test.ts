import { ALL_SEARCH_RESULTS } from '../data/mockData';
import { searchInfostaan } from '../lib/searchEngine';
import {
  applyStreamFilter,
  applyLevelFilter,
  matchCourseDiscipline,
  matchItemLevel,
} from '../lib/categoryFilters';
import { SearchResultItem } from '../types';

function runTests() {
  console.log('--- Running Course Filter Regression Tests ---');
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

  const allCourses = searchInfostaan('', 'courses');
  assert(allCourses.length === 7, 'Dataset contains 7 courses in total');

  // Test 1: Selecting Data Science & IT excludes unrelated BBI and BAMMC records
  const dataScienceOnly = applyStreamFilter(allCourses, 'Data Science & IT');
  const dsTitles = dataScienceOnly.map((c) => c.title);
  assert(
    !dsTitles.some((t) => t.includes('Banking & Insurance') || t.includes('BBI')),
    'Data Science & IT excludes Bachelor of Banking & Insurance (BBI)',
  );
  assert(
    !dsTitles.some((t) => t.includes('Multimedia') || t.includes('BAMMC')),
    'Data Science & IT excludes B.A. in Multimedia & Mass Communication (BAMMC)',
  );
  assert(
    !dsTitles.some((t) => t.includes('Bachelor of Accounting & Finance')),
    'Data Science & IT excludes Bachelor of Accounting & Finance (BAF)',
  );
  assert(
    !dsTitles.some((t) => t.includes('Bachelor of Management Studies')),
    'Data Science & IT excludes Bachelor of Management Studies (BMS)',
  );

  // Test 2: Relevant Data Science and IT records remain available
  assert(
    dsTitles.includes('B.Sc Data Science & Analytics') &&
      dsTitles.includes('B.Sc Information Technology (B.Sc IT)'),
    'Relevant Data Science and IT records (B.Sc Data Science & Analytics, B.Sc IT) remain available',
  );
  assert(dataScienceOnly.length === 2, 'Data Science & IT returns exactly 2 records');

  // Test 3: Selecting All Fields restores unrestricted selection
  const allFieldsResults = applyStreamFilter(allCourses, 'All Fields');
  const nullFieldResults = applyStreamFilter(allCourses, null);
  assert(
    allFieldsResults.length === allCourses.length && nullFieldResults.length === allCourses.length,
    'Selecting All Fields restores the unrestricted field selection',
  );

  // Test 4: Selecting Commerce & Accounting returns matching records
  const commerceResults = applyStreamFilter(allCourses, 'Commerce & Accounting');
  const commTitles = commerceResults.map((c) => c.title);
  assert(
    commTitles.includes('Bachelor of Accounting & Finance (BAF)'),
    'Commerce & Accounting includes BAF',
  );
  assert(
    commTitles.includes('Bachelor of Banking & Insurance (BBI)'),
    'Commerce & Accounting includes BBI',
  );
  assert(
    !commTitles.includes('B.Sc Data Science & Analytics') &&
      !commTitles.includes('B.A. in Multimedia & Mass Communication (BAMMC)'),
    'Commerce & Accounting excludes Data Science, IT, and BAMMC',
  );

  // Test 5: Selecting Finance & Markets returns matching records
  const financeResults = applyStreamFilter(allCourses, 'Finance & Markets');
  const finTitles = financeResults.map((c) => c.title);
  assert(
    finTitles.includes('Bachelor of Financial Markets (BFM)') &&
      finTitles.includes('Bachelor of Accounting & Finance (BAF)') &&
      finTitles.includes('Bachelor of Banking & Insurance (BBI)'),
    'Finance & Markets includes BFM, BAF, and BBI',
  );
  assert(
    !finTitles.includes('B.Sc Data Science & Analytics') &&
      !finTitles.includes('B.Sc Information Technology (B.Sc IT)'),
    'Finance & Markets excludes Data Science and IT',
  );

  // Test 6: Selecting Management & Leadership returns matching records
  const mgmtResults = applyStreamFilter(allCourses, 'Management & Leadership');
  const mgmtTitles = mgmtResults.map((c) => c.title);
  assert(
    mgmtTitles.includes('Bachelor of Management Studies (BMS)') && mgmtResults.length === 1,
    'Management & Leadership returns BMS exclusively',
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Specific Audit of 6 Combinations (Step 4)
  // ─────────────────────────────────────────────────────────────────────────

  // Combination A: Data Science & IT + All Levels
  const comboA = applyLevelFilter(applyStreamFilter(allCourses, 'Data Science & IT'), 'All Levels');
  assert(
    comboA.length === 2 &&
      comboA.every((c) => ['B.Sc Data Science & Analytics', 'B.Sc Information Technology (B.Sc IT)'].includes(c.title)),
    'Combo A: Data Science & IT + All Levels returns exactly 2 records',
  );

  // Combination B: All Fields + Diploma & Certifications
  const comboB = applyLevelFilter(applyStreamFilter(allCourses, 'All Fields'), 'Diploma & Certifications');
  assert(
    comboB.length === 0,
    'Combo B: All Fields + Diploma & Certifications returns 0 records (dataset contains only undergraduate degrees)',
  );

  // Combination C: Data Science & IT + Diploma & Certifications
  const comboC = applyLevelFilter(applyStreamFilter(allCourses, 'Data Science & IT'), 'Diploma & Certifications');
  assert(
    comboC.length === 0,
    'Combo C: Data Science & IT + Diploma & Certifications returns 0 records (no diploma records in dataset)',
  );

  // Combination D: Data Science & IT + Undergraduate Degree
  const comboD = applyLevelFilter(applyStreamFilter(allCourses, 'Data Science & IT'), 'Undergraduate Degree');
  assert(
    comboD.length === 2 &&
      comboD.every((c) => ['B.Sc Data Science & Analytics', 'B.Sc Information Technology (B.Sc IT)'].includes(c.title)),
    'Combo D: Data Science & IT + Undergraduate Degree returns exactly 2 records',
  );

  // Combination E: Data Science & IT + Professional Qualification
  const comboE = applyLevelFilter(applyStreamFilter(allCourses, 'Data Science & IT'), 'Professional Qualification (CA/CS/CMA)');
  assert(
    comboE.length === 0,
    'Combo E: Data Science & IT + Professional Qualification returns 0 records',
  );

  // Combination F: Genuinely empty combination
  const comboF = applyLevelFilter(applyStreamFilter(allCourses, 'Management & Leadership'), 'Diploma & Certifications');
  assert(
    comboF.length === 0,
    'Combo F: Management & Leadership + Diploma & Certifications returns 0 records without leaking unrelated courses',
  );

  // Test 7: Legacy URL parameter normalization
  const multiFilteredLegacy = applyLevelFilter(
    applyStreamFilter(allCourses, 'Data Science & IT'),
    'Undergraduate Degree (B.Com/BMS/BAF)',
  );
  assert(
    multiFilteredLegacy.length === 2,
    'Legacy URL parameter Undergraduate Degree (B.Com/BMS/BAF) properly normalizes and matches undergraduate courses',
  );

  // Test 8: Clearing and Reset
  const clearedStream = applyStreamFilter(allCourses, null);
  const clearedLevel = applyLevelFilter(clearedStream, null);
  assert(
    clearedLevel.length === allCourses.length,
    'Clearing all filters returns all courses',
  );

  // Test 9: URL Query parameter parsing and decoding
  const testUrlParams = new URLSearchParams('stream=Data+Science+%26+IT&level=Diploma+%26+Certifications');
  const parsedStream = testUrlParams.get('stream');
  const parsedLevel = testUrlParams.get('level');
  assert(
    parsedStream === 'Data Science & IT' && parsedLevel === 'Diploma & Certifications',
    'URLSearchParams correctly decodes "Data+Science+%26+IT" and "Diploma+%26+Certifications"',
  );

  // Test 10: Future-proof qualification matching on simulated diploma & certificate items
  const mockDiplomaCourse: SearchResultItem = {
    id: 'test-dip-1',
    category: 'courses',
    badgeCategory: 'COURSE',
    badgeSub: '1-Year Diploma',
    title: 'Post Graduate Diploma in Data Science & AI',
    whyRelevant: 'Practical industry certification in predictive modeling and deep learning.',
    meta: ['Affiliated to Mumbai IT Hub'],
    tagColor: 'secondary',
    actionLabel: 'View details',
    discipline: ['Data Science & IT'],
    qualificationLevel: 'Diploma & Certifications',
    courseFamily: 'Diploma in Data Science',
  };

  assert(
    matchItemLevel(mockDiplomaCourse, 'Diploma & Certifications'),
    'matchItemLevel correctly matches qualificationLevel "Diploma & Certifications"',
  );
  assert(
    matchCourseDiscipline(mockDiplomaCourse, 'Data Science & IT'),
    'matchCourseDiscipline correctly matches discipline "Data Science & IT"',
  );
  assert(
    applyLevelFilter([mockDiplomaCourse], 'Diploma & Certifications').length === 1,
    'applyLevelFilter returns simulated diploma course when selected',
  );

  // Test 11: Verification that college names in metadata do not cause false course classification
  const bbi = allCourses.find((c) => c.id === 'res-17');
  const bammc = allCourses.find((c) => c.id === 'res-18');
  assert(
    bbi !== undefined && !matchCourseDiscipline(bbi, 'Data Science & IT'),
    'BBI metadata containing "Mithibai" does not falsely match Data Science & IT',
  );
  assert(
    bammc !== undefined && !matchCourseDiscipline(bammc, 'Data Science & IT'),
    'BAMMC metadata containing "Mithibai" does not falsely match Data Science & IT',
  );

  console.log(`\nResults: ${passed}/${total} tests passed.`);
  if (passed !== total) {
    process.exit(1);
  }
}

runTests();
