#!/usr/bin/env node
// Security audit script to check for exposed credentials
const fs = require('fs');
const path = require('path');

// Patterns to look for (potential security issues)
const SECURITY_PATTERNS = [
    {
        name: 'Cloudinary API Key',
        pattern: /api_key\s*[:=]\s*['"`]?\d{15}['"`]?/gi,
        severity: 'HIGH'
    },
    {
        name: 'Cloudinary API Secret',
        pattern: /api_secret\s*[:=]\s*['"`][A-Za-z0-9_-]{27}['"`]/gi,
        severity: 'CRITICAL'
    },
    {
        name: 'Hardcoded Password',
        pattern: /password\s*[:=]\s*['"`][^'"`\s]{6,}['"`]/gi,
        severity: 'HIGH'
    },
    {
        name: 'JWT Secret',
        pattern: /jwt_secret\s*[:=]\s*['"`][^'"`\s]{10,}['"`]/gi,
        severity: 'HIGH'
    },
    {
        name: 'Database URL with credentials',
        pattern: /postgresql:\/\/[^:]+:[^@]+@/gi,
        severity: 'MEDIUM'
    }
];

// Files to exclude from scanning
const EXCLUDE_PATTERNS = [
    /node_modules/,
    /\.git/,
    /\.env$/,  // .env files are expected to have credentials
    /\.log$/,
    /security-audit\.js$/,
    /SECURITY_FIX_NOTICE\.md$/
];

// File extensions to scan
const SCAN_EXTENSIONS = ['.js', '.html', '.md', '.json', '.ts', '.jsx', '.tsx'];

function shouldScanFile(filePath) {
    // Check if file should be excluded
    if (EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath))) {
        return false;
    }
    
    // Check if file extension should be scanned
    const ext = path.extname(filePath);
    return SCAN_EXTENSIONS.includes(ext);
}

function scanFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const issues = [];
        
        SECURITY_PATTERNS.forEach(({ name, pattern, severity }) => {
            const matches = content.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    issues.push({
                        file: filePath,
                        issue: name,
                        severity,
                        match: match.substring(0, 50) + (match.length > 50 ? '...' : ''),
                        line: content.substring(0, content.indexOf(match)).split('\n').length
                    });
                });
            }
        });
        
        return issues;
    } catch (error) {
        console.warn(`Warning: Could not scan ${filePath}: ${error.message}`);
        return [];
    }
}

function scanDirectory(dirPath) {
    let allIssues = [];
    
    try {
        const items = fs.readdirSync(dirPath);
        
        items.forEach(item => {
            const itemPath = path.join(dirPath, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                allIssues = allIssues.concat(scanDirectory(itemPath));
            } else if (stat.isFile() && shouldScanFile(itemPath)) {
                allIssues = allIssues.concat(scanFile(itemPath));
            }
        });
    } catch (error) {
        console.warn(`Warning: Could not scan directory ${dirPath}: ${error.message}`);
    }
    
    return allIssues;
}

function runSecurityAudit() {
    console.log('🔍 Running Security Audit...\n');
    
    const startTime = Date.now();
    const issues = scanDirectory('.');
    const endTime = Date.now();
    
    console.log(`📊 Scan completed in ${endTime - startTime}ms\n`);
    
    if (issues.length === 0) {
        console.log('✅ No security issues found!');
        console.log('🎉 All credentials appear to be properly secured.\n');
        return;
    }
    
    // Group issues by severity
    const critical = issues.filter(i => i.severity === 'CRITICAL');
    const high = issues.filter(i => i.severity === 'HIGH');
    const medium = issues.filter(i => i.severity === 'MEDIUM');
    
    if (critical.length > 0) {
        console.log('🚨 CRITICAL ISSUES:');
        critical.forEach(issue => {
            console.log(`   ${issue.file}:${issue.line} - ${issue.issue}`);
            console.log(`   Match: ${issue.match}`);
        });
        console.log();
    }
    
    if (high.length > 0) {
        console.log('⚠️  HIGH SEVERITY ISSUES:');
        high.forEach(issue => {
            console.log(`   ${issue.file}:${issue.line} - ${issue.issue}`);
            console.log(`   Match: ${issue.match}`);
        });
        console.log();
    }
    
    if (medium.length > 0) {
        console.log('📋 MEDIUM SEVERITY ISSUES:');
        medium.forEach(issue => {
            console.log(`   ${issue.file}:${issue.line} - ${issue.issue}`);
            console.log(`   Match: ${issue.match}`);
        });
        console.log();
    }
    
    console.log(`📈 Summary: ${critical.length} critical, ${high.length} high, ${medium.length} medium severity issues found.`);
    
    if (critical.length > 0 || high.length > 0) {
        console.log('\n🔧 Recommended Actions:');
        console.log('1. Move all hardcoded credentials to environment variables');
        console.log('2. Add credentials to .env file (which is gitignored)');
        console.log('3. Update code to use process.env.VARIABLE_NAME');
        console.log('4. Rotate any exposed credentials');
        
        process.exit(1);
    }
}

// Run the audit
if (require.main === module) {
    runSecurityAudit();
}

module.exports = { runSecurityAudit, scanFile, scanDirectory };
