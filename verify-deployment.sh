#!/bin/bash

# BrightPath - Pre-Deployment Verification Script
# This script checks for common issues before deploying to Vercel

echo "🔍 BrightPath Pre-Deployment Verification"
echo "=========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
        ((ERRORS++))
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

echo "1. Checking for merge conflicts..."
if git diff --check > /dev/null 2>&1; then
    if grep -r "<<<<<<< HEAD" src/ 2>/dev/null || grep -r "=======" src/ 2>/dev/null || grep -r ">>>>>>>" src/ 2>/dev/null; then
        print_status 1 "Merge conflict markers found in src/"
    else
        print_status 0 "No merge conflicts detected"
    fi
else
    print_warning "Git check skipped (not in a git repository)"
fi

echo ""
echo "2. Checking required files..."

# Check for required files
[ -f "package.json" ] && print_status 0 "package.json exists" || print_status 1 "package.json missing"
[ -f "vite.config.js" ] && print_status 0 "vite.config.js exists" || print_status 1 "vite.config.js missing"
[ -f "index.html" ] && print_status 0 "index.html exists" || print_status 1 "index.html missing"
[ -f "vercel.json" ] && print_status 0 "vercel.json exists" || print_status 1 "vercel.json missing"
[ -f ".vercelignore" ] && print_status 0 ".vercelignore exists" || print_status 1 ".vercelignore missing"

echo ""
echo "3. Checking package.json configuration..."

# Check if build script exists
if grep -q '"build".*"vite build"' package.json; then
    print_status 0 "Build script configured correctly"
else
    print_status 1 "Build script missing or incorrect"
fi

echo ""
echo "4. Checking for common issues..."

# Check for console.log in production code (info only - removed in build)
CONSOLE_COUNT=$(grep -r "console\.log" src/ --include="*.jsx" --include="*.js" 2>/dev/null | grep -v "console.error" | grep -v "console.warn" | grep -v "// console.log" | wc -l | tr -d ' ')
if [ "$CONSOLE_COUNT" -gt 0 ]; then
    echo -e "${GREEN}ℹ${NC} console.log statements found ($CONSOLE_COUNT) - automatically removed in production build"
fi

# Check for debugger statements
if grep -r "debugger" src/ --include="*.jsx" --include="*.js" > /dev/null 2>&1; then
    print_status 1 "debugger statements found (must remove for production)"
fi

# Check for hardcoded localhost URLs
if grep -r "localhost:3001" src/ --include="*.jsx" --include="*.js" | grep -v "VITE_API_URL" | grep -v "//" > /dev/null 2>&1; then
    print_warning "Hardcoded localhost URLs found (use environment variables)"
fi

echo ""
echo "5. Checking environment configuration..."

if [ -f ".env.example" ]; then
    print_status 0 ".env.example exists"
    
    # Check for VITE_ prefix
    if grep -q "VITE_API_URL" .env.example; then
        print_status 0 "VITE_API_URL documented in .env.example"
    else
        print_status 1 "VITE_API_URL missing from .env.example"
    fi
else
    print_status 1 ".env.example missing"
fi

echo ""
echo "6. Checking for large files..."

# Check for files larger than 1MB in src/
if find src/ -type f -size +1M 2>/dev/null | grep -q .; then
    print_warning "Large files (>1MB) found in src/ directory"
    find src/ -type f -size +1M -exec ls -lh {} \;
fi

echo ""
echo "7. Checking import statements..."

# Check for missing .jsx extensions in imports (can cause issues)
if grep -r "from.*components/" src/ --include="*.jsx" | grep -v "\.jsx" | grep -v "\.js" | grep -v "//" > /dev/null 2>&1; then
    print_warning "Some imports may be missing file extensions"
fi

echo ""
echo "=========================================="
echo "Verification Summary:"
echo "=========================================="

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Ready to deploy.${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS warning(s) found. Review before deploying.${NC}"
    exit 0
else
    echo -e "${RED}✗ $ERRORS error(s) and $WARNINGS warning(s) found.${NC}"
    echo -e "${RED}Please fix errors before deploying.${NC}"
    exit 1
fi
