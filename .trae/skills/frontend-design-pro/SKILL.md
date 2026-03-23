---
name: frontend-design-pro
description: 提供前端设计质量提升，包括UI/前端代码审计、优化和设计审查。Invoke when user requests frontend design improvements or code quality analysis.
---

# Frontend Design Pro

## Overview

This skill provides comprehensive frontend design quality improvement services, including UI/frontend code audit, optimization, and design review. It helps identify common design anti-patterns and provides actionable recommendations to enhance the visual appeal and user experience of web applications.

## Features

### 1. Design Audit (/audit)
- Analyzes UI components for design consistency
- Identifies design anti-patterns and best practices violations
- Provides detailed feedback on layout, typography, color, and spacing
- Evaluates accessibility compliance

### 2. Code Polish (/polish)
- Optimizes frontend code for performance and maintainability
- Improves code structure and organization
- Enhances code readability and consistency
- Reduces technical debt

### 3. Design Critique (/critique)
- Provides constructive feedback on visual design
- Evaluates user experience and interaction design
- Identifies areas for improvement in usability
- Suggests design enhancements based on industry best practices

### 4. Color Palette Optimization (/colorize)
- Analyzes existing color schemes
- Suggests optimized color palettes based on design principles
- Ensures color accessibility and contrast compliance
- Provides color system recommendations

### 5. Animation Enhancement (/animate)
- Reviews existing animations and transitions
- Suggests improvements for smoother user experience
- Provides animation best practices
- Optimizes animation performance

### 6. Typography Enhancement (/bold)
- Analyzes typography hierarchy and consistency
- Suggests font combinations and sizing
- Improves text readability and scannability
- Provides typography best practices

## Usage

To use this skill, prefix your request with one of the following commands:

- `/audit` - For design and code audit
- `/polish` - For code optimization
- `/critique` - For design feedback
- `/colorize` - For color palette optimization
- `/animate` - For animation enhancement
- `/bold` - For typography improvement

## Example

**Input:**
`/audit Please review the login page components for design consistency and accessibility.`

**Output:**
```
# Design Audit Results

## Issues Found
1. **Color Contrast**: The submit button text has insufficient contrast against the background (WCAG AA violation)
2. **Typography Hierarchy**: Inconsistent heading sizes across the page
3. **Spacing**: Uneven padding between form elements
4. **Accessibility**: Missing aria labels for form inputs

## Recommendations
1. Increase button text contrast to at least 4.5:1 ratio
2. Establish a consistent typography scale
3. Implement uniform spacing system
4. Add appropriate aria labels for all interactive elements
```

## Design Language Reference

This skill follows the design language principles from the impeccable project, emphasizing:
- Visual consistency
- Responsive design
- Accessibility
- Performance optimization
- User-centered design

## Supported Technologies

- React
- TypeScript
- CSS/SCSS/Less
- HTML5
- JavaScript