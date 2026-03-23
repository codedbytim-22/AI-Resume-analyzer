# 🎨 CSS Quick Reference Guide - Resume Analyzer

**File:** `public/Assets/CSS/style.css` (Single file, ~400 lines)

## **1. COLOR SYSTEM (Lines 4-12)**

```css
:root {
  --bg-color: #e0e5ec; /* Light blue-gray background */
  --text-main: #2d4d5a; /* Dark blue-gray text */
  --text-muted: #74858c; /* Muted gray */
  --primary-accent: #5dbcd2; /* Cyan buttons/links */
  --white-shadow: #ffffff;
  --dark-shadow: #a3b1c6;
}
```

**To change:**

- Background: `--bg-color`
- Button color: `--primary-accent`
- Text: `--text-main`

## **2. BUTTONS (Lines 245-260)**

```css
.btn-primary {
  background: var(--primary-accent);
  color: white;
}
.btn-secondary {
  background: var(--bg-color);
  color: var(--text-main);
}
```

**Examples:** All "Login/Signup/Upload" buttons use `.btn-primary`

**To change button color:** Edit `--primary-accent` in `:root`

## **3. NEUMORPHIC CARDS (Lines 140-170)**

**All cards/forms use this effect:**

```css
box-shadow:
  15px 15px 30px var(--dark-shadow),
  -15px 15px 30px var(--white-shadow);
```

**Classes:** `.form-card`, `.feature-card`, `.upload-panel`, `.action-card`

**To change card shadows:**

- Softer: Reduce `15px` → `10px`
- Darker: Change `--dark-shadow`

## **4. INPUT FIELDS (Lines 175-190)**

```css
.form-input {
  background: var(--bg-color);
  box-shadow:
    inset 6px 6px 12px var(--dark-shadow),
    inset -6px 6px 12px var(--white-shadow);
}
```

**"Inset" effect = sunken look**

## **5. NAVIGATION LINKS (Lines 85-115)**

```css
nav a {
  background: var(--bg-color);
  box-shadow:
    5px 5px 10px var(--dark-shadow),
    -5px 5px 10px var(--white-shadow);
}
nav a[aria-current="page"] {
  box-shadow: inset...;
} /* Active page */
```

**Hover:** Smaller shadows + color change to `--primary-accent`

## **6. MOST IMPORTANT SELECTORS**

```
1. :root (lines 4-12) ← CHANGE COLORS HERE
2. .btn-primary (line 248) ← MAIN BUTTON COLOR
3. nav a (line 85) ← NAV LINKS
4. .form-card (line 140) ← ALL CARDS/FORMS
5. body (line 26) ← OVERALL BACKGROUND
```

## **7. QUICK MODIFICATIONS**

| **What to change** | **CSS Line**              | **Example**              |
| ------------------ | ------------------------- | ------------------------ |
| All backgrounds    | Line 4 `--bg-color`       | `#f8f9fa`                |
| Button color       | Line 4 `--primary-accent` | `#28a745` (green)        |
| Text color         | Line 5 `--text-main`      | `#000000`                |
| Nav active color   | Line 105                  | `color: red !important;` |
| Card shadows       | Line 150                  | Reduce `15px` → `8px`    |

## **8. RESPONSIVE BREAKPOINTS**

- **Tablet:** `@media (max-width: 1024px)` line 340
- **Mobile:** `@media (max-width: 768px)` line 360
- **Small:** `@media (max-width: 480px)` line 410

**Mobile:** Cards stack vertically, buttons full-width automatically.

## **9. LIVE PREVIEW**

```
Open any HTML → F12 → Elements tab → Hover CSS classes
See .btn-primary → Line 248
See nav a → Line 85
```

**CSS is 100% CSS Variables + Neumorphism. Change 5 variables in :root = instant theme! 🎉**
