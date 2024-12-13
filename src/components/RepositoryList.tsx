// src/components/RepositoryList.tsx
'use client';

import { useState, useEffect } from 'react';

interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
}

const RepoCard = ({ repo }: { repo: Repository }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
    <h3 className="text-xl font-semibold mb-2">
      <a 
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:underline"
      >
        {repo.name}
      </a>
    </h3>
    <p className="text-gray-600 dark:text-gray-300 mb-4">
      {repo.description || 'No description available'}
    </p>
    <div className="flex items-center space-x-4 text-sm">
      <span className="flex items-center">
        <span className="w-3 h-3 rounded-full bg-yellow-400 mr-1"></span>
        {repo.language || 'Unknown'}
      </span>
      <span className="flex items-center">
        ⭐ {repo.stargazers_count}
      </span>
      <span className="flex items-center">
        🔄 {repo.forks_count}
      </span>
    </div>
  </div>
);

const RepoFilter = ({ 
  languages, 
  selectedLanguage, 
  onLanguageChange 
}: { 
  languages: string[];
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}) => (
  <div className="mb-6">
    <select 
      value={selectedLanguage} 
      onChange={e => onLanguageChange(e.target.value)}
      className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-4 py-2"
    >
      <option value="">All Languages</option>
      {languages.map(lang => (
        <option key={lang} value={lang}>{lang}</option>
      ))}
    </select>
  </div>
);

export default function RepositoryList() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch('/data/repos.json');
        if (!response.ok) throw new Error('Failed to fetch repositories');
        const data = await response.json();
        setRepos(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  useEffect(() => {
    if (repos.length > 0) {
      // Extract unique languages
      const langs = [...new Set(repos.map(repo => repo.language).filter(Boolean))];
      setLanguages(langs);

      // Filter repos based on selected language
      const filtered = selectedLanguage
        ? repos.filter(repo => repo.language === selectedLanguage)
        : repos;

      // Sort by stars
      const sorted = [...filtered].sort((a, b) => b.stargazers_count - a.stargazers_count);
      setFilteredRepos(sorted);
    }
  }, [repos, selectedLanguage]);

  if (error) return (
    <div className="text-red-500 p-4 rounded-md bg-red-50 dark:bg-red-900/20">
      Error: {error}
    </div>
  );
  
  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <div className="text-gray-500">Loading repositories...</div>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">GitHub Repositories</h2>
      <RepoFilter 
        languages={languages}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRepos.map(repo => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
}