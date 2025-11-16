#!/bin/bash
echo "=== REACT APP ERROR DIAGNOSIS ==="
echo

echo "1. Checking for syntax errors..."
find src -name "*.js" -exec node -c {} \; 2>&1 | grep -i error | head -10

echo
echo "2. Checking for missing exports..."
find src -name "*.js" -exec grep -l "export default" {} \; > /dev/null || echo "Some files missing default exports"

echo
echo "3. Checking for StoreContext usage..."
grep -r "useContext(StoreContext)" src/ --include="*.js" | head -5

echo
echo "4. Checking test files..."
find src -name "*.test.js" | head -5

echo
echo "5. Current npm start errors..."
echo "Run 'npm start' to see current compilation errors"
