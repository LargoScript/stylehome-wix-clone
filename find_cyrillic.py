#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to find all Cyrillic characters in code files
Usage: python find_cyrillic.py
"""

import os
import re
import csv
from pathlib import Path

# Cyrillic pattern
CYRILLIC_PATTERN = re.compile(r'[А-Яа-яЁёІіЇїЄєҐґ]')

# File extensions to check
EXTENSIONS = {'.ts', '.js', '.css', '.html', '.java', '.yml', '.yaml', '.json'}

# Directories to exclude
EXCLUDE_DIRS = {'node_modules', 'dist', 'target', '.git', '__pycache__', 'backend/target'}

def should_exclude(filepath):
    """Check if file should be excluded"""
    parts = Path(filepath).parts
    for exclude_dir in EXCLUDE_DIRS:
        if exclude_dir in parts:
            return True
    return False

def find_cyrillic_in_file(filepath):
    """Find Cyrillic characters in a file"""
    results = []
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            for line_num, line in enumerate(f, 1):
                if CYRILLIC_PATTERN.search(line):
                    results.append({
                        'file': str(filepath),
                        'line': line_num,
                        'text': line.strip()
                    })
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
    return results

def main():
    """Main function"""
    print("Searching for Cyrillic characters in code files...")
    print()
    
    results = []
    base_path = Path('.')
    
    for filepath in base_path.rglob('*'):
        if filepath.is_file() and filepath.suffix in EXTENSIONS:
            if not should_exclude(filepath):
                file_results = find_cyrillic_in_file(filepath)
                results.extend(file_results)
    
    if results:
        print(f"Found {len(results)} lines with Cyrillic characters:")
        print()
        
        # Group by file
        by_file = {}
        for result in results:
            file = result['file']
            if file not in by_file:
                by_file[file] = []
            by_file[file].append(result)
        
        # Print results (skip printing to avoid encoding issues)
        print(f"Found Cyrillic in {len(by_file)} files")
        
        # Save to CSV
        with open('cyrillic_found.csv', 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=['file', 'line', 'text'])
            writer.writeheader()
            writer.writerows(results)
        
        print(f"\nResults saved to cyrillic_found.csv")
    else:
        print("No Cyrillic characters found!")
    
    return results

if __name__ == '__main__':
    main()
