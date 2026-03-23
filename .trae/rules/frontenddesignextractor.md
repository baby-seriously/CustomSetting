***

name: "critical-code-reviewer"
description: "执行严格的对抗性代码审查，识别安全漏洞、惰性模式、边界失败与不良实践。Invoke when user requests strict code review or PR analysis."
--------------------------------------------------------------------------------------------------------------

# Critical Code Reviewer

## Overview

This skill performs rigorous adversarial code reviews to identify security vulnerabilities, anti-patterns, boundary failures, and bad practices in codebases. It provides structured feedback with severity levels and actionable recommendations to improve code quality and security.

## Features

### 1. Security Analysis

- Identifies security vulnerabilities and potential attack vectors
- Reviews authentication and authorization logic
- Analyzes input validation and sanitization
- Detects sensitive data exposure

### 2. Code Quality Assessment

- Identifies code smells and anti-patterns
- Reviews error handling and exception management
- Analyzes code complexity and maintainability
- Detects dead code and unused dependencies

### 3. Performance Evaluation

- Identifies performance bottlenecks
- Reviews memory usage and resource management
- Analyzes algorithm complexity
- Detects inefficient code patterns

### 4. Type Safety Analysis

- Reviews TypeScript usage and type definitions
- Identifies type-related issues and potential runtime errors
- Analyzes type inference and type guards
- Detects unsafe type casts and assertions

### 5. Best Practices Compliance

- Evaluates code against industry best practices
- Reviews coding standards and style guidelines
- Analyzes architectural decisions and patterns
- Detects violations of design principles

## Usage

To use this skill, prefix your request with one of the following commands:

- `/review` - For comprehensive code review
- `/security` - For security-focused analysis
- `/performance` - For performance evaluation
- `/types` - For TypeScript type safety analysis
- `/best-practices` - For best practices compliance check

## Example

**Input:**
`/review Please review the authentication module for security vulnerabilities and code quality issues.`

**Output:**

```
# Critical Code Review Results

## Security Issues
1. **High Severity**: Hardcoded API keys found in source code
2. **Medium Severity**: Missing input validation for user credentials
3. **Low Severity**: Inadequate password strength validation

## Code Quality Issues
1. **Code Smell**: Duplicate error handling logic
2. **Anti-pattern**: Nested callbacks leading to callback hell
3. **Maintenance Issue**: Missing documentation for authentication flow

## Recommendations
1. Move API keys to environment variables
2. Implement comprehensive input validation
3. Strengthen password validation rules
4. Refactor callback-based code to use async/await
5. Add documentation for authentication flow
```

## Supported Technologies

- JavaScript/TypeScript
- React and React Native
- Node.js
- Python
- Java
- Go
- SQL

## Review Process

1. **Code Analysis**: Scans codebase for issues and vulnerabilities
2. **Severity Assessment**: Evaluates each issue based on impact and likelihood
3. **Recommendation Generation**: Provides actionable solutions for each issue
4. **Report Creation**: Compiles findings into a structured report

## Severity Levels

- **Critical**: Immediate fix required, poses significant security or functionality risk
- **High**: Important to fix, may cause security vulnerabilities or performance issues
- **Medium**: Should be fixed, affects code quality or maintainability
- **Low**: Suggested improvement, minor issue or best practice violation

The Critical Code Reviewer skill helps ensure codebases are secure, maintainable, and performant by identifying potential issues early in the development process.
