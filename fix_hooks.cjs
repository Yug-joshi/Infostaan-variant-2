const fs = require('fs');
let content = fs.readFileSync('src/components/CollegeDetailScreen.tsx', 'utf8');

const target = `  // Available reservation categories for this college (only when actual data is present)
  const availableCategories = useMemo(() => {
    const cats = Array.from(new Set(streamCutoffs.map(c => c.category))).filter(Boolean);
    // Sort so 'General' is first if present
    return cats.sort((a, b) => {
      if (a === 'General') return -1;
      if (b === 'General') return 1;
      return a.localeCompare(b);
    });
  }, [streamCutoffs]);

  const [selectedCategory, setSelectedCategory] = useState<string>('General');

  useEffect(() => {
    if (availableCategories.length > 0 && !availableCategories.includes(selectedCategory)) {
      setSelectedCategory(availableCategories[0]);
    }
  }, [availableCategories]);

  // Cutoffs specifically for selected stream
  const streamCutoffs = useMemo(() => {
    return rawFyjc.filter(c => c.stream.toLowerCase() === selectedStream.toLowerCase());
  }, [rawFyjc, selectedStream]);`;

const replacement = `  // Cutoffs specifically for selected stream
  const streamCutoffs = useMemo(() => {
    return rawFyjc.filter(c => c.stream.toLowerCase() === selectedStream.toLowerCase());
  }, [rawFyjc, selectedStream]);

  // Available reservation categories for this college (only when actual data is present)
  const availableCategories = useMemo(() => {
    const cats = Array.from(new Set(streamCutoffs.map(c => c.category))).filter(Boolean);
    // Sort so 'General' is first if present
    return cats.sort((a, b) => {
      if (a === 'General') return -1;
      if (b === 'General') return 1;
      return a.localeCompare(b);
    });
  }, [streamCutoffs]);

  const [selectedCategory, setSelectedCategory] = useState<string>('General');

  useEffect(() => {
    if (availableCategories.length > 0 && !availableCategories.includes(selectedCategory)) {
      setSelectedCategory(availableCategories[0]);
    }
  }, [availableCategories, selectedCategory]);`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/CollegeDetailScreen.tsx', content);
  console.log('Fixed streamCutoffs');
} else {
  // Let's try matching with regex to ignore whitespace differences
  const regex = /\/\/ Available reservation categories[\s\S]*?\[rawFyjc, selectedStream\]\);/;
  if (regex.test(content)) {
     content = content.replace(regex, replacement);
     fs.writeFileSync('src/components/CollegeDetailScreen.tsx', content);
     console.log('Fixed streamCutoffs via regex');
  } else {
     console.log('Target not found!');
  }
}
