/**
 * Site Health Check
 * Monitors site functionality and reports issues
 */

class SiteHealthCheck {
    constructor() {
        this.checks = [];
        this.healthScore = 100;
        this.issues = [];
        this.runChecks();
    }

    runChecks() {
        // console.log('🔍 Running site health check...');

        this.checkScriptLoading();
        this.checkImages();
        this.checkLinks();
        this.checkPerformance();
        this.checkAccessibility();
        this.checkSecurity();

        this.generateReport();
    }

    checkScriptLoading() {
        const requiredScripts = [
            'script.js',
            'language-system.js',
            'mobile-enhancements.js',
            'global-search.js',
            'error-handling.js',
            'performance-optimizer.js'
        ];

        const loadedScripts = Array.from(document.scripts).map(script => {
            const src = script.src;
            return src.split('/').pop();
        });

        requiredScripts.forEach(script => {
            if (!loadedScripts.includes(script)) {
                this.addIssue(`Missing script: ${script}`, 'warning');
                this.healthScore -= 5;
            }
        });

        this.addCheck('Script Loading', requiredScripts.length === loadedScripts.filter(s => requiredScripts.includes(s)).length);
    }

    checkImages() {
        const images = document.querySelectorAll('img');
        let brokenImages = 0;

        images.forEach(img => {
            if (img.complete && img.naturalHeight === 0) {
                brokenImages++;
                this.addIssue(`Broken image: ${img.src}`, 'error');
            }
        });

        if (brokenImages > 0) {
            this.healthScore -= brokenImages * 3;
        }

        this.addCheck('Images', brokenImages === 0);
    }

    checkLinks() {
        const links = document.querySelectorAll('a[href]');
        let suspiciousLinks = 0;

        links.forEach(link => {
            const href = link.href;

            // Check for potentially broken internal links
            if (href.includes(window.location.hostname) && !href.includes('#')) {
                // Could implement actual link checking here
                if (href.includes('undefined') || href.includes('null')) {
                    suspiciousLinks++;
                    this.addIssue(`Suspicious link: ${href}`, 'warning');
                }
            }

            // Check for mixed content
            if (window.location.protocol === 'https:' && href.startsWith('http:')) {
                this.addIssue(`Mixed content link: ${href}`, 'warning');
                this.healthScore -= 2;
            }
        });

        this.addCheck('Links', suspiciousLinks === 0);
    }

    checkPerformance() {
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                const loadTime = navigation.loadEventEnd - navigation.fetchStart;

                if (loadTime > 5000) {
                    this.addIssue(`Slow load time: ${loadTime.toFixed(0)}ms`, 'warning');
                    this.healthScore -= 10;
                } else if (loadTime > 3000) {
                    this.addIssue(`Moderate load time: ${loadTime.toFixed(0)}ms`, 'info');
                    this.healthScore -= 5;
                }

                this.addCheck('Performance', loadTime < 3000);
            }
        }

        // Check for large DOM
        const domSize = document.querySelectorAll('*').length;
        if (domSize > 1500) {
            this.addIssue(`Large DOM size: ${domSize} elements`, 'warning');
            this.healthScore -= 5;
        }

        this.addCheck('DOM Size', domSize < 1500);
    }

    checkAccessibility() {
        let accessibilityIssues = 0;

        // Check for missing alt attributes
        const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
        if (imagesWithoutAlt.length > 0) {
            this.addIssue(`${imagesWithoutAlt.length} images missing alt text`, 'warning');
            accessibilityIssues++;
        }

        // Check for proper heading structure
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        if (headings.length === 0) {
            this.addIssue('No headings found', 'warning');
            accessibilityIssues++;
        }

        // Check for focus indicators
        const focusableElements = document.querySelectorAll('button, a, input, select, textarea');
        let elementsWithoutFocus = 0;

        focusableElements.forEach(element => {
            const styles = window.getComputedStyle(element, ':focus');
            if (!styles.outline && !styles.boxShadow) {
                elementsWithoutFocus++;
            }
        });

        if (elementsWithoutFocus > 0) {
            this.addIssue(`${elementsWithoutFocus} elements lack focus indicators`, 'info');
        }

        if (accessibilityIssues > 0) {
            this.healthScore -= accessibilityIssues * 3;
        }

        this.addCheck('Accessibility', accessibilityIssues === 0);
    }

    checkSecurity() {
        let securityIssues = 0;

        // Check for mixed content
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            if (window.location.protocol === 'https:' && script.src.startsWith('http:')) {
                this.addIssue(`Mixed content script: ${script.src}`, 'error');
                securityIssues++;
            }
        });

        // Check for inline scripts (potential XSS risk)
        const inlineScripts = document.querySelectorAll('script:not([src])');
        if (inlineScripts.length > 5) {
            this.addIssue(`Many inline scripts detected: ${inlineScripts.length}`, 'info');
        }

        // Check for hardcoded credentials (basic check)
        const scriptContent = Array.from(document.scripts)
            .filter(script => !script.src)
            .map(script => script.textContent.toLowerCase())
            .join(' ');

        if (scriptContent.includes('password') && scriptContent.includes('admin')) {
            this.addIssue('Potential hardcoded credentials found', 'error');
            securityIssues++;
        }

        if (securityIssues > 0) {
            this.healthScore -= securityIssues * 10;
        }

        this.addCheck('Security', securityIssues === 0);
    }

    addCheck(name, passed) {
        this.checks.push({
            name: name,
            passed: passed,
            timestamp: new Date().toISOString()
        });
    }

    addIssue(message, severity) {
        this.issues.push({
            message: message,
            severity: severity,
            timestamp: new Date().toISOString()
        });
    }

    generateReport() {
        const report = {
            healthScore: Math.max(0, this.healthScore),
            checks: this.checks,
            issues: this.issues,
            summary: this.getSummary(),
            timestamp: new Date().toISOString()
        };

        console.group('🏥 Site Health Report');
        // console.log(`Health Score: ${report.healthScore}/100`);

        if (report.issues.length > 0) {
            console.group('Issues Found:');
            report.issues.forEach(issue => {
                const icon = this.getIssueIcon(issue.severity);
                // console.log(`${icon} ${issue.message}`);
            });
            console.groupEnd();
        }

        console.group('Check Results:');
        report.checks.forEach(check => {
            const icon = check.passed ? '✅' : '❌';
            // console.log(`${icon} ${check.name}`);
        });
        console.groupEnd();

        // console.log('Summary:', report.summary);
        console.groupEnd();

        // Store report for debugging
        window.siteHealthReport = report;

        // Show user notification if critical issues found
        if (report.healthScore < 80) {
            this.showHealthWarning(report);
        }

        return report;
    }

    getIssueIcon(severity) {
        const icons = {
            error: '🚨',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[severity] || 'ℹ️';
    }

    getSummary() {
        const totalChecks = this.checks.length;
        const passedChecks = this.checks.filter(check => check.passed).length;
        const errorCount = this.issues.filter(issue => issue.severity === 'error').length;
        const warningCount = this.issues.filter(issue => issue.severity === 'warning').length;

        return {
            totalChecks: totalChecks,
            passedChecks: passedChecks,
            errorCount: errorCount,
            warningCount: warningCount,
            status: this.healthScore >= 90 ? 'excellent' :
                   this.healthScore >= 80 ? 'good' :
                   this.healthScore >= 60 ? 'fair' : 'poor'
        };
    }

    showHealthWarning(report) {
        if (window.errorHandler) {
            const criticalIssues = report.issues.filter(issue => issue.severity === 'error').length;
            if (criticalIssues > 0) {
                window.errorHandler.showWarningToast(
                    `Site health check found ${criticalIssues} critical issue(s). Check console for details.`
                );
            }
        }
    }

    // Public API
    runManualCheck() {
        this.checks = [];
        this.issues = [];
        this.healthScore = 100;
        this.runChecks();
    }

    getReport() {
        return window.siteHealthReport || null;
    }

    exportReport() {
        const report = this.getReport();
        if (report) {
            const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `site-health-report-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }
}

// Initialize health check
if (typeof window !== 'undefined') {
    // Run health check after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            window.siteHealthCheck = new SiteHealthCheck();
        }, 2000);
    });

    // Add health check to global error handler if available
    if (window.errorHandler) {
        window.errorHandler.healthCheck = () => {
            if (window.siteHealthCheck) {
                window.siteHealthCheck.runManualCheck();
            }
        };
    }
}