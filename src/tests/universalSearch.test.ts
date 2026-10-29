import { searchInfostaan } from '../lib/searchEngine';
import { SearchResultItem } from '../types';

function runUniversalSearchTests() {
  console.log('--- Running Universal Search Regression Tests ---');
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

  // 1. College search
  const collegeResults = searchInfostaan('Mithibai', 'all');
  assert(collegeResults.length > 0, 'Universal search finds results for "Mithibai"');
  assert(collegeResults[0].title.toLowerCase().includes('mithibai'), 'Top result for "Mithibai" is the college itself');
  assert(collegeResults.some((r) => r.category === 'colleges'), 'Results include colleges category');

  // 2. Course search
  const courseResults = searchInfostaan('BAF', 'all');
  assert(courseResults.length > 0, 'Universal search finds results for "BAF"');
  assert(courseResults[0].title.includes('BAF') || courseResults[0].title.includes('Bachelor of Accounting'), 'Top result for "BAF" is the BAF degree');
  assert(courseResults.some((r) => r.category === 'courses'), 'Results include courses category');

  // 3. Career search
  const careerResults = searchInfostaan('Financial Analyst', 'all');
  assert(careerResults.length > 0, 'Universal search finds results for "Financial Analyst"');
  assert(careerResults[0].title === 'Financial Analyst', 'Top result for "Financial Analyst" is the career role');
  assert(careerResults.some((r) => r.category === 'careers'), 'Results include careers category');

  // 4. Coaching class search
  const classResults = searchInfostaan('Deep Classes', 'all');
  assert(classResults.length > 0, 'Universal search finds results for "Deep Classes"');
  assert(classResults[0].title.toLowerCase().includes('deep classes'), 'Top result for "Deep Classes" is the coaching institute');
  assert(classResults.some((r) => r.category === 'classes'), 'Results include classes category');
  assert(!!classResults[0].slug, 'Class result has valid slug for navigation');

  // 5. Cutoff document search
  const cutoffResults = searchInfostaan('Arts (Mumbai)', 'all');
  assert(cutoffResults.length > 0, 'Universal search finds results for "Arts (Mumbai)"');
  assert(cutoffResults.some((r) => r.category === 'cutoffs'), 'Results include cutoffs category');

  // 6. Educational PDF Resources search
  const pdfResults = searchInfostaan('Book Keeping', 'all');
  assert(pdfResults.length > 0, 'Universal search finds results for "Book Keeping"');
  const pdfItem = pdfResults.find((r) => r.category === 'pdf');
  assert(!!pdfItem, 'Results include educational PDF resources category');
  assert(pdfItem!.title.toLowerCase().includes('book keeping'), 'PDF title matches "Book Keeping"');
  assert(!!pdfItem!.slug, 'PDF item has valid slug for navigation');

  // 7. Multi-category coverage for broad terms
  const commerceResults = searchInfostaan('Commerce', 'all');
  const foundCategories = new Set(commerceResults.map((r) => r.category));
  assert(foundCategories.has('colleges'), 'Search for "Commerce" returns colleges');
  assert(foundCategories.has('courses'), 'Search for "Commerce" returns courses');
  assert(foundCategories.has('classes'), 'Search for "Commerce" returns coaching classes');
  assert(foundCategories.has('cutoffs'), 'Search for "Commerce" returns cutoffs');
  assert(foundCategories.has('pdf'), 'Search for "Commerce" returns educational PDF notes');

  // 8. Ranking: exact title match ranks above partial/metadata match
  const analystResults = searchInfostaan('Financial Analyst', 'all');
  assert(analystResults[0].title === 'Financial Analyst', 'Exact title "Financial Analyst" ranks at position #0');

  // 9. Case-insensitivity, trimming, and whitespace handling
  const messySearch = searchInfostaan('   mItHiBaI   cOlLeGe   ', 'all');
  assert(messySearch.length > 0, 'Case-insensitive search with extra padding whitespace succeeds');
  assert(messySearch[0].title.toLowerCase().includes('mithibai'), 'Messy query still ranks Mithibai at top');

  // 10. Category-specific filtering isolation
  const onlyCourses = searchInfostaan('', 'courses');
  assert(onlyCourses.length === 7, 'Category filter "courses" strictly returns only 7 courses');
  assert(onlyCourses.every((r) => r.category === 'courses'), 'All items in "courses" category are courses');

  const onlyPdf = searchInfostaan('', 'pdf');
  assert(onlyPdf.length > 0, 'Category filter "pdf" returns educational PDF resources');
  assert(onlyPdf.every((r) => r.category === 'pdf'), 'All items in "pdf" category are PDF resources');

  // 11. Empty state & non-matching queries
  const noMatches = searchInfostaan('xyznonexistentquery99999', 'all');
  assert(Array.isArray(noMatches) && noMatches.length === 0, 'Non-matching query safely returns empty array without throwing');

  const emptyQuery = searchInfostaan('', 'all');
  assert(Array.isArray(emptyQuery) && emptyQuery.length > 0, 'Empty query safely returns items without throwing');

  console.log(`\nResults: ${passed}/${total} universal search tests passed.`);
}

runUniversalSearchTests();
